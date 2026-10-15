/**
 * Professional Web Audio API Synthesizer & Audio Engine
 * Provides authentic, high-fidelity generative soundscapes with zero external MP3 dependencies.
 * Also generates pleasant acoustic chimes for timer completions.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSourceNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private isRunning: boolean = false;
  private currentTrackId: string | null = null;
  private activeIntervals: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  public stop() {
    this.activeIntervals.forEach(id => clearInterval(id));
    this.activeIntervals = [];

    if (this.masterGain && this.ctx) {
      // Gentle fade out
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    }

    setTimeout(() => {
      this.currentSourceNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {}
      });
      this.currentSourceNodes = [];
      this.isRunning = false;
      this.currentTrackId = null;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      }
    }, 200);
  }

  public playTrack(trackId: string, synthType: string) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // If currently running something, stop it first
    this.stop();

    this.isRunning = true;
    this.currentTrackId = trackId;

    // Smooth fade in
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.3);

    switch (synthType) {
      case 'rain':
        this.createRainGenerator();
        break;
      case 'pinknoise':
      case 'whitenoise':
        this.createNoiseGenerator(synthType === 'pinknoise');
        break;
      case 'drone':
        this.createBinauralDrone(136.1, 40); // 136.1 Hz Om tuning with 40Hz gamma beat
        break;
      case 'waves':
        this.createOceanWaves();
        break;
      case 'lofiChords':
        this.createLoFiChords();
        break;
      case 'spacePad':
        this.createSpaceAmbient();
        break;
      case 'forest':
        this.createForestWind();
        break;
      default:
        this.createBinauralDrone(108, 14);
        break;
    }
  }

  /**
   * Generates continuous natural rainfall with lowpass/bandpass filters
   */
  private createRainGenerator() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.setValueAtTime(250, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(filter2);
    filter2.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(0);
    this.currentSourceNodes.push(whiteNoise, filter, filter2, gain);
  }

  /**
   * Generates calibrated Pink Noise or White Noise
   */
  private createNoiseGenerator(isPink: boolean) {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (isPink) {
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.035;
      }
    } else {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.03;
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(this.masterGain);

    source.start(0);
    this.currentSourceNodes.push(source, filter);
  }

  /**
   * Binaural beat drone synthesizer with fundamental and target cognitive frequency
   */
  private createBinauralDrone(baseFreq: number, beatFreq: number) {
    if (!this.ctx || !this.masterGain) return;

    const oscLeft = this.ctx.createOscillator();
    const oscRight = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();

    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    subOsc.type = 'triangle';

    oscLeft.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    oscRight.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);
    subOsc.frequency.setValueAtTime(baseFreq / 2, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    const gainLeft = this.ctx.createGain();
    const gainRight = this.ctx.createGain();
    const subGain = this.ctx.createGain();

    gainLeft.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gainRight.gain.setValueAtTime(0.18, this.ctx.currentTime);
    subGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

    oscLeft.connect(gainLeft);
    gainLeft.connect(merger, 0, 0);

    oscRight.connect(gainRight);
    gainRight.connect(merger, 0, 1);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    merger.connect(this.masterGain);

    oscLeft.start(0);
    oscRight.start(0);
    subOsc.start(0);

    this.currentSourceNodes.push(oscLeft, oscRight, subOsc, merger, gainLeft, gainRight, subGain);
  }

  /**
   * Generative ocean waves with low-frequency wave oscillation
   */
  private createOceanWaves() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // LFO for wave swelling
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8 second cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(320, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noiseSource.start(0);
    lfo.start(0);

    this.currentSourceNodes.push(noiseSource, lfo, filter, lfoGain, waveGain);
  }

  /**
   * Warm Lo-Fi electric piano harmonic cluster with subtle detuning
   */
  private createLoFiChords() {
    if (!this.ctx || !this.masterGain) return;

    const chordFreqs = [220, 277.18, 329.63, 415.30]; // A maj7 chord
    const oscNodes: OscillatorNode[] = [];
    const chordGain = this.ctx.createGain();
    chordGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    chordFreqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), this.ctx.currentTime);
      osc.connect(filter);
      osc.start(0);
      oscNodes.push(osc);
    });

    filter.connect(chordGain);
    chordGain.connect(this.masterGain);

    this.currentSourceNodes.push(...oscNodes, filter, chordGain);
  }

  /**
   * Space ambient drone
   */
  private createSpaceAmbient() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [65.41, 98.0, 130.81, 196.0]; // C low fifths
    const oscs: OscillatorNode[] = [];
    const padGain = this.ctx.createGain();
    padGain.gain.setValueAtTime(0.09, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);

    freqs.forEach(freq => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(filter);
      osc.start(0);
      oscs.push(osc);
    });

    filter.connect(padGain);
    padGain.connect(this.masterGain);

    this.currentSourceNodes.push(...oscs, filter, padGain);
  }

  /**
   * Forest wind breeze
   */
  private createForestWind() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(this.masterGain);

    source.start(0);
    lfo.start(0);

    this.currentSourceNodes.push(source, lfo, filter, lfoGain);
  }

  /**
   * Plays a high quality Zen singing bowl / bell chime for timer completion
   */
  public playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [528, 1056, 1584]; // Solfeggio 528 Hz miracle tone harmonics
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const initialVol = (0.25 / (idx + 1)) * (this.isMuted ? 0 : this.volume);
        gain.gain.setValueAtTime(initialVol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0 + idx * 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 3.8);
      });
    } catch (e) {
      console.warn('Could not play chime', e);
    }
  }
}

export const audioService = new AudioService();

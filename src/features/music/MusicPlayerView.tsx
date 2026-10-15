import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { AMBIENT_TRACKS } from '../../data/defaultData';
import { AmbientSoundCategory } from '../../types';
import { Card } from '../../components/ui/Card';
import { Slider } from '../../components/ui/Slider';
import { Badge } from '../../components/ui/Badge';
import { 
  Headphones, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  Activity, 
  CloudRain, 
  Wind, 
  Sparkles, 
  Waves, 
  Orbit 
} from 'lucide-react';

export const MusicPlayerView: React.FC = () => {
  const { 
    activeTrackId, 
    isPlayingAudio, 
    playTrack, 
    toggleAudio, 
    nextTrack, 
    prevTrack, 
    audioVolume, 
    setAudioVolume, 
    isAudioMuted, 
    toggleAudioMute 
  } = useTimeStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: string[] = [
    'ALL',
    'LO-FI',
    'FOCUS',
    'AMBIENT',
    'NATURE',
    'RAIN',
    'DEEP',
    'SPACE',
    'WHITE NOISE'
  ];

  const currentTrack = AMBIENT_TRACKS.find(t => t.id === activeTrackId) || AMBIENT_TRACKS[0];

  const filteredTracks = AMBIENT_TRACKS.filter(t => 
    selectedCategory === 'ALL' || t.category === selectedCategory
  );

  const getCategoryIcon = (cat: AmbientSoundCategory) => {
    switch (cat) {
      case 'RAIN': return <CloudRain size={16} />;
      case 'NATURE': return <Wind size={16} />;
      case 'FOCUS': return <Activity size={16} />;
      case 'AMBIENT': return <Sparkles size={16} />;
      case 'DEEP': return <Waves size={16} />;
      case 'SPACE': return <Orbit size={16} />;
      default: return <Radio size={16} />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Headphones size={20} />
            <span>Ambient Soundscapes</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Real-time generative Web Audio synthesizer for calm, focus, and restoration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isPlayingAudio ? 'success' : 'neutral'} size="md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle mr-1" />
            <span className="font-mono text-xs">{isPlayingAudio ? 'Active Soundscape' : 'Engine Idle'}</span>
          </Badge>
        </div>
      </div>

      {/* Hero Now Playing / Visualizer Card */}
      <Card className="p-6 bg-[#111111] border-white/15">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Track information */}
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-20 h-20 rounded-2xl bg-[#181818] border border-white/10 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
              {isPlayingAudio && (
                <div className="absolute inset-0 flex items-end justify-center gap-1 pb-3 opacity-70">
                  <div className="w-1 bg-white animate-pulse" style={{ height: '55%', animationDuration: '600ms' }} />
                  <div className="w-1 bg-white animate-pulse" style={{ height: '80%', animationDuration: '450ms' }} />
                  <div className="w-1 bg-white animate-pulse" style={{ height: '40%', animationDuration: '700ms' }} />
                  <div className="w-1 bg-white animate-pulse" style={{ height: '65%', animationDuration: '500ms' }} />
                </div>
              )}
              {getCategoryIcon(currentTrack.category)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">{currentTrack.category}</Badge>
                <span className="text-[11px] font-mono text-[#666666]">Web Audio Generative</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{currentTrack.name}</h3>
              <p className="text-xs text-[#A0A0A0] mt-1 max-w-md">{currentTrack.description}</p>
            </div>
          </div>

          {/* Right: Master Audio Controls */}
          <div className="flex flex-col items-center sm:items-end gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <button
                onClick={prevTrack}
                className="p-2.5 rounded-full text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Previous Track (←)"
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={toggleAudio}
                className="p-4 rounded-full bg-white text-black hover:bg-[#E5E5E5] transition-all transform active:scale-95 shadow-xl cursor-pointer"
                title={isPlayingAudio ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlayingAudio ? <Pause size={22} /> : <Play size={22} className="translate-x-[1px]" />}
              </button>

              <button
                onClick={nextTrack}
                className="p-2.5 rounded-full text-[#A0A0A0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Next Track (→)"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 w-48 mt-1">
              <button
                onClick={toggleAudioMute}
                className="text-[#666666] hover:text-white transition-colors cursor-pointer"
              >
                {isAudioMuted || audioVolume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <Slider
                value={isAudioMuted ? 0 : audioVolume * 100}
                min={0}
                max={100}
                onChange={(val) => setAudioVolume(val / 100)}
              />
              <span className="text-[11px] font-mono text-[#666666] w-7 text-right">
                {isAudioMuted ? '0%' : `${Math.round(audioVolume * 100)}%`}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white text-black font-semibold border-white shadow-xs'
                : 'bg-[#111111] text-[#A0A0A0] border-white/8 hover:text-white hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Soundscape Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTracks.map(track => {
          const isCurrent = currentTrack.id === track.id;
          const isPlayingThis = isCurrent && isPlayingAudio;

          return (
            <Card
              key={track.id}
              interactive
              onClick={() => {
                if (isCurrent) {
                  toggleAudio();
                } else {
                  playTrack(track.id);
                }
              }}
              active={isCurrent}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isPlayingThis ? 'bg-white text-black' : 'bg-[#161616] text-[#A0A0A0]'
                }`}>
                  {isPlayingThis ? <Pause size={16} /> : <Play size={16} className="translate-x-[0.5px]" />}
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{track.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#A0A0A0]">
                      {track.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] truncate mt-0.5">{track.description}</p>
                </div>
              </div>

              {isCurrent && isPlayingAudio && (
                <div className="shrink-0 flex items-center gap-1 pl-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

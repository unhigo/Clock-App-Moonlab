import React, { useState, useEffect, useRef } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { CircularProgress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ControlPanel, ControlNumber, ControlButton } from '../../components/controls';
import { audioService } from '../../services/audioService';
import { NotificationService } from '../../services/notificationService';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { padZero } from '../../utils/date';

export const TimerView: React.FC = () => {
  const { settings, addToast } = useTimeStore();

  const presets = [
    { label: '1m', minutes: 1 },
    { label: '5m', minutes: 5 },
    { label: '10m', minutes: 10 },
    { label: '15m', minutes: 15 },
    { label: '30m', minutes: 30 },
    { label: '60m', minutes: 60 }
  ];

  const [inputH, setInputH] = useState<string>('00');
  const [inputM, setInputM] = useState<string>('15');
  const [inputS, setInputS] = useState<string>('00');

  const [totalSeconds, setTotalSeconds] = useState<number>(15 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  const timerRef = useRef<number | null>(null);

  // Set preset
  const handlePreset = (mins: number) => {
    if (status === 'running') return;
    const secs = mins * 60;
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setStatus('idle');
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    setInputH(padZero(h));
    setInputM(padZero(m));
    setInputS('00');
  };

  const handleCustomApply = () => {
    const h = parseInt(inputH, 10) || 0;
    const m = parseInt(inputM, 10) || 0;
    const s = parseInt(inputS, 10) || 0;
    const total = h * 3600 + m * 60 + s;
    if (total <= 0) {
      addToast('Please enter a duration greater than 0', 'warning');
      return;
    }
    setTotalSeconds(total);
    setTimeLeft(total);
    setStatus('idle');
  };

  // Timer loop
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  // Document title sync
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      const h = Math.floor(timeLeft / 3600);
      const m = Math.floor((timeLeft % 3600) / 60);
      const s = timeLeft % 60;
      const display = h > 0 ? `${padZero(h)}:${padZero(m)}:${padZero(s)}` : `${padZero(m)}:${padZero(s)}`;
      NotificationService.updateDocumentTitle(`(${display}) Timer`);
    } else {
      NotificationService.updateDocumentTitle();
    }
  }, [timeLeft, status]);

  const handleComplete = () => {
    setStatus('idle');
    setTimeLeft(totalSeconds);

    if (settings.soundAlerts) {
      audioService.playChime();
    }
    NotificationService.triggerHaptic('success');
    NotificationService.sendNotification('Timer Finished', 'Your timer countdown has reached zero.');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    addToast('Timer finished!', 'success');
  };

  const handleReset = () => {
    setStatus('idle');
    setTimeLeft(totalSeconds);
  };

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <TimerIcon size={20} />
            <span>Precision Timer</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Independent chronometer for bespoke intervals and events
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presets.map(p => (
            <button
              key={p.minutes}
              disabled={status === 'running'}
              onClick={() => handlePreset(p.minutes)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer disabled:opacity-30 ${
                totalSeconds === p.minutes * 60
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-[#111111] text-[#A0A0A0] border-white/8 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Circular Timer Display */}
      <div className="flex flex-col items-center justify-center py-6">
        <CircularProgress
          value={progressPercent}
          size={310}
          strokeWidth={6}
          className="shadow-2xl"
        >
          <div className="text-center select-none">
            <div className="text-5xl sm:text-6xl font-mono font-bold text-white tracking-tighter tabular-nums">
              {hours > 0 ? `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}` : `${padZero(minutes)}:${padZero(seconds)}`}
            </div>
            <div className="text-xs font-mono text-[#A0A0A0] mt-2 uppercase tracking-widest">
              {status === 'running' ? 'Counting Down' : status === 'paused' ? 'Paused' : 'Ready'}
            </div>
          </div>
        </CircularProgress>

        {/* Primary Controls */}
        <div className="flex items-center gap-3 mt-8">
          {status === 'running' ? (
            <Button
              variant="secondary"
              size="lg"
              icon={<Pause size={18} />}
              onClick={() => setStatus('paused')}
              className="px-6"
            >
              Pause
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              icon={<Play size={18} />}
              onClick={() => setStatus('running')}
              className="px-8"
            >
              {status === 'paused' ? 'Resume' : 'Start'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            icon={<RotateCcw size={18} />}
            onClick={handleReset}
            title="Reset timer"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Custom Duration Adjuster */}
      <div className="max-w-xl mx-auto w-full">
        <ControlPanel
          title="Custom Duration Input"
          description="Set precise hours, minutes, and seconds"
          columns={3}
        >
          <ControlNumber
            label="Hours"
            value={parseInt(inputH, 10) || 0}
            min={0}
            max={23}
            step={1}
            disabled={status === 'running'}
            onChange={(v) => {
              setInputH(padZero(v));
            }}
          />

          <ControlNumber
            label="Minutes"
            value={parseInt(inputM, 10) || 0}
            min={0}
            max={59}
            step={1}
            disabled={status === 'running'}
            onChange={(v) => {
              setInputM(padZero(v));
            }}
          />

          <ControlNumber
            label="Seconds"
            value={parseInt(inputS, 10) || 0}
            min={0}
            max={59}
            step={5}
            disabled={status === 'running'}
            onChange={(v) => {
              setInputS(padZero(v));
            }}
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <ControlButton
              label="Apply Custom Duration"
              disabled={status === 'running'}
              onClick={handleCustomApply}
              className="w-full"
            />
          </div>
        </ControlPanel>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { CircularProgress, LinearProgress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { ControlPanel, ControlNumber, ControlText } from '../../components/controls';
import { audioService } from '../../services/audioService';
import { NotificationService } from '../../services/notificationService';
import { Play, Pause, Square, RotateCcw, Target, CheckCircle2, Flame, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { padZero } from '../../utils/date';

export const FocusTimer: React.FC = () => {
  const { logSession, sessions, addToast, settings } = useTimeStore();

  const presets = [
    { label: '25 min', minutes: 25 },
    { label: '45 min', minutes: 45 },
    { label: '50 min', minutes: 50 },
    { label: '90 min', minutes: 90 }
  ];

  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [customMinutes, setCustomMinutes] = useState<string>('30');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [sessionLabel, setSessionLabel] = useState<string>('Deep Engineering');

  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  const timerRef = useRef<number | null>(null);

  // Apply preset
  const handleSelectPreset = (mins: number) => {
    if (status === 'running') return;
    setIsCustom(false);
    setSelectedMinutes(mins);
    setTotalSeconds(mins * 60);
    setTimeLeft(mins * 60);
    setStatus('idle');
  };

  const handleApplyCustom = () => {
    const mins = parseInt(customMinutes, 10);
    if (isNaN(mins) || mins < 1 || mins > 360) {
      addToast('Please enter between 1 and 360 minutes', 'warning');
      return;
    }
    setIsCustom(true);
    setSelectedMinutes(mins);
    setTotalSeconds(mins * 60);
    setTimeLeft(mins * 60);
    setStatus('idle');
  };

  // Timer Tick Loop
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

  // Update page title with remaining time
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      NotificationService.updateDocumentTitle(`(${padZero(m)}:${padZero(s)}) Focus`);
    } else {
      NotificationService.updateDocumentTitle();
    }
  }, [timeLeft, status]);

  const handleStart = () => {
    setStatus('running');
    NotificationService.triggerHaptic('light');
  };

  const handlePause = () => {
    setStatus('paused');
    NotificationService.triggerHaptic('light');
  };

  const handleResume = () => {
    setStatus('running');
    NotificationService.triggerHaptic('light');
  };

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const elapsedSeconds = totalSeconds - timeLeft;
    if (elapsedSeconds > 60) {
      logSession({
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        durationMinutes: Math.round(elapsedSeconds / 60),
        actualSeconds: elapsedSeconds,
        type: 'focus',
        completed: false,
        label: sessionLabel
      });
      addToast(`Recorded ${Math.round(elapsedSeconds / 60)}m focus session`, 'info');
    }
    setStatus('idle');
    setTimeLeft(totalSeconds);
    NotificationService.triggerHaptic('warning');
  };

  const handleReset = () => {
    setStatus('idle');
    setTimeLeft(totalSeconds);
  };

  const handleComplete = () => {
    setStatus('idle');
    setTimeLeft(totalSeconds);
    
    // Play celebratory sound chime
    if (settings.soundAlerts) {
      audioService.playChime();
    }

    // Trigger Haptic
    NotificationService.triggerHaptic('success');

    // Send OS notification
    NotificationService.sendNotification(
      'Focus Session Completed!',
      `Outstanding focus! You finished ${selectedMinutes} minutes of "${sessionLabel}".`
    );

    // Fire celebratory confetti
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFFFFF', '#A0A0A0', '#4F46E5', '#10B981']
    });

    // Log in database
    logSession({
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      durationMinutes: selectedMinutes,
      actualSeconds: totalSeconds,
      type: 'focus',
      completed: true,
      label: sessionLabel
    });

    addToast(`Completed ${selectedMinutes}m focus session!`, 'success');
  };

  const minutesRemaining = Math.floor(timeLeft / 60);
  const secondsRemaining = timeLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  // Recent focus sessions today
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === todayStr);
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Target size={20} />
            <span>Focus Immersion</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Deep single-task cognitive state with audio synthesis and progress tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="md">
            <Flame size={13} className="text-amber-400" />
            <span className="font-mono">{todayMinutes} mins focused today</span>
          </Badge>
        </div>
      </div>

      {/* Main Focus Dial */}
      <div className="flex flex-col items-center justify-center py-4 sm:py-8">
        <CircularProgress
          value={progressPercent}
          size={310}
          strokeWidth={6}
          className="shadow-2xl"
        >
          <div className="text-center select-none">
            <div className="text-6xl sm:text-7xl font-mono font-bold text-white tracking-tighter tabular-nums">
              {padZero(minutesRemaining)}:{padZero(secondsRemaining)}
            </div>
            <div className="text-xs font-mono text-[#A0A0A0] mt-2 uppercase tracking-widest">
              {status === 'running' ? 'Focusing' : status === 'paused' ? 'Paused' : 'Ready'}
            </div>
            <div className="text-xs text-white/60 font-medium mt-1 truncate max-w-[180px] mx-auto">
              {sessionLabel}
            </div>
          </div>
        </CircularProgress>

        {/* Primary Controls */}
        <div className="flex items-center gap-3 mt-8">
          {status === 'idle' && (
            <Button
              variant="primary"
              size="lg"
              icon={<Play size={18} />}
              onClick={handleStart}
              className="px-8"
            >
              Start Focus
            </Button>
          )}

          {status === 'running' && (
            <>
              <Button
                variant="secondary"
                size="lg"
                icon={<Pause size={18} />}
                onClick={handlePause}
                className="px-6"
              >
                Pause
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={<Square size={18} />}
                onClick={handleStop}
              >
                Stop & Save
              </Button>
            </>
          )}

          {status === 'paused' && (
            <>
              <Button
                variant="primary"
                size="lg"
                icon={<Play size={18} />}
                onClick={handleResume}
                className="px-6"
              >
                Resume
              </Button>
              <Button
                variant="ghost"
                size="lg"
                icon={<RotateCcw size={18} />}
                onClick={handleReset}
              >
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Configuration & Presets */}
      <ControlPanel
        title="Focus Session Calibration"
        description="Select duration preset or configure custom objective parameters"
        columns={3}
      >
        <ControlNumber
          label="Custom Focus"
          value={parseInt(customMinutes, 10) || 30}
          min={1}
          max={360}
          step={5}
          unit="m"
          disabled={status === 'running'}
          onChange={(v) => {
            setCustomMinutes(String(v));
            setIsCustom(true);
            setSelectedMinutes(v);
            setTotalSeconds(v * 60);
            setTimeLeft(v * 60);
            setStatus('idle');
          }}
        />

        <ControlText
          label="Objective"
          value={sessionLabel}
          placeholder="e.g. Deep Architecture"
          disabled={status === 'running'}
          onChange={(v) => setSessionLabel(v)}
        />

        <div className="flex items-center gap-1.5 h-[32px] bg-[#171717] rounded-[8px] p-1">
          {presets.map(p => (
            <button
              key={p.minutes}
              type="button"
              disabled={status === 'running'}
              onClick={() => handleSelectPreset(p.minutes)}
              className={`flex-1 h-full text-[11px] font-mono rounded-[6px] transition-colors cursor-pointer disabled:opacity-30 ${
                !isCustom && selectedMinutes === p.minutes
                  ? 'bg-[#FFFFFF] text-[#0A0A0A] font-[600]'
                  : 'text-[#888888] hover:text-[#FFFFFF]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </ControlPanel>

      {/* Today's Completed Sessions Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-[#A0A0A0]">
          <span>Today's Sessions ({todaySessions.length})</span>
          <span>Total: {todayMinutes} mins</span>
        </div>

        {todaySessions.length === 0 ? (
          <Card className="text-center py-8 text-xs text-[#666666]">
            No completed focus sessions yet today. Start your first session above.
          </Card>
        ) : (
          <div className="space-y-2">
            {todaySessions.map(sess => (
              <div
                key={sess.id}
                className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#111111] border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">{sess.label || 'Focus session'}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[#A0A0A0]">
                  <span>{sess.durationMinutes} min</span>
                  <span className="text-white/20">•</span>
                  <span className="text-[11px] text-[#666666]">
                    {new Date(sess.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

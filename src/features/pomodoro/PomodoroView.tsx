import React, { useState, useEffect, useRef } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { PomodoroPhase } from '../../types';
import { ControlPanel, ControlNumber } from '../../components/controls';
import { CircularProgress } from '../../components/ui/Progress';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { audioService } from '../../services/audioService';
import { NotificationService } from '../../services/notificationService';
import { Play, Pause, RotateCcw, SkipForward, Hourglass, Settings2, Coffee, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { padZero } from '../../utils/date';

export const PomodoroView: React.FC = () => {
  const { settings, updateSettings, logSession, addToast } = useTimeStore();
  const config = settings.pomodoro;

  const [phase, setPhase] = useState<PomodoroPhase>('focus');
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(0);
  
  // Custom durations in minutes
  const [focusDur, setFocusDur] = useState(config.focusDuration);
  const [shortBreakDur, setShortBreakDur] = useState(config.shortBreakDuration);
  const [longBreakDur, setLongBreakDur] = useState(config.longBreakDuration);
  const [showSettings, setShowSettings] = useState(false);

  const getDurationForPhase = (p: PomodoroPhase) => {
    switch (p) {
      case 'focus': return focusDur * 60;
      case 'short_break': return shortBreakDur * 60;
      case 'long_break': return longBreakDur * 60;
    }
  };

  const [totalSeconds, setTotalSeconds] = useState<number>(focusDur * 60);
  const [timeLeft, setTimeLeft] = useState<number>(focusDur * 60);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  const timerRef = useRef<number | null>(null);

  // Switch phase
  const switchPhase = (newPhase: PomodoroPhase, autoStart: boolean = false) => {
    setPhase(newPhase);
    const secs = getDurationForPhase(newPhase);
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setStatus(autoStart ? 'running' : 'idle');
  };

  // Timer loop
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handlePhaseComplete();
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
  }, [status, phase, cycleCount, focusDur, shortBreakDur, longBreakDur]);

  // Title sync
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      const label = phase === 'focus' ? 'Focus' : 'Break';
      NotificationService.updateDocumentTitle(`(${padZero(m)}:${padZero(s)}) ${label}`);
    } else {
      NotificationService.updateDocumentTitle();
    }
  }, [timeLeft, status, phase]);

  const handlePhaseComplete = () => {
    setStatus('idle');

    if (settings.soundAlerts) {
      audioService.playChime();
    }
    NotificationService.triggerHaptic('success');

    if (phase === 'focus') {
      const nextCompleted = completedPomodoros + 1;
      setCompletedPomodoros(nextCompleted);

      // Log session
      logSession({
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        durationMinutes: focusDur,
        actualSeconds: focusDur * 60,
        type: 'pomodoro',
        completed: true,
        label: `Pomodoro #${nextCompleted}`
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      NotificationService.sendNotification(
        'Focus Block Completed!',
        'Time for a well-deserved break.'
      );
      addToast(`Completed Pomodoro #${nextCompleted}!`, 'success');

      // Next is either long break or short break
      if (cycleCount >= config.cyclesBeforeLongBreak) {
        setCycleCount(1);
        switchPhase('long_break', config.autoStartBreaks);
      } else {
        setCycleCount(c => c + 1);
        switchPhase('short_break', config.autoStartBreaks);
      }
    } else {
      // Break completed
      NotificationService.sendNotification(
        'Break Ended',
        'Ready to dive back into deep focus?'
      );
      addToast('Break finished. Ready to focus?', 'info');
      switchPhase('focus', config.autoStartFocus);
    }
  };

  const handleSkip = () => {
    if (phase === 'focus') {
      switchPhase('short_break', false);
    } else {
      switchPhase('focus', false);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    const secs = getDurationForPhase(phase);
    setTimeLeft(secs);
  };

  const minutesRemaining = Math.floor(timeLeft / 60);
  const secondsRemaining = timeLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Hourglass size={20} />
            <span>Pomodoro Engine</span>
          </h2>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Structured intervals of focus and restorative rest
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Phase Tabs */}
          <div className="flex items-center bg-[#111111] p-1 rounded-lg border border-white/8 text-xs font-mono">
            <button
              onClick={() => switchPhase('focus')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                phase === 'focus' ? 'bg-white text-black font-semibold' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Focus ({focusDur}m)
            </button>
            <button
              onClick={() => switchPhase('short_break')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                phase === 'short_break' ? 'bg-white text-black font-semibold' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Short Break ({shortBreakDur}m)
            </button>
            <button
              onClick={() => switchPhase('long_break')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                phase === 'long_break' ? 'bg-white text-black font-semibold' : 'text-[#A0A0A0] hover:text-white'
              }`}
            >
              Long Break ({longBreakDur}m)
            </button>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Configure Pomodoro Durations"
          >
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* Settings Drawer/Card if open */}
      {showSettings && (
        <ControlPanel
          title="Configure Interval Durations"
          description="Adjust focus and rest block cycles"
          headerAction={
            <button 
              onClick={() => setShowSettings(false)}
              className="text-[12px] font-mono text-[#888888] hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          }
        >
          <ControlNumber
            label="Focus"
            value={focusDur}
            min={1}
            max={120}
            step={5}
            unit="m"
            onChange={(v) => {
              setFocusDur(v);
              if (phase === 'focus' && status === 'idle') {
                setTotalSeconds(v * 60);
                setTimeLeft(v * 60);
              }
            }}
          />

          <ControlNumber
            label="Short Break"
            value={shortBreakDur}
            min={1}
            max={60}
            step={1}
            unit="m"
            onChange={(v) => {
              setShortBreakDur(v);
              if (phase === 'short_break' && status === 'idle') {
                setTotalSeconds(v * 60);
                setTimeLeft(v * 60);
              }
            }}
          />

          <ControlNumber
            label="Long Break"
            value={longBreakDur}
            min={1}
            max={90}
            step={5}
            unit="m"
            onChange={(v) => {
              setLongBreakDur(v);
              if (phase === 'long_break' && status === 'idle') {
                setTotalSeconds(v * 60);
                setTimeLeft(v * 60);
              }
            }}
          />
        </ControlPanel>
      )}

      {/* Main Dial */}
      <div className="flex flex-col items-center justify-center py-4">
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
            <div className="text-xs font-mono text-[#A0A0A0] mt-2 uppercase tracking-widest flex items-center justify-center gap-1.5">
              {phase === 'focus' ? (
                <span>Focus Interval</span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Coffee size={12} /> Rest Interval
                </span>
              )}
            </div>
            {/* Cycle indicator dots */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {Array.from({ length: config.cyclesBeforeLongBreak }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx < cycleCount ? 'bg-white scale-110' : 'bg-white/20'
                  }`}
                  title={`Cycle ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </CircularProgress>

        {/* Controls */}
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
            title="Reset interval"
          >
            Reset
          </Button>

          <Button
            variant="outline"
            size="lg"
            icon={<SkipForward size={18} />}
            onClick={handleSkip}
            title="Skip to next phase"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center py-4">
          <div className="text-[10px] font-mono text-[#666666] uppercase">Completed Today</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">{completedPomodoros}</div>
        </Card>

        <Card className="text-center py-4">
          <div className="text-[10px] font-mono text-[#666666] uppercase">Current Cycle</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            {cycleCount} / {config.cyclesBeforeLongBreak}
          </div>
        </Card>

        <Card className="text-center py-4">
          <div className="text-[10px] font-mono text-[#666666] uppercase">Focus Time</div>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            {completedPomodoros * focusDur}m
          </div>
        </Card>
      </div>
    </div>
  );
};

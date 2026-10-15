import React, { useRef } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { 
  ControlPanel, 
  ControlSlider, 
  ControlSelect, 
  ControlToggle, 
  ControlColor, 
  ControlNumber, 
  ControlButton 
} from '../../components/controls';
import { NotificationService } from '../../services/notificationService';
import { 
  Sliders, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { WatchDialTheme, TimelineRulerSpan, TimedriftMode } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    exportAllData, 
    importAllData, 
    resetToDefaults, 
    addToast,
    audioVolume,
    setAudioVolume
  } = useTimeStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRequestNotifications = async () => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      updateSettings({ notifications: true });
      addToast('System notifications enabled', 'success');
    } else {
      updateSettings({ notifications: false });
      addToast('Notification permission was denied or dismissed', 'warning');
    }
  };

  const handleExport = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timedrift-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Data backup exported successfully', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = importAllData(text);
        if (success) {
          addToast('Data restored successfully', 'success');
        } else {
          addToast('Invalid backup file format', 'error');
        }
      } catch {
        addToast('Failed to parse backup file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all configurations, events, and focus records to factory defaults? This action is irreversible.')) {
      resetToDefaults();
      addToast('Reset to factory defaults completed', 'info');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F1F1F]">
        <div>
          <h2 className="text-[17px] font-[600] tracking-tight text-[#FFFFFF] flex items-center gap-2">
            <Sliders size={18} className="text-[#888888]" />
            <span>Studio Preferences & Calibration</span>
          </h2>
          <p className="text-[12px] text-[#888888] mt-1">
            Technical control surface for chronometer geometry, display precision, focus engines, and data synchronization
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-mono text-[#888888] bg-[#171717] px-3 py-1 rounded-[8px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>CALIBRATED ENGINE</span>
        </div>
      </header>

      {/* PANEL 1: Interface & Theming */}
      <ControlPanel
        title="Interface & Colorimetry"
        description="Atmosphere, density parameters, and accent color definitions"
        badge={<span className="text-[10px] font-mono text-[#888888] bg-[#171717] px-1.5 py-0.5 rounded">ENV</span>}
      >
        <ControlSelect
          label="Visual Palette"
          value={settings.theme}
          options={[
            { value: 'dark', label: 'Dark Obsidian' },
            { value: 'light', label: 'Light Technical' },
          ]}
          onChange={(val) => updateSettings({ theme: val as 'dark' | 'light' })}
        />

        <ControlColor
          label="Studio Accent"
          value={settings.accentColor || '#FFFFFF'}
          onChange={(val) => updateSettings({ accentColor: val })}
        />

        <ControlSelect
          label="UI Layout Density"
          value={settings.uiDensity}
          options={[
            { value: 'compact', label: 'Compact WebGL' },
            { value: 'comfortable', label: 'Comfortable' },
          ]}
          onChange={(val) => updateSettings({ uiDensity: val as 'compact' | 'comfortable' })}
        />
      </ControlPanel>

      {/* PANEL 2: Chronometer & Astronomical Calibration */}
      <ControlPanel
        title="Clock Precision & Watch Dial Engine"
        description="Temporal formatting, escapement kinematics, and astronomical telemetry"
        badge={<span className="text-[10px] font-mono text-[#888888] bg-[#171717] px-1.5 py-0.5 rounded">CORE</span>}
      >
        <ControlSelect
          label="Time Format"
          value={settings.clock.format}
          options={[
            { value: '24h', label: '24-Hour (Military)' },
            { value: '12h', label: '12-Hour (AM/PM)' },
          ]}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, format: val as '12h' | '24h' } })}
        />

        <ControlSelect
          label="Dial Theme"
          value={settings.clock.dialTheme || 'obsidian'}
          options={[
            { value: 'obsidian', label: 'Obsidian Watch' },
            { value: 'celestial', label: 'Chrono Celestial' },
            { value: 'solaris', label: 'Solaris Eclipse' },
            { value: 'stealth', label: 'Stealth Monolith' },
            { value: 'cyber', label: 'Cyber Chrono' },
          ]}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, dialTheme: val as WatchDialTheme } })}
        />

        <ControlSelect
          label="Clock Typography"
          value={settings.clock.typography}
          options={[
            { value: 'mono', label: 'JetBrains Mono' },
            { value: 'sans', label: 'Inter / System' },
            { value: 'display', label: 'Mona Space' },
          ]}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, typography: val as 'mono' | 'sans' | 'display' } })}
        />

        <ControlSelect
          label="Ruler Horizon"
          value={settings.clock.rulerSpan || '24h'}
          options={[
            { value: '12h', label: '12 Hours (Half-Day)' },
            { value: '24h', label: '24 Hours (Full-Day)' },
            { value: '36h', label: '36 Hours (Extended)' },
          ]}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, rulerSpan: val as TimelineRulerSpan } })}
        />

        <ControlSelect
          label="Timedrift Mode"
          value={settings.clock.timedriftMode || 'normal'}
          options={[
            { value: 'normal', label: 'Normal Mode' },
            { value: 'clock', label: 'Clock Focused' },
            { value: 'timeline', label: 'Timeline Focused' },
          ]}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, timedriftMode: val as TimedriftMode } })}
        />

        <ControlToggle
          label="Show Seconds"
          checked={settings.clock.showSeconds}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, showSeconds: val } })}
        />

        <ControlToggle
          label="Show Milliseconds"
          checked={settings.clock.showMilliseconds}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, showMilliseconds: val } })}
        />

        <ControlToggle
          label="Solar Ephemeris"
          checked={settings.clock.showSolarTimes}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, showSolarTimes: val } })}
        />

        <ControlToggle
          label="Day Progress Bar"
          checked={settings.clock.showDayProgress}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, showDayProgress: val } })}
        />

        <ControlToggle
          label="World Timezones"
          checked={settings.clock.showTimezonesWidget ?? true}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, showTimezonesWidget: val } })}
        />

        <ControlToggle
          label="Quick Tasks Dock"
          checked={settings.clock.showTasksWidget ?? true}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, showTasksWidget: val } })}
        />

        <ControlToggle
          label="Calendar Date Node"
          checked={settings.clock.showDate}
          onChange={(val) => updateSettings({ clock: { ...settings.clock, showDate: val } })}
        />
      </ControlPanel>

      {/* PANEL 3: Focus & Pomodoro Engine */}
      <ControlPanel
        title="Focus & Pomodoro Calibration"
        description="Session intervals, break cycles, and automated progression state machine"
        badge={<span className="text-[10px] font-mono text-[#888888] bg-[#171717] px-1.5 py-0.5 rounded">FLOW</span>}
      >
        <ControlSlider
          label="Focus Duration"
          value={settings.pomodoro.focusDuration}
          min={5}
          max={90}
          step={5}
          unit="m"
          onChange={(val) => updateSettings({ pomodoro: { ...settings.pomodoro, focusDuration: val } })}
        />

        <ControlSlider
          label="Short Break"
          value={settings.pomodoro.shortBreakDuration}
          min={1}
          max={20}
          step={1}
          unit="m"
          onChange={(val) => updateSettings({ pomodoro: { ...settings.pomodoro, shortBreakDuration: val } })}
        />

        <ControlSlider
          label="Long Break"
          value={settings.pomodoro.longBreakDuration}
          min={5}
          max={45}
          step={5}
          unit="m"
          onChange={(val) => updateSettings({ pomodoro: { ...settings.pomodoro, longBreakDuration: val } })}
        />

        <ControlNumber
          label="Cycles / Long Break"
          value={settings.pomodoro.cyclesBeforeLongBreak}
          min={1}
          max={12}
          step={1}
          onChange={(val) => updateSettings({ pomodoro: { ...settings.pomodoro, cyclesBeforeLongBreak: val } })}
        />

        <ControlToggle
          label="Auto-Start Breaks"
          checked={settings.pomodoro.autoStartBreaks}
          onChange={(val) => updateSettings({ pomodoro: { ...settings.pomodoro, autoStartBreaks: val } })}
        />

        <ControlToggle
          label="Auto-Start Focus"
          checked={settings.pomodoro.autoStartFocus}
          onChange={(val) => updateSettings({ pomodoro: { ...settings.pomodoro, autoStartFocus: val } })}
        />
      </ControlPanel>

      {/* PANEL 4: Audio Engine & System Alerts */}
      <ControlPanel
        title="Harmonic Audio & Notification System"
        description="Synthesized chimes, volume attenuation, and background worker notifications"
        badge={<span className="text-[10px] font-mono text-[#888888] bg-[#171717] px-1.5 py-0.5 rounded">AUDIO</span>}
      >
        <ControlToggle
          label="Sound Alerts"
          checked={settings.soundAlerts}
          onChange={(val) => updateSettings({ soundAlerts: val })}
        />

        <ControlSlider
          label="Master Volume"
          value={Math.round(audioVolume * 100)}
          min={0}
          max={100}
          step={5}
          unit="%"
          onChange={(val) => setAudioVolume(val / 100)}
        />

        <ControlToggle
          label="Desktop Alerts"
          checked={settings.notifications}
          onChange={handleRequestNotifications}
        />
      </ControlPanel>

      {/* PANEL 5: Local Storage & Data Synchronization */}
      <ControlPanel
        title="Workspace Storage & Factory Backup"
        description="Export or restore database snapshots, timezone catalog, and event schedules"
        badge={<span className="text-[10px] font-mono text-[#888888] bg-[#171717] px-1.5 py-0.5 rounded">DATA</span>}
      >
        <ControlButton
          label="Export Workspace (JSON)"
          icon={<Download size={13} />}
          onClick={handleExport}
        />

        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
          <ControlButton
            label="Import Workspace (JSON)"
            icon={<Upload size={13} />}
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          />
        </div>

        <ControlButton
          label="Reset to Factory Defaults"
          variant="danger"
          icon={<RotateCcw size={13} />}
          onClick={handleReset}
        />
      </ControlPanel>
    </div>
  );
};

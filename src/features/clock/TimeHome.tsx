import React from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { TimedriftHome } from './TimedriftHome';
import { DigitalClockView } from './DigitalClockView';
import { MinimalClockView } from './MinimalClockView';
import { InteractiveTimeline } from '../timeline/InteractiveTimeline';
import { FocusTimer } from '../focus/FocusTimer';

export const TimeHome: React.FC = () => {
  const { timeDisplayMode } = useTimeStore();

  switch (timeDisplayMode) {
    case 'timedrift':
      return <TimedriftHome />;
    case 'minimal':
      return <MinimalClockView />;
    case 'timeline':
      return <InteractiveTimeline />;
    case 'focus':
      return <FocusTimer />;
    case 'digital':
      return <DigitalClockView />;
    default:
      return <TimedriftHome />;
  }
};

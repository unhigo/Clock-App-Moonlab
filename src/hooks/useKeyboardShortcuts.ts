import { useEffect } from 'react';
import { useTimeStore } from '../store/useTimeStore';

export function useKeyboardShortcuts() {
  const {
    activeTab,
    setActiveTab,
    toggleAudio,
    nextTrack,
    prevTrack,
    toggleFullscreen,
    isFullscreen,
    isShortcutsOpen,
    setShortcutsOpen
  } = useTimeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is actively typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          toggleAudio();
          break;

        case 'KeyF':
          e.preventDefault();
          setActiveTab('focus');
          break;

        case 'KeyT':
          e.preventDefault();
          setActiveTab('timer');
          break;

        case 'KeyM':
          e.preventDefault();
          setActiveTab('music');
          break;

        case 'KeyC':
          e.preventDefault();
          setActiveTab('time');
          break;

        case 'KeyL':
          e.preventDefault();
          setActiveTab('timeline');
          break;

        case 'KeyZ':
          e.preventDefault();
          setActiveTab('timezones');
          break;

        case 'KeyS':
          e.preventDefault();
          setActiveTab('stats');
          break;

        case 'Escape':
          e.preventDefault();
          if (isShortcutsOpen) {
            setShortcutsOpen(false);
          } else if (isFullscreen) {
            toggleFullscreen();
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          prevTrack();
          break;

        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          break;

        case 'Slash':
          if (e.shiftKey) { // '?' key
            e.preventDefault();
            setShortcutsOpen(!isShortcutsOpen);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    setActiveTab,
    toggleAudio,
    nextTrack,
    prevTrack,
    toggleFullscreen,
    isFullscreen,
    isShortcutsOpen,
    setShortcutsOpen
  ]);
}

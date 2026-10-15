import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { NavTab } from '../../types';
import { Clock, AlignLeft, Target, Timer, Headphones, MoreHorizontal, Globe, BarChart3, Settings, Calendar, Maximize2, Waves } from 'lucide-react';

export const MobileDock: React.FC = () => {
  const { activeTab, setActiveTab, toggleFullscreen } = useTimeStore();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'time', label: 'Clock', icon: <Clock size={19} /> },
    { id: 'timeline', label: 'Timeline', icon: <AlignLeft size={19} /> },
    { id: 'focus', label: 'Focus', icon: <Target size={19} /> },
    { id: 'timer', label: 'Timer', icon: <Timer size={19} /> },
    { id: 'music', label: 'Sound', icon: <Headphones size={19} /> }
  ];

  const moreItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'tides', label: 'Simulador de Mareas', icon: <Waves size={18} /> },
    { id: 'timezones', label: 'Timezones', icon: <Globe size={18} /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 size={18} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <>
      {/* More Modal Drawer */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs" 
            onClick={() => setShowMoreMenu(false)} 
          />
          <div className="relative bg-[#111111] border-t border-white/15 rounded-t-2xl p-5 z-10 animate-in slide-in-from-bottom-5">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="grid grid-cols-2 gap-3 mb-4">
              {moreItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMoreMenu(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    activeTab === item.id 
                      ? 'bg-white text-black border-white' 
                      : 'bg-[#161616] text-[#A0A0A0] border-white/8 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                toggleFullscreen();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-medium"
            >
              <Maximize2 size={15} />
              <span>Fullscreen Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Bottom Mobile Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070707]/90 backdrop-blur-md border-t border-white/8 px-2 py-1.5 flex items-center justify-around select-none">
        {mainItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-white' : 'text-[#666666]'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/15 text-white' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${
            showMoreMenu || moreItems.some(m => m.id === activeTab) ? 'text-white' : 'text-[#666666]'
          }`}
        >
          <div className="p-1.5 rounded-lg">
            <MoreHorizontal size={19} />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">More</span>
        </button>
      </nav>
    </>
  );
};

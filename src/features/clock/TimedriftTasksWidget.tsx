import React, { useState } from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { getLunarDayData } from '../../utils/lunarEngine';
import { VectorMoon } from '../../components/lunar/VectorMoon';
import { Plus, Check, Trash2, CalendarPlus, Sparkles, Moon } from 'lucide-react';

export const TimedriftTasksWidget: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    toggleTask, 
    deleteTask, 
    setActiveTab,
    selectedLunarDay,
    addEvent,
    addToast
  } = useTimeStore();

  const [inputTitle, setInputTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Active or selected lunar day
  const activeDay = selectedLunarDay || getLunarDayData(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputTitle.trim()) {
      addTask(inputTitle.trim());
      setInputTitle('');
      setIsAdding(false);
    }
  };

  const handleAddToCalendar = () => {
    addEvent({
      title: `Luna: ${activeDay.phaseName} (${activeDay.illumination}%)`,
      date: activeDay.date,
      startTime: '21:00',
      endTime: '22:30',
      category: 'PERSONAL',
      notes: activeDay.traditionalName ? `Evento astronómico: ${activeDay.traditionalName}` : 'Observación nocturna lunar'
    });
    addToast(`Agregado al calendario: ${activeDay.phaseName} (${activeDay.date})`, 'success');
  };

  const activeTasks = tasks.filter(t => !t.completed);

  return (
    <div className="w-[280px] sm:w-[320px] select-none font-sans">
      {/* Outer Card Container from score.motion.dev */}
      <div className="bg-[#0c0f10] rounded-xl border border-[#1e2427] p-4 shadow-xl flex flex-col gap-3.5 relative ms-corner-bracket">
        
        {/* ============================================================ */}
        {/* 1. DAILY LUNAR DETAIL (Detalle Diario Lunar)                  */}
        {/* ============================================================ */}
        <div className="pb-3 border-b border-[#1e2427] flex flex-col gap-2">
          {/* Header with Motion Kicker */}
          <div className="flex items-center justify-between">
            <span className="ms-kicker text-xs font-mono tracking-[0.16em]">
              <span className="ms-kicker-caret">&gt;</span> DETALLE LUNAR
            </span>
            <span className="text-[10px] font-mono text-[#7a8180]">
              {activeDay.date}
            </span>
          </div>

          {/* Core Astronomical metrics in score.motion.dev tech container */}
          <div className="flex items-center justify-between bg-black rounded-lg p-2.5 border border-[#1e2427]">
            <div className="flex items-center gap-2.5">
              <VectorMoon
                phase={activeDay.phase}
                phaseKey={activeDay.phaseKey}
                illumination={activeDay.illumination}
                size={32}
                glow={activeDay.phaseKey === 'FULL_MOON'}
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-[#ededec] truncate max-w-[120px]">
                  {activeDay.phaseName}
                </span>
                {activeDay.traditionalName ? (
                  <span className="text-[10px] text-[var(--accent-rind)] font-mono truncate max-w-[120px]">
                    {activeDay.traditionalName}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#7a8180]">
                    Signo: {activeDay.zodiacSign}
                  </span>
                )}
              </div>
            </div>

            {/* Illumination & Moon Age badges with MotionScore Tier */}
            <div className="flex flex-col items-end text-right font-mono text-[10px] gap-0.5">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#ededec]">
                  {activeDay.illumination}%
                </span>
                <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                  activeDay.illumination >= 90 ? 'bg-[var(--tier-s)] text-[#060607]' :
                  activeDay.illumination >= 70 ? 'bg-[var(--tier-a)] text-[#060607]' :
                  activeDay.illumination >= 40 ? 'bg-[var(--tier-b)] text-[#060607]' :
                  'bg-[#1e2427] text-[#ededec]'
                }`}>
                  {activeDay.illumination >= 90 ? 'S' : activeDay.illumination >= 70 ? 'A' : activeDay.illumination >= 40 ? 'B' : 'C'}
                </span>
              </div>
              <span className="text-[#7a8180]">
                {activeDay.moonAge}d ciclo
              </span>
            </div>
          </div>

          {/* "Agregar al calendario" button styled as btn-caps-stripe */}
          <button
            onClick={handleAddToCalendar}
            className="btn-caps-stripe btn-caps-stripe-primary w-full py-2 text-[10px]"
          >
            <CalendarPlus size={11} className="text-[var(--accent-rind)]" />
            <span>AGREGAR AL CALENDARIO</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 2. TASKS & NOTES CHECKLIST                                   */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between">
          <span className="ms-kicker text-xs font-mono tracking-[0.16em]">
            <span className="ms-kicker-caret">&gt;</span> NOTAS &amp; TAREAS
          </span>
          <span className="text-[10px] font-mono text-[#7a8180]">
            {activeTasks.length} activas
          </span>
        </div>

        {/* Add Input Prompt */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="ms-input-wrap">
              <span className="ms-input-caret">&gt;</span>
              <input
                type="text"
                placeholder="Planear o registrar evento lunar..."
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-xs text-[#ededec] placeholder:text-[#7a8180] focus:outline-none font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-[10px] font-mono text-[#7a8180] hover:text-[#ededec] px-2 py-0.5 cursor-pointer uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-caps-stripe btn-caps-stripe-accent py-1 px-3 text-[10px]"
              >
                Añadir
              </button>
            </div>
          </form>
        ) : (
          <div
            onClick={() => setIsAdding(true)}
            className="text-xs text-[#7a8180] hover:text-[#ededec] transition-colors cursor-pointer py-1 flex items-center justify-between font-mono"
          >
            <span>+ Registrar nota para esta fase...</span>
            <Plus size={12} className="text-[#7a8180]" />
          </div>
        )}

        {/* Task Items Checklist */}
        {activeTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-2.5 gap-1 text-center">
            <span className="text-xs text-[#7a8180] font-mono">
              Sin notas pendientes para hoy
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-0.5 custom-scrollbar">
            {activeTasks.slice(0, 4).map(task => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-2 rounded-lg bg-[#0d1111] border border-[#1e2427] hover:border-[var(--border-focus)] transition-all"
              >
                <div 
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="w-3.5 h-3.5 rounded border border-[#1e2427] group-hover:border-[var(--border-focus)] flex items-center justify-center shrink-0 bg-[#13181a]">
                    {task.completed && <Check size={10} className="text-[var(--accent-rind)]" />}
                  </div>
                  <span className={`text-xs truncate font-mono ${task.completed ? 'line-through text-[#7a8180]' : 'text-[#ededec]'}`}>
                    {task.title}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded text-[#7a8180] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                  title="Eliminar"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useTimeStore } from '../../store/useTimeStore';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTimeStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#111111] border border-white/15 rounded-xl shadow-xl text-xs font-medium text-white transition-all transform animate-in slide-in-from-bottom-2 fade-in"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle size={15} className="text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info size={15} className="text-white/70 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#666666] hover:text-white transition-colors cursor-pointer p-0.5"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

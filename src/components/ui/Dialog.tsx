import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[#0B0B0B] border border-white/15 rounded-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150`}>
        <div className="flex items-start justify-between pb-4 border-b border-white/8 mb-5">
          <div>
            {title && <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>}
            {description && <p className="text-xs text-[#A0A0A0] mt-1">{description}</p>}
          </div>
          <IconButton 
            size="sm" 
            variant="ghost" 
            onClick={onClose}
            className="-mr-1 -mt-1"
          >
            <X size={16} />
          </IconButton>
        </div>

        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

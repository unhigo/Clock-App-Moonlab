import React from 'react';

export interface ControlPanelProps {
  title?: string;
  description?: string;
  badge?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
  noGrid?: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  title,
  description,
  badge,
  headerAction,
  children,
  columns,
  className = '',
  noGrid = false,
}) => {
  const getGridClasses = () => {
    if (noGrid) return '';
    if (columns === 1) return 'grid grid-cols-1 gap-[12px]';
    if (columns === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-[12px]';
    if (columns === 3) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]';
    // Default responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]';
  };

  return (
    <section 
      className={`bg-[#0A0A0A] border border-[#1F1F1F] rounded-[18px] p-[16px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-colors ${className}`}
    >
      {(title || description || headerAction || badge) && (
        <header className="flex items-center justify-between gap-3 mb-[14px]">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-[13px] font-[600] text-[#FFFFFF] tracking-tight truncate">
                  {title}
                </h3>
              )}
              {badge && <div className="shrink-0">{badge}</div>}
            </div>
            {description && (
              <p className="text-[12px] font-[400] text-[#888888] mt-0.5 truncate">
                {description}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="shrink-0 flex items-center gap-2">
              {headerAction}
            </div>
          )}
        </header>
      )}

      <div className={getGridClasses()}>
        {children}
      </div>
    </section>
  );
};

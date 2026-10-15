import React from 'react';
import { LUNAR_STYLE_LIST } from '../../data/lunarStyles';
import { VectorMoon } from '../../components/lunar/VectorMoon';
import { LunarStyleId } from '../../types';
import { Check, Sparkles, Sliders, ArrowRight } from 'lucide-react';

interface LunarStylesGalleryProps {
  currentStyleId?: LunarStyleId;
  onSelectStyle?: (styleId: LunarStyleId) => void;
  onOpenGenerator?: () => void;
}

export const LunarStylesGallery: React.FC<LunarStylesGalleryProps> = ({
  currentStyleId = 'obsidian',
  onSelectStyle,
  onOpenGenerator
}) => {
  return (
    <div className="w-full flex flex-col gap-6 font-sans select-none pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e2427]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--accent-rind)]" />
            <span className="ms-kicker text-sm font-mono tracking-[0.16em]">
              <span className="ms-kicker-caret">&gt;</span> GALERÍA DE PLANTILLAS VISUALES
            </span>
          </div>
          <p className="text-xs text-[#7a8180] font-mono mt-1">
            10 sistemas de diseño astronómico calibrados para impresión editorial, digital y cartografía celeste.
          </p>
        </div>

        {onOpenGenerator && (
          <button
            onClick={onOpenGenerator}
            className="btn-caps-stripe btn-caps-stripe-accent py-2 px-4 text-[11px]"
          >
            <span>ABRIR EN GENERADOR CANVA</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* 10 Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LUNAR_STYLE_LIST.map((style) => {
          const isActive = currentStyleId === style.id;

          return (
            <div
              key={style.id}
              className={`rounded-xl border p-5 flex flex-col justify-between gap-4 transition-all duration-300 relative overflow-hidden group ms-corner-bracket ${
                isActive
                  ? 'border-[var(--accent-rind)] shadow-[0_0_20px_rgba(74,222,128,0.15)] ring-1 ring-[var(--accent-rind)]'
                  : 'border-[#1e2427] hover:border-[var(--border-focus)]'
              }`}
              style={{
                backgroundColor: style.palette.card,
                color: style.palette.text
              }}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--accent-rind)] text-[#060607] font-bold shadow">
                  <Check size={10} />
                  <span>ACTIVO</span>
                </div>
              )}

              {/* Title & Tagline */}
              <div className="flex flex-col gap-1 pr-16">
                <h3 className="text-base font-bold tracking-wide font-mono uppercase">
                  {style.name}
                </h3>
                <span className="text-[10px] font-mono opacity-60 uppercase">
                  {style.tagline}
                </span>
              </div>

              {/* Moon Icons & Phases System Preview */}
              <div
                className="p-3 rounded-lg border flex items-center justify-between"
                style={{
                  backgroundColor: style.palette.bg,
                  borderColor: style.palette.border
                }}
              >
                {[0, 1, 2, 4, 6, 7].map((phaseNum) => (
                  <div key={phaseNum} className="flex flex-col items-center gap-1">
                    <VectorMoon
                      phase={phaseNum}
                      size={20}
                      litColor={style.palette.moonLit}
                      shadowColor={style.palette.moonShadow}
                      glow={phaseNum === 4}
                    />
                    <span className="text-[8px] font-mono opacity-40">
                      {phaseNum === 0 ? 'NEW' : phaseNum === 4 ? 'FULL' : `${phaseNum * 45}°`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="text-xs opacity-75 leading-relaxed font-mono">
                {style.description}
              </p>

              {/* Color Swatches & Details */}
              <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: style.palette.border }}>
                <div className="flex items-center justify-between text-[11px] font-mono opacity-60">
                  <span>Paleta Cromática:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                      style={{ background: style.palette.bg }}
                      title="Fondo"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                      style={{ background: style.palette.accent }}
                      title="Acento"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                      style={{ background: style.palette.moonLit }}
                      title="Luz lunar"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                      style={{ background: style.palette.moonShadow }}
                      title="Sombra lunar"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono opacity-50">
                  <span>Tipografía: {style.typography.headingFont.split(',')[0]}</span>
                  <span>Variante: {style.moonIconVariant}</span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => onSelectStyle && onSelectStyle(style.id)}
                className={`w-full py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'btn-caps-stripe btn-caps-stripe-accent opacity-90'
                    : 'btn-caps-stripe btn-caps-stripe-primary'
                }`}
              >
                <span>{isActive ? 'ESTILO APLICADO' : 'SELECCIONAR ESTE ESTILO'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

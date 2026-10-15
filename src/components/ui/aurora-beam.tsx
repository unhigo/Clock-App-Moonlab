import React, { useEffect, useRef, useMemo } from 'react';

export interface AuroraBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of layered light sheets (default: 4) */
  sheets?: number;
  /** Speed multiplier of the sweeping movement (default: 1) */
  speed?: number;
  /** Amplitude of the vertical undulation waves (default: 1) */
  amplitude?: number;
  /** Frequency of the undulating wave harmonics (default: 1) */
  frequency?: number;
  /** Array of hex or rgba colors for the sheets (default: emerald/cyan/indigo/violet spectrum) */
  colors?: string[];
  /** Single accent color shortcut if array not provided */
  color?: string;
  /** CSS filter blur in pixels (default: 48) */
  blur?: number;
  /** Overall opacity of the aurora beam (default: 0.65) */
  opacity?: number;
  /** Blend mode of the canvas (default: 'screen') */
  blendMode?: 'screen' | 'lighten' | 'color-dodge' | 'plus-lighter' | 'normal';
  /** Whether the beam reacts interactively to mouse position (default: true) */
  interactive?: boolean;
  /** Beam position orientation: 'top' | 'center' | 'bottom' | 'diagonal' (default: 'center') */
  position?: 'top' | 'center' | 'bottom' | 'diagonal';
  /** Optional children rendered on top of the beam */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const DEFAULT_AURORA_COLORS = [
  '#10b981', // Emerald Timedrift
  '#06b6d4', // Celestial Cyan
  '#3b82f6', // Deep Chrono Blue
  '#8b5cf6', // Violet Eclipse
  '#ec4899', // Ethereal Rose
];

export const AuroraBeam: React.FC<AuroraBeamProps> = ({
  sheets = 4,
  speed = 1,
  amplitude = 1,
  frequency = 1,
  colors = DEFAULT_AURORA_COLORS,
  color,
  blur = 48,
  opacity = 0.65,
  blendMode = 'screen',
  interactive = true,
  position = 'center',
  children,
  className = '',
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animFrameIdRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Active color palette
  const activeColors = useMemo(() => {
    if (color) {
      return [color, '#10b981', '#06b6d4', color];
    }
    return colors.length > 0 ? colors : DEFAULT_AURORA_COLORS;
  }, [color, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth || window.innerWidth);
    let height = (canvas.height = container.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth || window.innerWidth;
      height = canvas.height = container.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current.targetX = Math.max(0, Math.min(1, x));
      mouseRef.current.targetY = Math.max(0, Math.min(1, y));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      timeRef.current += 0.008 * speed;
      const t = timeRef.current;

      // Smooth mouse interpolation (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Save canvas state
      ctx.save();
      ctx.globalCompositeOperation = blendMode === 'plus-lighter' ? 'lighter' : blendMode;

      // Base Y coordinate depending on position
      let baseY = height * 0.5;
      if (position === 'top') baseY = height * 0.28;
      if (position === 'bottom') baseY = height * 0.72;

      // Adjust with mouse
      const mouseOffsetY = (mouseRef.current.y - 0.5) * (height * 0.25);
      const mouseOffsetX = (mouseRef.current.x - 0.5) * (width * 0.15);

      // Render each sweeping sheet of light
      for (let s = 0; s < sheets; s++) {
        const sheetProgress = s / (sheets - 1 || 1);
        const colorIdx = s % activeColors.length;
        const currentColor = activeColors[colorIdx];
        const nextColor = activeColors[(colorIdx + 1) % activeColors.length];

        // Specific phase offsets for layered depth
        const sheetPhase = s * (Math.PI / 3) + t;
        const sheetY = baseY + (sheetProgress - 0.5) * (height * 0.35) + mouseOffsetY * (1 - sheetProgress * 0.4);
        const sheetAmp = (height * 0.18) * amplitude * (0.8 + 0.4 * Math.sin(t * 0.5 + s));
        const sheetFreq = (0.0025 * frequency) * (1 + s * 0.2);

        // Create linear gradient along the sheet flow
        const grad = ctx.createLinearGradient(0, sheetY - sheetAmp * 2, width, sheetY + sheetAmp * 2);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.2, currentColor + '33'); // ~20% alpha
        grad.addColorStop(0.5, currentColor + 'dd'); // ~86% alpha core
        grad.addColorStop(0.8, nextColor + '55');   // ~33% alpha
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();

        // Trace upper undulating curve of sheet
        ctx.moveTo(0, height);
        ctx.lineTo(0, sheetY);

        const segments = 40;
        const stepX = width / segments;

        for (let i = 0; i <= segments; i++) {
          const x = i * stepX;
          const nx = x + mouseOffsetX;
          
          // Harmonic wave equation for authentic polar aurora ribbons
          const w1 = Math.sin(nx * sheetFreq + sheetPhase);
          const w2 = Math.sin(nx * sheetFreq * 1.8 - t * 1.2 + s) * 0.5;
          const w3 = Math.cos(nx * sheetFreq * 0.5 + t * 0.7) * 0.3;
          
          const y = sheetY + (w1 + w2 + w3) * sheetAmp;

          if (i === 0) {
            ctx.lineTo(x, y);
          } else {
            // Smooth bezier interpolation
            const prevX = (i - 1) * stepX;
            const cx = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, y, cx, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Center intense luminous core ray
        ctx.lineWidth = 2 + s * 1.5;
        ctx.strokeStyle = currentColor + 'aa';
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const x = i * stepX;
          const nx = x + mouseOffsetX;
          const w1 = Math.sin(nx * sheetFreq + sheetPhase);
          const w2 = Math.sin(nx * sheetFreq * 1.8 - t * 1.2 + s) * 0.5;
          const y = sheetY + (w1 + w2) * (sheetAmp * 0.85);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [sheets, speed, amplitude, frequency, activeColors, blendMode, interactive, position]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      {...rest}
    >
      {/* Aurora Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          filter: `blur(${blur}px)`,
          opacity: opacity,
          mixBlendMode: blendMode,
          transform: 'translateZ(0)',
          willChange: 'transform, filter',
        }}
      />

      {/* Content wrapper */}
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};

// Aliases matching user request (both uppercase Y for valid React JSX and lowercase y)
export const Y: React.FC<AuroraBeamProps> = AuroraBeam;
export const y = AuroraBeam;
export default AuroraBeam;

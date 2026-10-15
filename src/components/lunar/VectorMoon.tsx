import React from 'react';
import { MoonPhaseKey } from '../../types';

interface VectorMoonProps {
  phase?: number; // 0 to 7
  phaseKey?: MoonPhaseKey;
  illumination?: number; // 0 to 100
  size?: number | string; // size in px or tailwind
  litColor?: string;
  shadowColor?: string;
  className?: string;
  showCraterDetails?: boolean;
  glow?: boolean;
}

export const VectorMoon: React.FC<VectorMoonProps> = ({
  phase = 4,
  phaseKey,
  illumination,
  size = 24,
  litColor = '#ffffff',
  shadowColor = '#18181b',
  className = '',
  showCraterDetails = true,
  glow = false
}) => {
  // Map phaseKey to phase number if provided
  let effectivePhase = phase;
  if (phaseKey) {
    const keyMap: Record<MoonPhaseKey, number> = {
      NEW_MOON: 0,
      WAXING_CRESCENT: 1,
      FIRST_QUARTER: 2,
      WAXING_GIBBOUS: 3,
      FULL_MOON: 4,
      WANING_GIBBOUS: 5,
      LAST_QUARTER: 6,
      WANING_CRESCENT: 7
    };
    effectivePhase = keyMap[phaseKey] ?? phase;
  }

  // Phase fraction: 0 = new, 0.25 = 1st quarter, 0.5 = full, 0.75 = last quarter, 1.0 = new
  const phaseFraction = effectivePhase / 8;

  // Geometry: Moon disk center (50, 50), radius 44
  const cx = 50;
  const cy = 50;
  const r = 44;

  // Calculate terminator arc:
  // For a phase fraction p:
  // angle = 2 * PI * p
  // terminator semi-minor radius rx = r * cos(angle)
  const angle = 2 * Math.PI * phaseFraction;
  const rx = Math.abs(r * Math.cos(angle));

  // Determine SVG path for lit region
  let litPath = '';

  if (effectivePhase === 0) {
    // New Moon: completely shadow
    litPath = '';
  } else if (effectivePhase === 4) {
    // Full Moon: full circle
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx} ${cy + r} A ${r} ${r} 0 1 1 ${cx} ${cy - r} Z`;
  } else if (effectivePhase === 1) {
    // Waxing Crescent: thin sliver on the right
    // Right limb from top to bottom (sweep 1), inner terminator curve back to top (sweep 0)
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r} Z`;
  } else if (effectivePhase === 2) {
    // First Quarter: exact right half
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} L ${cx} ${cy - r} Z`;
  } else if (effectivePhase === 3) {
    // Waxing Gibbous: right half + bulging into left side
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r} Z`;
  } else if (effectivePhase === 5) {
    // Waning Gibbous: left half + bulging into right side
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 1 ${cx} ${cy - r} Z`;
  } else if (effectivePhase === 6) {
    // Last Quarter: exact left half
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} L ${cx} ${cy - r} Z`;
  } else if (effectivePhase === 7) {
    // Waning Crescent: thin sliver on the left
    litPath = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${rx} ${r} 0 0 0 ${cx} ${cy - r} Z`;
  }

  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      viewBox="0 0 100 100"
      style={{ width: dimension, height: dimension }}
      className={`inline-block shrink-0 transition-transform duration-300 ${className}`}
    >
      <defs>
        {/* Subtle 3D Sphere gradient for shadow side */}
        <radialGradient id={`moonShadowGrad-${effectivePhase}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={shadowColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#050507" stopOpacity="0.98" />
        </radialGradient>

        {/* Lit side realistic lunar texture / subtle mare shading */}
        <radialGradient id={`moonLitGrad-${effectivePhase}`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor={litColor} stopOpacity="1" />
          <stop offset="85%" stopColor={litColor} stopOpacity="0.88" />
          <stop offset="100%" stopColor={litColor} stopOpacity="0.75" />
        </radialGradient>

        {/* Clip path to keep everything within the moon's sphere */}
        <clipPath id={`moonClip-${effectivePhase}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>

        {glow && (
          <filter id="lunarGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Outer subtle glow if enabled */}
      {glow && (
        <circle
          cx={cx}
          cy={cy}
          r={r + 2}
          fill="none"
          stroke={litColor}
          strokeWidth="2"
          opacity="0.3"
          filter="url(#lunarGlow)"
        />
      )}

      {/* Moon Base Disk (Shadow Side) */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#moonShadowGrad-${effectivePhase})`}
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="0.75"
      />

      {/* Lunar Maria (Subtle craters on the base) */}
      {showCraterDetails && (
        <g clipPath={`url(#moonClip-${effectivePhase})`} opacity="0.18">
          {/* Oceanus Procellarum / Sea of Tranquility markings */}
          <circle cx="38" cy="40" r="10" fill="#000000" />
          <circle cx="58" cy="35" r="8" fill="#000000" />
          <circle cx="48" cy="62" r="12" fill="#000000" />
          <circle cx="65" cy="55" r="7" fill="#000000" />
          {/* Tycho crater ray system */}
          <circle cx="48" cy="74" r="3" fill="#ffffff" opacity="0.4" />
        </g>
      )}

      {/* Lit Region Path */}
      {litPath && (
        <path
          d={litPath}
          fill={`url(#moonLitGrad-${effectivePhase})`}
          clipPath={`url(#moonClip-${effectivePhase})`}
        />
      )}

      {/* Fine limb accent line */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.5"
      />
    </svg>
  );
};

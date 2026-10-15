import React from 'react';
import { WatchDialTheme } from '../../types';

interface ObsidianWatchDialProps {
  theme?: WatchDialTheme;
  seconds: number;
  minutes: number;
  hours: number;
  year?: number;
}

export const ObsidianWatchDial: React.FC<ObsidianWatchDialProps> = ({
  seconds,
  minutes,
  year = 2026
}) => {
  // Rotational angles based on real clock
  const secAngle = (seconds / 60) * 360;
  const minAngle = ((minutes + seconds / 60) / 60) * 360;

  // Arc numbers on the upper-left (0 to 20)
  const leftArcNumbers = [
    { num: 0, angle: -85 },
    { num: 1, angle: -78 },
    { num: 2, angle: -71 },
    { num: 3, angle: -64 },
    { num: 4, angle: -57 },
    { num: 5, angle: -50 },
    { num: 6, angle: -43 },
    { num: 7, angle: -36 },
    { num: 8, angle: -29 },
    { num: 9, angle: -22 },
    { num: 10, angle: -15 },
    { num: 11, angle: -8 },
    { num: 12, angle: -1 },
    { num: 13, angle: 6 },
    { num: 14, angle: 13 },
    { num: 15, angle: 20 },
    { num: 16, angle: 27 },
    { num: 17, angle: 34 },
    { num: 18, angle: 41 },
    { num: 19, angle: 48 },
    { num: 20, angle: 55 }
  ];

  // Arc numbers along the lower/right gear track (59 down to 37)
  const countdownArcNumbers = [
    { num: 0, angle: -85 },
    { num: 59, angle: -76 },
    { num: 58, angle: -68 },
    { num: 57, angle: -60 },
    { num: 56, angle: -52 },
    { num: 55, angle: -44 },
    { num: 54, angle: -36 },
    { num: 53, angle: -28 },
    { num: 52, angle: -20 },
    { num: 51, angle: -12 },
    { num: 50, angle: -4 },
    { num: 49, angle: 4 },
    { num: 48, angle: 12 },
    { num: 47, angle: 20 },
    { num: 46, angle: 28 },
    { num: 45, angle: 36 },
    { num: 44, angle: 44 },
    { num: 43, angle: 52 },
    { num: 42, angle: 60 },
    { num: 41, angle: 68 },
    { num: 40, angle: 76 },
    { num: 39, angle: 84 },
    { num: 38, angle: 92 },
    { num: 37, angle: 100 }
  ];

  // Generate radial ticks for the astronomical astrolabe
  const outerTicks = Array.from({ length: 90 }, (_, i) => {
    const angle = (i / 90) * 360;
    const isMajor = i % 5 === 0;
    return { angle, isMajor };
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {/* Main Vector Artwork: Steed, Knight, and Astrolabe Chronometer */}
      <svg
        viewBox="0 0 1000 1000"
        className="w-[520px] sm:w-[720px] md:w-[940px] lg:w-[1080px] aspect-square transition-all duration-700 max-h-[85vh]"
        style={{ filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.8))' }}
      >
        <defs>
          <radialGradient id="mistFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="45%" stopColor="#333333" stopOpacity="0.04" />
            <stop offset="85%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="armorHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#888888" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#111111" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="steedHighlight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#444444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#050505" stopOpacity="0" />
          </linearGradient>

          <filter id="glowSubtle" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="500" cy="500" r="440" fill="url(#mistFade)" />

        {/* ============================================================ */}
        {/* CENTER SILHOUETTE: THE OBSIDIAN WARRIOR & STEED (HORSE)      */}
        {/* ============================================================ */}
        <g id="obsidian-rider-steed" opacity="0.82" transform="translate(0, -30)">
          {/* Dark Atmospheric Aura behind warrior & steed */}
          <ellipse cx="500" cy="520" rx="220" ry="290" fill="#0c0c0c" opacity="0.9" />

          {/* Steed Chest & Forequarters Shading */}
          <path
            d="M 390 680 C 400 590 420 520 460 480 C 470 510 475 580 480 680 Z"
            fill="url(#steedHighlight)"
            opacity="0.4"
          />
          <path
            d="M 610 680 C 600 590 580 520 540 480 C 530 510 525 580 520 680 Z"
            fill="url(#steedHighlight)"
            opacity="0.4"
          />

          {/* Steed Neck & Shoulders */}
          <path
            d="M 440 440 C 430 380 445 320 470 270 C 490 290 500 330 500 370 C 500 330 510 290 530 270 C 555 320 570 380 560 440 C 580 480 620 540 640 650 C 600 660 550 670 500 670 C 450 670 400 660 360 650 C 380 540 420 480 440 440 Z"
            fill="#121212"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.25"
          />

          {/* Horse Head (Looking directly forward) */}
          <path
            d="M 470 260 C 465 240 455 220 448 200 C 458 205 468 215 472 230 C 480 220 490 215 500 215 C 510 215 520 220 528 230 C 532 215 542 205 552 200 C 545 220 535 240 530 260 C 540 300 545 340 535 390 C 525 430 515 460 500 470 C 485 460 475 430 465 390 C 455 340 460 300 470 260 Z"
            fill="#181818"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Steed Ears */}
          <path d="M 450 200 L 460 165 L 472 205 Z" fill="#202020" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.35" />
          <path d="M 550 200 L 540 165 L 528 205 Z" fill="#202020" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.35" />

          {/* Horse Forehead Plate / Champron & Bridle Accent */}
          <path
            d="M 488 235 L 500 220 L 512 235 L 508 300 L 500 325 L 492 300 Z"
            fill="url(#armorHighlight)"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />

          {/* Horse Eyes (Subtle glowing specular highlights) */}
          <ellipse cx="468" cy="275" rx="3.5" ry="2" fill="#ffffff" opacity="0.85" filter="url(#glowSubtle)" />
          <ellipse cx="532" cy="275" rx="3.5" ry="2" fill="#ffffff" opacity="0.85" filter="url(#glowSubtle)" />

          {/* Horse Muzzle & Nostrils */}
          <ellipse cx="488" cy="425" rx="4" ry="7" fill="#080808" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.3" />
          <ellipse cx="512" cy="425" rx="4" ry="7" fill="#080808" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.3" />
          <path d="M 478 440 C 490 455 510 455 522 440" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.35" />

          {/* Bridle Straps & Steel Reins */}
          <path d="M 465 275 L 492 300 L 468 390 L 485 435" fill="none" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.35" />
          <path d="M 535 275 L 508 300 L 532 390 L 515 435" fill="none" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.35" />
          <line x1="472" y1="360" x2="528" y2="360" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.3" />

          {/* THE HOODED KNIGHT (Mounted above and behind the horse's head) */}
          {/* Hooded Cowl */}
          <path
            d="M 455 160 C 465 120 485 95 500 95 C 515 95 535 120 545 160 C 555 190 550 215 540 230 C 530 220 515 210 500 210 C 485 210 470 220 460 230 C 450 215 445 190 455 160 Z"
            fill="#0f0f0f"
            stroke="#ffffff"
            strokeWidth="0.9"
            strokeOpacity="0.35"
          />

          {/* Shadowed Face within Hood */}
          <path
            d="M 472 165 C 485 155 515 155 528 165 C 530 185 520 200 500 205 C 480 200 470 185 472 165 Z"
            fill="#050505"
          />
          {/* Mysterious Eyes of the Timekeeper */}
          <ellipse cx="488" cy="178" rx="2" ry="1" fill="#ffffff" opacity="0.65" />
          <ellipse cx="512" cy="178" rx="2" ry="1" fill="#ffffff" opacity="0.65" />

          {/* Armored Shoulders / Pauldrons */}
          <path
            d="M 430 200 C 410 220 380 250 360 290 C 390 290 420 270 445 250 Z"
            fill="url(#armorHighlight)"
            stroke="#ffffff"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />
          <path
            d="M 570 200 C 590 220 620 250 640 290 C 610 290 580 270 555 250 Z"
            fill="url(#armorHighlight)"
            stroke="#ffffff"
            strokeWidth="0.75"
            strokeOpacity="0.4"
          />

          {/* Armored Breastplate & Collar Highlights */}
          <path
            d="M 445 240 L 500 270 L 555 240 L 535 290 L 500 310 L 465 290 Z"
            fill="#1c1c1c"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeOpacity="0.3"
          />

          {/* Lower Mist Fade over Steed base */}
          <rect x="300" y="580" width="400" height="150" fill="url(#mistFade)" opacity="0.8" />
        </g>

        {/* ============================================================ */}
        {/* ASTRONOMICAL CHRONOMETER / ASTROLABE ARCS & NUMBER RINGS    */}
        {/* ============================================================ */}
        <g id="astrolabe-arcs" transform="translate(500, 500)">
          {/* Outer Astronomical Concentric Boundary Circles */}
          <circle cx="0" cy="0" r="450" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="415" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <circle cx="0" cy="0" r="380" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" strokeDasharray="3 5" />
          <circle cx="0" cy="0" r="340" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.75" />

          {/* Rotating Subtle Celestial Gear Ring */}
          <g style={{ transform: `rotate(${secAngle * 0.15}deg)`, transition: 'transform 0.5s ease-out' }}>
            {outerTicks.map(({ angle, isMajor }, i) => {
              const rad = (angle * Math.PI) / 180;
              const r1 = isMajor ? 398 : 405;
              const r2 = 415;
              return (
                <line
                  key={`otick-${i}`}
                  x1={Math.sin(rad) * r1}
                  y1={-Math.cos(rad) * r1}
                  x2={Math.sin(rad) * r2}
                  y2={-Math.cos(rad) * r2}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={isMajor ? 1.2 : 0.6}
                  strokeOpacity={isMajor ? 0.7 : 0.2}
                />
              );
            })}
          </g>

          {/* Counter-rotating Inner Astronomical Coordinate Markings */}
          <g style={{ transform: `rotate(${-minAngle * 0.25}deg)`, transition: 'transform 0.6s ease-out' }}>
            <circle cx="0" cy="-340" r="4" fill="#ffffff" opacity="0.8" filter="url(#glowSubtle)" />
            <circle cx="0" cy="340" r="2.5" fill="rgba(255,255,255,0.4)" />
            <circle cx="-340" cy="0" r="2.5" fill="rgba(255,255,255,0.4)" />
            <circle cx="340" cy="0" r="2.5" fill="rgba(255,255,255,0.4)" />
          </g>

          {/* ============================================================ */}
          {/* APEX YEAR "2026" & CELESTIAL GLYPH (As seen in screenshot)  */}
          {/* ============================================================ */}
          <g transform="translate(0, -365)">
            <text
              x="0"
              y="0"
              fill="#ffffff"
              fontSize="16"
              fontFamily="var(--font-mono)"
              fontWeight="600"
              letterSpacing="3px"
              textAnchor="middle"
              dominantBaseline="central"
              opacity="0.85"
            >
              {year}
            </text>
            {/* Celestial Compass / Solar Glyph beneath year */}
            <circle cx="0" cy="22" r="5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.75" />
            <circle cx="0" cy="22" r="1.5" fill="#ffffff" opacity="0.9" />
            <line x1="0" y1="13" x2="0" y2="31" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
            <line x1="-9" y1="22" x2="9" y2="22" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
          </g>

          {/* ============================================================ */}
          {/* ARCHED DEGREE & COUNTDOWN NUMBER ARCS                        */}
          {/* ============================================================ */}
          {/* Upper Left Arc: 0, 1, 2, 3, 4, 5, 6, 7, 8... 20 */}
          <g id="left-arc-numbers">
            {leftArcNumbers.map(({ num, angle }) => {
              const rad = ((angle - 90) * Math.PI) / 180;
              const r = 362;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <text
                  key={`left-arc-${num}`}
                  x={x}
                  y={y}
                  fill="rgba(255, 255, 255, 0.55)"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${angle + 90}, ${x}, ${y})`}
                >
                  {num}
                </text>
              );
            })}
          </g>

          {/* Lower Arched Scale: 59, 58, 57, 56, 55 ... 37 */}
          <g id="countdown-arc-numbers">
            {countdownArcNumbers.map(({ num, angle }) => {
              const rad = ((angle - 90) * Math.PI) / 180;
              const r = 312;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <text
                  key={`cd-arc-${num}`}
                  x={x}
                  y={y}
                  fill="rgba(255, 255, 255, 0.45)"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${angle + 90}, ${x}, ${y})`}
                >
                  {num}
                </text>
              );
            })}
          </g>

          {/* Inner Hour Orbit Ring & Arc Accents */}
          <circle cx="0" cy="0" r="230" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="4 6" />
          <circle cx="0" cy="0" r="160" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" />
        </g>
      </svg>
    </div>
  );
};

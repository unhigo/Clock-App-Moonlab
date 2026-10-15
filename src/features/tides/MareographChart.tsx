import React from 'react';
import { TideSimulationState } from './types';
import { get24HourTideSamples } from './tideCalculations';

interface MareographChartProps {
  tideState: TideSimulationState;
  onHourSelect: (hour: number) => void;
}

export const MareographChart: React.FC<MareographChartProps> = ({
  tideState,
  onHourSelect
}) => {
  const { selectedLocation, selectedDate, currentHour, currentWaterHeight, peaksToday } = tideState;

  // Generate 96 points (one every 15 mins) for 24 hours
  const samples = get24HourTideSamples(selectedLocation, selectedDate, 96);

  // SVG coordinate dimensions
  const svgWidth = 800;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 24;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Find min and max for scaling
  const minH = Math.max(0, Math.min(...samples.map((s) => s.height)) - 0.4);
  const maxH = Math.max(...samples.map((s) => s.height)) + 0.4;
  const rangeH = Math.max(0.5, maxH - minH);

  const getX = (hour: number) => paddingX + (hour / 24) * plotWidth;
  const getY = (height: number) => paddingY + plotHeight - ((height - minH) / rangeH) * plotHeight;

  // Build SVG path
  let pathD = '';
  let areaD = '';

  samples.forEach((s, idx) => {
    const x = getX(s.hour);
    const y = getY(s.height);
    if (idx === 0) {
      pathD += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      areaD += `M ${x.toFixed(1)} ${(paddingY + plotHeight).toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      pathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      areaD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  });

  const lastX = getX(24);
  const baselineY = paddingY + plotHeight;
  areaD += ` L ${lastX.toFixed(1)} ${baselineY.toFixed(1)} Z`;

  // Current time position
  const currentX = getX(currentHour);
  const currentY = getY(currentWaterHeight);

  // Handle click on chart to scrub time
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clickX - (paddingX / svgWidth) * rect.width) / ((plotWidth / svgWidth) * rect.width)));
    const clickedHour = Math.round(ratio * 24 * 10) / 10;
    onHourSelect(clickedHour);
  };

  return (
    <div className="w-full bg-[#101416] border border-[#22282c] rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide uppercase">
            Curva Mareográfica (24 Horas)
          </span>
          <span className="text-[#888888] font-mono-time text-[11px]">
            {selectedLocation.name} · {selectedDate.toISOString().split('T')[0]}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono-time">
          <span className="text-[#22d3ee] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#22d3ee] inline-block" />
            Nivel actual: <strong className="text-white">{currentWaterHeight.toFixed(2)} m</strong>
          </span>
          <span className="text-[#9ca3af] hidden sm:inline">
            Rango: {minH.toFixed(1)}m – {maxH.toFixed(1)}m
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair select-none block"
          onClick={handleSvgClick}
        >
          <defs>
            {/* Water gradient fill */}
            <linearGradient id="tideWaterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="tideLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines (height marks) */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, i) => {
            const hVal = minH + frac * rangeH;
            const y = getY(hVal);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#1c2429"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#5c6670"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {hVal.toFixed(1)}m
                </text>
              </g>
            );
          })}

          {/* Vertical Time hour lines (00h, 04h, 08h, 12h, 16h, 20h, 24h) */}
          {[0, 4, 8, 12, 16, 20, 24].map((h) => {
            const x = getX(h);
            return (
              <g key={h}>
                <line
                  x1={x}
                  y1={paddingY}
                  x2={x}
                  y2={paddingY + plotHeight}
                  stroke="#1a2024"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={paddingY + plotHeight + 14}
                  textAnchor="middle"
                  fill="#717d8a"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {h.toString().padStart(2, '0')}:00
                </text>
              </g>
            );
          })}

          {/* Area fill under curve */}
          <path d={areaD} fill="url(#tideWaterGrad)" />

          {/* Sine curve line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#tideLineGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* High Tide / Low Tide peak markers */}
          {peaksToday.map((peak, idx) => {
            const px = getX(peak.hours);
            const py = getY(peak.height);
            const isHigh = peak.type === 'HIGH';
            return (
              <g key={idx}>
                {/* Vertical dotted pointer */}
                <line
                  x1={px}
                  y1={py}
                  x2={px}
                  y2={isHigh ? py - 14 : py + 14}
                  stroke={isHigh ? '#22d3ee' : '#f59e0b'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                {/* Marker circle */}
                <circle
                  cx={px}
                  cy={py}
                  r="4"
                  fill={isHigh ? '#22d3ee' : '#f59e0b'}
                  stroke="#0a0e10"
                  strokeWidth="1.5"
                />
                {/* Text label */}
                <rect
                  x={px - 28}
                  y={isHigh ? py - 26 : py + 10}
                  width="56"
                  height="13"
                  rx="3"
                  fill="#0c1114"
                  stroke={isHigh ? '#22d3ee' : '#f59e0b'}
                  strokeWidth="0.8"
                />
                <text
                  x={px}
                  y={isHigh ? py - 17 : py + 19}
                  textAnchor="middle"
                  fill={isHigh ? '#38bdf8' : '#fbbf24'}
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {isHigh ? 'PLEA' : 'BAJA'} {peak.timeStr}
                </text>
              </g>
            );
          })}

          {/* Current Hour Scrubber Line & Marker */}
          <line
            x1={currentX}
            y1={paddingY}
            x2={currentX}
            y2={paddingY + plotHeight}
            stroke="var(--accent-rind)"
            strokeWidth="1.8"
          />
          <circle
            cx={currentX}
            cy={currentY}
            r="5.5"
            fill="var(--accent-rind)"
            stroke="#000000"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Summary Footer bar */}
      <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 text-[#888888] border-t border-[#1a2024]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-white">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-rind)] inline-block" />
            Hora simulada:{' '}
            <strong className="font-mono-time text-[var(--accent-rind)]">
              {Math.floor(currentHour).toString().padStart(2, '0')}:
              {Math.floor((currentHour % 1) * 60).toString().padStart(2, '0')}
            </strong>
          </span>
          <span className="text-[#64748b]">
            (Haz clic o arrastra sobre el gráfico para saltar en el tiempo)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {peaksToday.map((p, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 rounded text-[10px] font-mono-time border ${
                p.type === 'HIGH'
                  ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20'
                  : 'border-amber-500/30 text-amber-400 bg-amber-950/20'
              }`}
            >
              {p.type === 'HIGH' ? '▲ Pleamar' : '▼ Bajamar'} {p.timeStr} ({p.height.toFixed(2)}m)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

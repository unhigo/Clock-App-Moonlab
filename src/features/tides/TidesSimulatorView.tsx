import React, { useState, useMemo } from 'react';
import { COASTAL_LOCATIONS, calculateTideState } from './tideCalculations';
import { TideLocation, CameraViewMode, MoonPhaseShortcut } from './types';
import { ThreeTidesCanvas } from './ThreeTidesCanvas';
import { MareographChart } from './MareographChart';
import {
  Waves,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Eye,
  Sliders,
  Calendar as CalendarIcon,
  MapPin,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Globe2,
  Info
} from 'lucide-react';

export const TidesSimulatorView: React.FC = () => {
  // Simulator State
  const [selectedLocation, setSelectedLocation] = useState<TideLocation>(COASTAL_LOCATIONS[0]); // Bahía de Fundy
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 9, 15, 12, 0, 0)); // 2026-10-15
  const [currentHour, setCurrentHour] = useState<number>(10.5); // 10:30
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // 3D Visual Options
  const [bulgeExaggeration, setBulgeExaggeration] = useState<number>(2.5);
  const [showGravitationalVectors, setShowGravitationalVectors] = useState<boolean>(true);
  const [showTidalBulge, setShowTidalBulge] = useState<boolean>(true);
  const [showOrbitPath, setShowOrbitPath] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('orbit');
  const [activeTab, setActiveInfoTab] = useState<'tides' | 'physics' | 'ports'>('tides');

  // Calculate current tide physics state
  const tideState = useMemo(() => {
    return calculateTideState(selectedLocation, selectedDate, currentHour);
  }, [selectedLocation, selectedDate, currentHour]);

  // Jump to specific moon phase for educational demonstrations
  const handleMoonPhaseJump = (phase: MoonPhaseShortcut) => {
    const newDate = new Date(selectedDate);
    // Approximate reference dates for 2026 phases or offsets
    switch (phase) {
      case 'NEW_MOON':
        // Conjunction (Moon at 0°)
        newDate.setFullYear(2026, 9, 10); // Luna Nueva
        break;
      case 'FIRST_QUARTER':
        // Quadrature (Moon at 90°)
        newDate.setFullYear(2026, 9, 18); // Cuarto Creciente
        break;
      case 'FULL_MOON':
        // Opposition (Moon at 180°)
        newDate.setFullYear(2026, 9, 25); // Luna Llena
        break;
      case 'LAST_QUARTER':
        // Quadrature (Moon at 270°)
        newDate.setFullYear(2026, 10, 2); // Cuarto Menguante
        break;
    }
    setSelectedDate(newDate);
  };

  const formattedTime = useMemo(() => {
    const hh = Math.floor(currentHour);
    const mm = Math.floor((currentHour % 1) * 60);
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }, [currentHour]);

  return (
    <div id="tides-simulator-view" className="w-full h-full flex flex-col space-y-6 pb-16">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#22282c]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Waves size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Simulador de Mareas y Gravitación Lunar
              </h2>
              <p className="text-xs text-[#888888] mt-0.5">
                Modelo 3D interactivo en tiempo real: interacción Tierra-Luna-Sol, deformación elipsoidal y curva mareográfica
              </p>
            </div>
          </div>
        </div>

        {/* Live status indicators */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Spring / Neap Tide Badge */}
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 ${
              tideState.tideCategory === 'SPRING'
                ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300'
                : tideState.tideCategory === 'NEAP'
                ? 'border-amber-500/50 bg-amber-950/30 text-amber-300'
                : 'border-slate-600 bg-slate-900/60 text-slate-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                tideState.tideCategory === 'SPRING'
                  ? 'bg-cyan-400'
                  : tideState.tideCategory === 'NEAP'
                  ? 'bg-amber-400'
                  : 'bg-slate-400'
              }`}
            />
            <span>{tideState.categoryLabel}</span>
          </div>

          {/* Tidal Coefficient Badge */}
          <div className="px-3 py-1.5 rounded-lg border border-[#263138] bg-[#12171a] text-xs font-mono-time flex items-center gap-2">
            <span className="text-[#888888]">Coeficiente SHOM:</span>
            <strong className="text-white text-sm">{tideState.tidalCoefficient}</strong>
            <span className="text-[10px] text-[#64748b]">/120</span>
          </div>

          {/* Lunar Phase Badge */}
          <div className="px-3 py-1.5 rounded-lg border border-[#263138] bg-[#12171a] text-xs flex items-center gap-2">
            <span className="text-[#888888]">Fase:</span>
            <span className="text-white font-medium">{tideState.phaseName}</span>
            <span className="text-[#22d3ee] font-mono-time">({tideState.illumination}%)</span>
          </div>
        </div>
      </div>

      {/* 2. Top Interactive Bar: Moon Phase Shortcuts & Date Selector */}
      <div className="bg-[#101416] border border-[#22282c] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#888888] font-semibold uppercase tracking-wider text-[11px] mr-1">
            Fases Lunares Clave:
          </span>
          <button
            onClick={() => handleMoonPhaseJump('NEW_MOON')}
            className="px-2.5 py-1 rounded bg-[#161c20] hover:bg-[#1f282e] border border-[#2a343b] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>🌑</span>
            <span>Luna Nueva (Marea Viva)</span>
          </button>
          <button
            onClick={() => handleMoonPhaseJump('FIRST_QUARTER')}
            className="px-2.5 py-1 rounded bg-[#161c20] hover:bg-[#1f282e] border border-[#2a343b] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>🌓</span>
            <span>Creciente (Marea Muerta)</span>
          </button>
          <button
            onClick={() => handleMoonPhaseJump('FULL_MOON')}
            className="px-2.5 py-1 rounded bg-[#161c20] hover:bg-[#1f282e] border border-[#2a343b] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>🌕</span>
            <span>Luna Llena (Marea Viva Máx)</span>
          </button>
          <button
            onClick={() => handleMoonPhaseJump('LAST_QUARTER')}
            className="px-2.5 py-1 rounded bg-[#161c20] hover:bg-[#1f282e] border border-[#2a343b] text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>🌗</span>
            <span>Menguante (Marea Muerta)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CalendarIcon size={14} className="text-[#888888]" />
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => {
              if (e.target.value) {
                const parts = e.target.value.split('-');
                setSelectedDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0));
              }
            }}
            className="bg-[#161c20] border border-[#2a343b] rounded px-2.5 py-1 text-white text-xs font-mono-time focus:outline-none focus:border-cyan-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Central Interactive 3D WebGL Scene & Camera Viewport */}
      <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-[#22282c] bg-[#05070a] shadow-2xl">
        {/* Three.js Canvas Container */}
        <ThreeTidesCanvas
          currentHour={currentHour}
          moonAngleRad={tideState.moonAngleRad}
          location={selectedLocation}
          bulgeExaggeration={bulgeExaggeration}
          showGravitationalVectors={showGravitationalVectors}
          showTidalBulge={showTidalBulge}
          showOrbitPath={showOrbitPath}
          cameraMode={cameraMode}
          isPlaying={isPlaying}
          onHourChange={(newH) => setCurrentHour(newH)}
        />

        {/* Floating Top-Left Badge: Astronomical Alignment Readout */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none bg-[#0a0f13]/90 border border-[#222c33] rounded-lg p-3 text-xs flex flex-col gap-1 backdrop-blur-none max-w-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#888888] font-semibold text-[10px] uppercase tracking-wider">
              Alineación Sol-Tierra-Luna
            </span>
            <span className="font-mono-time text-[10px] text-cyan-400">
              {Math.round((tideState.moonAngleRad * 180) / Math.PI)}°
            </span>
          </div>
          <div className="text-white font-medium text-sm flex items-center gap-1.5">
            <span>{tideState.phaseName}</span>
            <span className="text-xs text-[#22d3ee]">· {tideState.illumination}% iluminada</span>
          </div>
          <p className="text-[11px] text-[#9ca3af] leading-tight">
            {tideState.tideCategory === 'SPRING'
              ? 'Las fuerzas gravitatorias del Sol y la Luna se suman (Sicigia), produciendo pleamares máximas.'
              : tideState.tideCategory === 'NEAP'
              ? 'El Sol y la Luna tiran en ángulo recto a 90° (Cuadratura), atenuando la amplitud mareal.'
              : 'Fuerzas en transición geométrica intermedia.'}
          </p>
        </div>

        {/* Floating Top-Right: Camera Presets & Visual Layer Toggles */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Camera views */}
          <div className="bg-[#0a0f13]/95 border border-[#222c33] rounded-lg p-1.5 flex items-center gap-1">
            <button
              onClick={() => setCameraMode('orbit')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                cameraMode === 'orbit'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-[#888888] hover:text-white'
              }`}
              title="Vista Orbital Libre 3D"
            >
              <Globe2 size={13} />
              <span className="hidden sm:inline">Orbital 3D</span>
            </button>
            <button
              onClick={() => setCameraMode('top')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                cameraMode === 'top'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-[#888888] hover:text-white'
              }`}
              title="Vista Cenital / Alineación Eclíptica"
            >
              <Compass size={13} />
              <span className="hidden sm:inline">Polo Norte (Alineación)</span>
            </button>
            <button
              onClick={() => setCameraMode('coastal')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                cameraMode === 'coastal'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-[#888888] hover:text-white'
              }`}
              title="Enfoque en el Puerto Costero"
            >
              <MapPin size={13} />
              <span className="hidden sm:inline">Puerto Costero</span>
            </button>
          </div>

          {/* Layer toggles */}
          <div className="bg-[#0a0f13]/95 border border-[#222c33] rounded-lg p-2 text-[11px] flex flex-col gap-2">
            <label className="flex items-center justify-between gap-3 cursor-pointer text-[#888888] hover:text-white">
              <span>Vectores gravitatorios</span>
              <input
                type="checkbox"
                checked={showGravitationalVectors}
                onChange={(e) => setShowGravitationalVectors(e.target.checked)}
                className="accent-cyan-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer text-[#888888] hover:text-white">
              <span>Deformación oceánica</span>
              <input
                type="checkbox"
                checked={showTidalBulge}
                onChange={(e) => setShowTidalBulge(e.target.checked)}
                className="accent-cyan-500 cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer text-[#888888] hover:text-white">
              <span>Órbita lunar</span>
              <input
                type="checkbox"
                checked={showOrbitPath}
                onChange={(e) => setShowOrbitPath(e.target.checked)}
                className="accent-cyan-500 cursor-pointer"
              />
            </label>

            <div className="pt-1 border-t border-[#1f262c] flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] text-[#888888]">
                <span>Exageración abombamiento:</span>
                <span className="font-mono-time text-white">{bulgeExaggeration.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={bulgeExaggeration}
                onChange={(e) => setBulgeExaggeration(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-[#161c20] rounded"
              />
            </div>
          </div>
        </div>

        {/* Floating Bottom Center: Interactive Time Scrubber & Playback */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-2xl bg-[#0d1215]/95 border border-[#242e35] rounded-xl p-3 flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg border font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400'
                }`}
                title={isPlaying ? 'Pausar simulación' : 'Iniciar rotación en tiempo real'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentHour(0);
                }}
                className="p-2 rounded-lg border border-[#2b363d] bg-[#161c20] hover:bg-[#1f282e] text-[#888888] hover:text-white transition-colors cursor-pointer"
                title="Reiniciar a las 00:00"
              >
                <RotateCcw size={14} />
              </button>

              <div className="flex flex-col">
                <span className="text-[10px] text-[#888888] uppercase tracking-wider font-semibold">
                  Hora del Día
                </span>
                <span className="text-base font-bold font-mono-time text-white tracking-wide">
                  {formattedTime}{' '}
                  <span className="text-[10px] font-normal text-[#64748b]">UTC</span>
                </span>
              </div>
            </div>

            {/* Quick jump to Next Peak */}
            <div className="flex items-center gap-3 text-xs">
              <div className="text-right">
                <div className="text-[10px] text-[#888888] uppercase tracking-wider">
                  Próxima {tideState.nextPeak.type === 'HIGH' ? 'Pleamar ▲' : 'Bajamar ▼'}
                </div>
                <div className="font-mono-time font-bold text-white">
                  {tideState.nextPeak.timeStr} ({tideState.nextPeak.height.toFixed(2)}m)
                  <span className="text-[10px] font-normal text-cyan-400 ml-1.5">
                    en {Math.floor(tideState.nextPeak.minutesLeft / 60)}h{' '}
                    {tideState.nextPeak.minutesLeft % 60}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Scrubber Slider */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] font-mono-time text-[#64748b]">00:00</span>
            <input
              type="range"
              min="0"
              max="24"
              step="0.1"
              value={currentHour}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentHour(parseFloat(e.target.value));
              }}
              className="flex-1 accent-cyan-400 cursor-pointer h-2 bg-[#1b2228] rounded-lg"
            />
            <span className="text-[10px] font-mono-time text-[#64748b]">24:00</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Mareograph Curve (24h Water Height Chart) */}
      <MareographChart
        tideState={tideState}
        onHourSelect={(h) => {
          setIsPlaying(false);
          setCurrentHour(h);
        }}
      />

      {/* 5. Coastal Ports & Locations Selector */}
      <div className="bg-[#101416] border border-[#22282c] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
              Puertos y Cuencas Oceánicas del Mundo
            </h3>
          </div>
          <span className="text-xs text-[#888888]">
            Selecciona un puerto para visualizar su respuesta mareal y resonancia local
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {COASTAL_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/20 text-white shadow-md'
                    : 'border-[#22282c] bg-[#141a1d] hover:border-[#333d44] text-[#888888] hover:text-[#d1d5db]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                      <span>{loc.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#20292f] text-[#9ca3af] font-normal">
                        {loc.country}
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#888888] mt-0.5">{loc.region}</p>
                  </div>
                  <span
                    className={`text-xs font-mono-time font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#1e252a] text-[#a0aab2]'
                    }`}
                  >
                    Rango: {loc.maxRange}m
                  </span>
                </div>

                <p className="text-[11px] text-[#9ca3af] line-clamp-2 leading-relaxed">
                  {loc.description}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono-time text-[#64748b] pt-1 border-t border-[#1f262b]">
                  <span>Lat: {loc.lat.toFixed(1)}° · Lon: {loc.lon.toFixed(1)}°</span>
                  <span className="capitalize">{loc.tidalType}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Scientific & Educational Dossier */}
      <div className="bg-[#101416] border border-[#22282c] rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#22282c] pb-3">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Fundamentos Astrofísicos del Fenómeno de Mareas
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-[#161c20] p-1 rounded-lg border border-[#22282c] text-xs">
            <button
              onClick={() => setActiveInfoTab('tides')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'tides'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Fuerzas Diferenciales
            </button>
            <button
              onClick={() => setActiveInfoTab('physics')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'physics'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Vivas vs Muertas
            </button>
            <button
              onClick={() => setActiveInfoTab('ports')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                activeTab === 'ports'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Resonancia en Bahías
            </button>
          </div>
        </div>

        {/* Tab 1: Differential Forces */}
        {activeTab === 'tides' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-[#a0aab2]">
            <div className="bg-[#141a1d] p-3.5 rounded-lg border border-[#22282c]">
              <h4 className="font-semibold text-white text-sm mb-1.5 text-cyan-300">
                1. ¿Por qué hay dos pleamares al día?
              </h4>
              <p>
                La fuerza de marea es un <strong>gradiente gravitacional</strong> diferencial ($F \propto 1/r^3$). En la cara terrestre orientada hacia la Luna, el agua experimenta mayor atracción que el centro de la Tierra, abombándose hacia ella. En la cara opuesta, el centro de la Tierra es atraído con más fuerza que el agua lejana, dejando atrás una segunda cresta opuesta simétrica.
              </p>
            </div>
            <div className="bg-[#141a1d] p-3.5 rounded-lg border border-[#22282c]">
              <h4 className="font-semibold text-white text-sm mb-1.5 text-cyan-300">
                2. El Día Lunar de 24h 50m
              </h4>
              <p>
                Mientras la Tierra gira sobre su propio eje cada 24 horas, la Luna avanza simultáneamente unos 13° hacia el este en su órbita alrededor de la Tierra. Para que un punto costero vuelva a alinearse con la Luna, la Tierra necesita girar <strong>50 minutos adicionales</strong>, resultando en un ciclo semidiurno de ~12 horas y 25 minutos entre cada pleamar.
              </p>
            </div>
            <div className="bg-[#141a1d] p-3.5 rounded-lg border border-[#22282c]">
              <h4 className="font-semibold text-white text-sm mb-1.5 text-cyan-300">
                3. La Contribución del Sol
              </h4>
              <p>
                Aunque la masa del Sol es 27 millones de veces mayor que la de la Luna, su distancia es 389 veces superior. Debido a la ley de la inversa del cubo de la fuerza de marea, la atracción mareal del Sol representa aproximadamente el <strong>46%</strong> de la lunar, modulando la intensidad del ciclo quincenal.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Spring vs Neap Tides */}
        {activeTab === 'physics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-[#a0aab2]">
            <div className="bg-[#141a1d] p-4 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <h4 className="font-semibold text-white text-sm">
                  Mareas Vivas o de Sicigia (Spring Tides)
                </h4>
              </div>
              <p className="mb-2">
                Ocurren durante la <strong>Luna Nueva</strong> (conjunción, ángulo 0°) y la <strong>Luna Llena</strong> (oposición, ángulo 180°). El Sol, la Tierra y la Luna se encuentran alineados en el plano eclíptico.
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
                <li>Los abombamientos gravitacionales solar y lunar se superponen y refuerzan.</li>
                <li>Pleamares más altas del mes y bajamares extraordinariamente secas.</li>
                <li>Coeficientes de marea SHOM superiores a 85 (hasta 115-120 con Superluna/Perigeo).</li>
              </ul>
            </div>

            <div className="bg-[#141a1d] p-4 rounded-lg border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h4 className="font-semibold text-white text-sm">
                  Mareas Muertas o de Cuadratura (Neap Tides)
                </h4>
              </div>
              <p className="mb-2">
                Ocurren durante el <strong>Cuarto Creciente</strong> (90°) y el <strong>Cuarto Menguante</strong> (270°). La línea Tierra-Sol forma un ángulo de 90° con la línea Tierra-Luna.
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#cbd5e1]">
                <li>El tirón gravitatorio solar contrarresta parcialmente al lunar en ángulo recto.</li>
                <li>Mínima amplitud diaria: pleamares reducidas y bajamares poco pronunciadas.</li>
                <li>Coeficientes de marea SHOM por debajo de 50.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Resonance in Bays */}
        {activeTab === 'ports' && (
          <div className="bg-[#141a1d] p-4 rounded-lg border border-[#22282c] text-xs leading-relaxed text-[#a0aab2] space-y-3">
            <h4 className="font-semibold text-white text-sm text-cyan-300">
              ¿Por qué la Bahía de Fundy o Mont-Saint-Michel superan los 14 metros mientras el Mediterráneo apenas tiene 40 cm?
            </h4>
            <p>
              En alta mar abierta (como en Honolulu, Hawái), la oscilación mareal pura es de apenas 0.5 a 1 metro. La gigantesca diferencia que observamos en las costas obedece a tres factores geomorfológicos e hidrodinámicos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded bg-[#0d1215] border border-[#22282c]">
                <strong className="text-white block mb-1">1. Resonancia Hidrodinámica</strong>
                <span>El periodo natural de oscilación de la Bahía de Fundy (13 horas) coincide casi exactamente con el periodo semidiurno lunar de la marea entrante (12.4 horas), creando un efecto de columpio oscilante resonante.</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1215] border border-[#22282c]">
                <strong className="text-white block mb-1">2. Efecto Embudo Costero</strong>
                <span>A medida que la masa oceánica penetra en canales angostos y aguas poco profundas, la conservación de energía empuja verticalmente la columna de agua.</span>
              </div>
              <div className="p-2.5 rounded bg-[#0d1215] border border-[#22282c]">
                <strong className="text-white block mb-1">3. Cuencas Cerradas</strong>
                <span>Mares semicerrados como el Mediterráneo o el Báltico tienen bocas de entrada muy estrechas (Estrecho de Gibraltar) que impiden el flujo masivo de la onda oceánica atlántica.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { LUNAR_STYLES, LUNAR_STYLE_LIST } from '../../data/lunarStyles';
import { 
  getMonthLunarDays, 
  getYearLunarDays, 
  getDateRangeLunarDays, 
  TRADITIONAL_MOON_NAMES 
} from '../../utils/lunarEngine';
import { VectorMoon } from '../../components/lunar/VectorMoon';
import { 
  LunarStyleId, 
  CanvaFormat, 
  CanvaResolution, 
  CanvaExportFormat, 
  CanvaConfig,
  LunarDayData
} from '../../types';
import { 
  ControlSlider, 
  ControlSelect, 
  ControlToggle, 
  ControlColor, 
  ControlNumber, 
  ControlText, 
  ControlButton 
} from '../../components/controls';
import { 
  Download, 
  Layout, 
  Palette, 
  Image as ImageIcon, 
  Sliders, 
  Sparkles, 
  Type, 
  Upload, 
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';

export const CanvaLunarGenerator: React.FC = () => {
  // Canva Generator State
  const [config, setConfig] = useState<CanvaConfig>({
    year: 2026,
    month: null, // null = full year
    isRange: false,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    styleId: 'obsidian',
    format: 'horizontal',
    aspectRatio: '16:9',
    customColors: {
      bg: '#000000',
      accent: '#10b981',
      text: '#ffffff',
      moon: '#f4f4f5'
    },
    bgImage: null,
    filters: {
      brightness: 100,
      contrast: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      vignette: 20
    },
    toggles: {
      showPhaseNames: true,
      showIllumination: true,
      showTraditionalNames: true,
      showMoonAge: false,
      showDayNumbers: true,
      showGridBorders: true,
      showZodiac: false
    },
    title: 'CALENDARIO LUNAR 2026',
    subtitle: 'FASES ASTRONÓMICAS • CICLO SINÓDICO 29.53 DÍAS',
    quote: 'Bajo la danza eterna de la luz y la sombra, la luna revela el tiempo cósmico.'
  });

  const [activeTab, setActiveTab] = useState<'layout' | 'style' | 'bg' | 'display' | 'ai'>('layout');
  const [resolution, setResolution] = useState<CanvaResolution>('4k');
  const [exportFormat, setExportFormat] = useState<CanvaExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const previewCanvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active theme definition
  const currentTheme = LUNAR_STYLES[config.styleId] || LUNAR_STYLES.obsidian;

  // Compute lunar days data based on selection
  const calendarDays = useMemo(() => {
    if (config.isRange) {
      return getDateRangeLunarDays(config.startDate, config.endDate);
    }
    if (config.month !== null) {
      return getMonthLunarDays(config.year, config.month);
    }
    // Full year (grouped by month 1..12)
    return getYearLunarDays(config.year);
  }, [config.year, config.month, config.isRange, config.startDate, config.endDate]);

  // Group days by month for the layout
  const monthsGrouped = useMemo(() => {
    const groups: { month: number; name: string; days: LunarDayData[] }[] = [];
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    if (config.month !== null && !config.isRange) {
      groups.push({
        month: config.month,
        name: monthNames[config.month - 1],
        days: calendarDays
      });
      return groups;
    }

    for (let m = 1; m <= 12; m++) {
      const mDays = calendarDays.filter(d => d.month === m);
      if (mDays.length > 0) {
        groups.push({
          month: m,
          name: monthNames[m - 1],
          days: mDays
        });
      }
    }
    return groups;
  }, [calendarDays, config.month, config.isRange]);

  // Handle background upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setConfig(prev => ({ ...prev, bgImage: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Generator prompt helper
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    // AI poetic and astrological title generator
    setTimeout(() => {
      const titles = [
        {
          title: `CRÓNICAS DE LA LUNA ${config.year}`,
          sub: 'CICLOS CELESTES, MAREAS Y TRASCENDENCIA',
          quote: 'Cada fase es un eco silencioso de la luz solar en el velo de la noche.'
        },
        {
          title: `EPITAFIO DE OBSIDIANA ${config.year}`,
          sub: 'HOROLOGÍA LUNAR & EFEMÉRIDES ASTRONÓMICAS',
          quote: 'El tiempo no avanza en línea recta, orbita al compás del ciclo sinódico.'
        },
        {
          title: `SINFONÍA DE PLATA & OBSIDIANA ${config.year}`,
          sub: 'ESTACIÓN ASTRONÓMICA DE OBSERVACIÓN PROFUNDA',
          quote: 'En la oscuridad más densa, la luna creciente traza el mapa del cosmos.'
        }
      ];
      const pick = titles[Math.floor(Math.random() * titles.length)];
      setConfig(prev => ({
        ...prev,
        title: pick.title,
        subtitle: pick.sub,
        quote: pick.quote
      }));
      setIsGeneratingAI(false);
    }, 600);
  };

  // High-Resolution Export Handler (PDF, PNG, JPG, SVG, WEBP)
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Dimensions map for HD, 2K, 4K, 8K
      const resMap: Record<CanvaResolution, { w: number; h: number }> = {
        hd: config.format === 'horizontal' ? { w: 1920, h: 1080 } : { w: 1080, h: 1920 },
        '2k': config.format === 'horizontal' ? { w: 2560, h: 1440 } : { w: 1440, h: 2560 },
        '4k': config.format === 'horizontal' ? { w: 3840, h: 2160 } : { w: 2160, h: 3840 },
        '8k': config.format === 'horizontal' ? { w: 7680, h: 4320 } : { w: 4320, h: 7680 }
      };

      const { w, h } = resMap[resolution];

      // If SVG export: generate vector SVG markup directly
      if (exportFormat === 'svg') {
        const svgContent = generateVectorCalendarSVG(w, h, config, monthsGrouped, currentTheme);
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        downloadFile(url, `calendario-lunar-${config.year}-${resolution}.svg`);
        setIsExporting(false);
        return;
      }

      // Render onto high-res offscreen HTML5 Canvas
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context failure');

      // Draw Background
      ctx.fillStyle = config.customColors.bg || currentTheme.palette.bg;
      ctx.fillRect(0, 0, w, h);

      // If background image exists, draw it with filters
      if (config.bgImage) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.save();
            ctx.filter = `brightness(${config.filters.brightness}%) contrast(${config.filters.contrast}%) grayscale(${config.filters.grayscale}%) blur(${config.filters.blur * (w / 1920)}px)`;
            ctx.drawImage(img, 0, 0, w, h);
            ctx.restore();
            resolve();
          };
          img.src = config.bgImage!;
        });
      }

      // Vignette effect
      if (config.filters.vignette > 0) {
        const grad = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, `rgba(0,0,0,${config.filters.vignette / 100})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Draw Title & Header
      const scale = w / 1920;
      ctx.fillStyle = config.customColors.text || currentTheme.palette.text;
      ctx.textAlign = 'center';
      
      // Title
      ctx.font = `bold ${Math.round(44 * scale)}px "Space Grotesk", sans-serif`;
      ctx.fillText(config.title, w / 2, 100 * scale);

      // Subtitle
      ctx.fillStyle = config.customColors.accent || currentTheme.palette.accent;
      ctx.font = `600 ${Math.round(18 * scale)}px "JetBrains Mono", monospace`;
      ctx.fillText(config.subtitle, w / 2, 140 * scale);

      // Quote
      if (config.quote) {
        ctx.fillStyle = currentTheme.palette.muted;
        ctx.font = `italic ${Math.round(15 * scale)}px serif`;
        ctx.fillText(`"${config.quote}"`, w / 2, 175 * scale);
      }

      // Draw Months & Lunar Grid
      drawCalendarGridOnCanvas(ctx, w, h, scale, config, monthsGrouped, currentTheme);

      // Footer
      ctx.fillStyle = currentTheme.palette.muted;
      ctx.font = `${Math.round(12 * scale)}px "JetBrains Mono", monospace`;
      ctx.fillText(`TIMEDRIFT OBSIDIAN CHRONOMETER • RESOLUCIÓN ${resolution.toUpperCase()} (${w}x${h}) • CICLO SINÓDICO 29.53d`, w / 2, h - 30 * scale);

      // Export file based on format
      if (exportFormat === 'pdf') {
        const orientation = config.format === 'horizontal' ? 'landscape' : 'portrait';
        const doc = new jsPDF({
          orientation,
          unit: 'px',
          format: [w, h]
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        doc.addImage(imgData, 'JPEG', 0, 0, w, h);
        doc.save(`calendario-lunar-${config.year}-${resolution}.pdf`);
      } else {
        const mimeType = exportFormat === 'jpg' ? 'image/jpeg' : exportFormat === 'webp' ? 'image/webp' : 'image/png';
        const dataUrl = canvas.toDataURL(mimeType, 0.98);
        downloadFile(dataUrl, `calendario-lunar-${config.year}-${resolution}.${exportFormat}`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row h-full min-h-[720px] gap-6 text-white font-sans">
      {/* ============================================================== */}
      {/* LEFT TOOLBAR: CANVA.COM STYLE EDITOR TABS                      */}
      {/* ============================================================== */}
      <div className="w-full lg:w-[380px] bg-[#0A0A0A] border border-[#1F1F1F] rounded-[18px] p-[16px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] flex flex-col gap-3 shrink-0 overflow-y-auto max-h-[85vh] custom-scrollbar">
        {/* Editor Title Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
          <div>
            <span className="text-[13px] font-[600] text-[#FFFFFF] font-sans tracking-tight">
              Generador Lunar
            </span>
            <p className="text-[12px] font-[400] text-[#888888] font-sans mt-0.5">
              Configuración técnica &amp; Exportación
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-[6px] bg-[#171717] text-[#E5E5E5] font-medium">
            PRO STUDIO
          </span>
        </div>

        {/* Tab Buttons (5 tabs) */}
        <div className="grid grid-cols-5 gap-1 bg-[#171717] p-1 rounded-[8px]">
          {[
            { id: 'layout' as const, label: 'Formato', icon: <Layout size={12} /> },
            { id: 'style' as const, label: 'Estilos', icon: <Palette size={12} /> },
            { id: 'bg' as const, label: 'Fondo', icon: <ImageIcon size={12} /> },
            { id: 'display' as const, label: 'Capas', icon: <Eye size={12} /> },
            { id: 'ai' as const, label: 'Texto IA', icon: <Sparkles size={12} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`h-[30px] rounded-[6px] flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#2E2E2E] text-[#FFFFFF]'
                  : 'text-[#888888] hover:text-[#FFFFFF]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: FORMATO & FECHAS */}
        {activeTab === 'layout' && (
          <div className="flex flex-col gap-2 pt-1">
            <ControlSelect
              label="Orientación"
              value={config.format}
              options={[
                { value: 'horizontal', label: 'Horizontal (16:9)' },
                { value: 'vertical', label: 'Vertical (9:16)' },
              ]}
              onChange={(val) => setConfig(prev => ({
                ...prev,
                format: val as CanvaFormat,
                aspectRatio: val === 'horizontal' ? '16:9' : '9:16'
              }))}
            />

            <ControlSelect
              label="Período"
              value={config.isRange ? 'range' : (config.month === null ? 'full_year' : 'month')}
              options={[
                { value: 'full_year', label: 'Año Completo' },
                { value: 'month', label: 'Un Mes' },
                { value: 'range', label: 'Temporada (Rango)' },
              ]}
              onChange={(val) => {
                if (val === 'full_year') {
                  setConfig(prev => ({ ...prev, isRange: false, month: null }));
                } else if (val === 'month') {
                  setConfig(prev => ({ ...prev, isRange: false, month: prev.month || 1 }));
                } else {
                  setConfig(prev => ({ ...prev, isRange: true }));
                }
              }}
            />

            <ControlNumber
              label="Año Calendario"
              value={config.year}
              min={2026}
              max={3000}
              step={1}
              onChange={(val) => setConfig(prev => ({ ...prev, year: val }))}
            />

            {!config.isRange && config.month !== null && (
              <ControlSelect
                label="Mes Específico"
                value={config.month}
                options={[
                  { value: 1, label: 'Enero' },
                  { value: 2, label: 'Febrero' },
                  { value: 3, label: 'Marzo' },
                  { value: 4, label: 'Abril' },
                  { value: 5, label: 'Mayo' },
                  { value: 6, label: 'Junio' },
                  { value: 7, label: 'Julio' },
                  { value: 8, label: 'Agosto' },
                  { value: 9, label: 'Septiembre' },
                  { value: 10, label: 'Octubre' },
                  { value: 11, label: 'Noviembre' },
                  { value: 12, label: 'Diciembre' },
                ]}
                onChange={(val) => setConfig(prev => ({ ...prev, month: Number(val) }))}
              />
            )}

            {config.isRange && (
              <>
                <ControlText
                  label="Fecha Inicial"
                  value={config.startDate}
                  placeholder="2026-01-01"
                  onChange={(val) => setConfig(prev => ({ ...prev, startDate: val }))}
                />
                <ControlText
                  label="Fecha Final"
                  value={config.endDate}
                  placeholder="2026-12-31"
                  onChange={(val) => setConfig(prev => ({ ...prev, endDate: val }))}
                />
              </>
            )}
          </div>
        )}

        {/* TAB 2: ESTILOS & PALETA DE COLOR */}
        {activeTab === 'style' && (
          <div className="flex flex-col gap-2 pt-1">
            <ControlSelect
              label="Plantilla Estilo"
              value={config.styleId}
              options={LUNAR_STYLE_LIST.map(st => ({
                value: st.id,
                label: st.name
              }))}
              onChange={(val) => {
                const st = LUNAR_STYLE_LIST.find(s => s.id === val);
                if (st) {
                  setConfig(prev => ({
                    ...prev,
                    styleId: st.id,
                    customColors: {
                      bg: st.palette.bg,
                      accent: st.palette.accent,
                      text: st.palette.text,
                      moon: st.palette.moonLit
                    }
                  }));
                }
              }}
            />

            <ControlColor
              label="Color Fondo"
              value={config.customColors.bg}
              onChange={(val) => setConfig(prev => ({
                ...prev,
                customColors: { ...prev.customColors, bg: val }
              }))}
            />

            <ControlColor
              label="Color Acento"
              value={config.customColors.accent}
              onChange={(val) => setConfig(prev => ({
                ...prev,
                customColors: { ...prev.customColors, accent: val }
              }))}
            />

            <ControlColor
              label="Color Texto"
              value={config.customColors.text}
              onChange={(val) => setConfig(prev => ({
                ...prev,
                customColors: { ...prev.customColors, text: val }
              }))}
            />

            <ControlColor
              label="Color Luna"
              value={config.customColors.moon}
              onChange={(val) => setConfig(prev => ({
                ...prev,
                customColors: { ...prev.customColors, moon: val }
              }))}
            />
          </div>
        )}

        {/* TAB 3: FONDO Y FILTROS */}
        {activeTab === 'bg' && (
          <div className="flex flex-col gap-2 pt-1">
            <ControlButton
              label={config.bgImage ? "Cambiar Imagen de Fondo" : "Subir Imagen de Fondo"}
              icon={<Upload size={13} />}
              onClick={() => fileInputRef.current?.click()}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBgUpload}
              className="hidden"
            />

            {config.bgImage && (
              <ControlButton
                label="Eliminar Imagen Cargada"
                variant="danger"
                onClick={() => setConfig(prev => ({ ...prev, bgImage: null }))}
              />
            )}

            <ControlSlider
              label="Brillo"
              value={config.filters.brightness}
              min={30}
              max={170}
              step={1}
              unit="%"
              onChange={(val) => setConfig(prev => ({
                ...prev,
                filters: { ...prev.filters, brightness: val }
              }))}
            />

            <ControlSlider
              label="Contraste"
              value={config.filters.contrast}
              min={50}
              max={180}
              step={1}
              unit="%"
              onChange={(val) => setConfig(prev => ({
                ...prev,
                filters: { ...prev.filters, contrast: val }
              }))}
            />

            <ControlSlider
              label="Blanco y Negro"
              value={config.filters.grayscale}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={(val) => setConfig(prev => ({
                ...prev,
                filters: { ...prev.filters, grayscale: val }
              }))}
            />

            <ControlSlider
              label="Sombra Viñeta"
              value={config.filters.vignette}
              min={0}
              max={90}
              step={1}
              unit="%"
              onChange={(val) => setConfig(prev => ({
                ...prev,
                filters: { ...prev.filters, vignette: val }
              }))}
            />
          </div>
        )}

        {/* TAB 4: CAPAS Y TOGGLES */}
        {activeTab === 'display' && (
          <div className="flex flex-col gap-2 pt-1">
            <ControlToggle
              label="Nombres de Fases"
              checked={config.toggles.showPhaseNames}
              onChange={(checked) => setConfig(prev => ({
                ...prev,
                toggles: { ...prev.toggles, showPhaseNames: checked }
              }))}
            />

            <ControlToggle
              label="Porcentaje Iluminación"
              checked={config.toggles.showIllumination}
              onChange={(checked) => setConfig(prev => ({
                ...prev,
                toggles: { ...prev.toggles, showIllumination: checked }
              }))}
            />

            <ControlToggle
              label="Nombres Tradicionales"
              checked={config.toggles.showTraditionalNames}
              onChange={(checked) => setConfig(prev => ({
                ...prev,
                toggles: { ...prev.toggles, showTraditionalNames: checked }
              }))}
            />

            <ControlToggle
              label="Edad de la Luna"
              checked={config.toggles.showMoonAge}
              onChange={(checked) => setConfig(prev => ({
                ...prev,
                toggles: { ...prev.toggles, showMoonAge: checked }
              }))}
            />

            <ControlToggle
              label="Números de Día"
              checked={config.toggles.showDayNumbers}
              onChange={(checked) => setConfig(prev => ({
                ...prev,
                toggles: { ...prev.toggles, showDayNumbers: checked }
              }))}
            />

            <ControlToggle
              label="Cuadrícula Matemática"
              checked={config.toggles.showGridBorders}
              onChange={(checked) => setConfig(prev => ({
                ...prev,
                toggles: { ...prev.toggles, showGridBorders: checked }
              }))}
            />
          </div>
        )}

        {/* TAB 5: TEXTOS & IA */}
        {activeTab === 'ai' && (
          <div className="flex flex-col gap-2 pt-1">
            <ControlButton
              label={isGeneratingAI ? "Generando Textos..." : "Generar con Asistente IA"}
              icon={<Sparkles size={13} />}
              disabled={isGeneratingAI}
              onClick={handleGenerateAI}
            />

            <ControlText
              label="Título Principal"
              value={config.title}
              placeholder="CALENDARIO LUNAR 2026"
              onChange={(val) => setConfig(prev => ({ ...prev, title: val }))}
            />

            <ControlText
              label="Subtítulo"
              value={config.subtitle}
              placeholder="FASES ASTRONÓMICAS • CICLO SINÓDICO"
              onChange={(val) => setConfig(prev => ({ ...prev, subtitle: val }))}
            />

            <ControlText
              label="Cita Cósmica"
              value={config.quote}
              placeholder="Epígrafe cósmico..."
              onChange={(val) => setConfig(prev => ({ ...prev, quote: val }))}
            />
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* RIGHT STAGE: REAL-TIME INTERACTIVE CANVAS PREVIEW & EXPORT BAR */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Top Export Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-[16px] bg-[#0A0A0A] border border-[#1F1F1F] rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          {/* Format selector: PNG, JPG, SVG, WEBP, PDF */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-[600] text-[#FFFFFF] font-sans">Formato:</span>
            <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-[8px]">
              {(['png', 'jpg', 'svg', 'webp', 'pdf'] as CanvaExportFormat[]).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`h-[24px] px-2 rounded-[6px] text-[11px] font-mono transition-colors cursor-pointer ${
                    exportFormat === fmt
                      ? 'bg-[#2E2E2E] text-[#FFFFFF] font-[600]'
                      : 'text-[#888888] hover:text-[#FFFFFF]'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selector: HD, 2K, 4K, 8K */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-[600] text-[#FFFFFF] font-sans">Resolución:</span>
            <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-[8px]">
              {(['hd', '2k', '4k', '8k'] as CanvaResolution[]).map(res => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`h-[24px] px-2 rounded-[6px] text-[11px] font-mono transition-colors cursor-pointer ${
                    resolution === res
                      ? 'bg-[#2E2E2E] text-[#FFFFFF] font-[600]'
                      : 'text-[#888888] hover:text-[#FFFFFF]'
                  }`}
                >
                  {res.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Download Action Button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="h-[32px] bg-[#171717] hover:bg-[#1E1E1E] active:bg-[#141414] text-[#FFFFFF] rounded-[8px] px-4 text-[13px] font-[600] flex items-center gap-2 select-none focus:outline-none focus:ring-1 focus:ring-[#444444] transition-colors cursor-pointer disabled:opacity-40"
          >
            <Download size={13} />
            <span>{isExporting ? 'RENDERIZANDO...' : `DESCARGAR ${exportFormat.toUpperCase()} (${resolution.toUpperCase()})`}</span>
          </button>
        </div>

        {/* Live Canvas Stage */}
        <div className="flex-1 flex items-center justify-center p-4 bg-[#0A0A0A] border border-[#1F1F1F] rounded-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden relative min-h-[480px]">
          {/* Visual Canvas Paper Wrapper */}
          <div
            ref={previewCanvasRef}
            className={`w-full max-w-4xl transition-all duration-300 relative rounded-xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col justify-between ${
              config.format === 'horizontal' ? 'aspect-[16/9]' : 'aspect-[9/16] max-w-md'
            }`}
            style={{
              backgroundColor: config.customColors.bg || currentTheme.palette.bg,
              color: config.customColors.text || currentTheme.palette.text,
              backgroundImage: config.bgImage ? `url(${config.bgImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `brightness(${config.filters.brightness}%) contrast(${config.filters.contrast}%) grayscale(${config.filters.grayscale}%)`
            }}
          >
            {/* Header in Preview */}
            <div className="flex flex-col items-center text-center gap-1 shrink-0 z-10">
              <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase font-display">
                {config.title}
              </h1>
              <h2 className="text-[11px] sm:text-xs tracking-wider uppercase font-mono" style={{ color: config.customColors.accent || currentTheme.palette.accent }}>
                {config.subtitle}
              </h2>
              {config.quote && (
                <p className="text-[10px] italic text-white/60 max-w-lg mt-0.5">
                  "{config.quote}"
                </p>
              )}
            </div>

            {/* Months Matrix / Lunar Display */}
            <div className="my-auto py-4 z-10 w-full overflow-hidden">
              {monthsGrouped.length === 1 ? (
                /* Single Month Layout */
                <div className="w-full flex flex-col gap-2">
                  <div className="text-center font-bold text-base font-display">
                    {monthsGrouped[0].name} {config.year}
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 max-w-xl mx-auto w-full">
                    {monthsGrouped[0].days.map(d => (
                      <div key={d.date} className="p-1.5 rounded bg-white/5 border border-white/10 flex flex-col items-center">
                        <span className="text-[9px] font-mono opacity-60">{d.day}</span>
                        <VectorMoon
                          phase={d.phase}
                          phaseKey={d.phaseKey}
                          size={18}
                          litColor={config.customColors.moon}
                        />
                        {config.toggles.showIllumination && (
                          <span className="text-[8px] font-mono opacity-40">{d.illumination}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* 12 Months Grid Layout (Mathematical clean representation) */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 text-center">
                  {monthsGrouped.map(m => {
                    const fullMoonDay = m.days.find(d => d.phaseKey === 'FULL_MOON');
                    return (
                      <div
                        key={m.name}
                        className="p-2 sm:p-2.5 rounded-lg border flex flex-col gap-1.5 items-center justify-between"
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.03)',
                          borderColor: currentTheme.palette.border
                        }}
                      >
                        <div className="flex items-center justify-between w-full text-[10px] font-mono uppercase font-bold tracking-wider opacity-80">
                          <span>{m.name.slice(0, 3)}</span>
                          {fullMoonDay && (
                            <span className="text-[8px] text-amber-300">
                              🌕 {fullMoonDay.day}
                            </span>
                          )}
                        </div>

                        {/* Mini phases track for month */}
                        <div className="flex items-center justify-center gap-1 my-1">
                          <VectorMoon phase={0} size={13} shadowColor="#27272a" />
                          <VectorMoon phase={2} size={13} litColor={config.customColors.moon} />
                          <VectorMoon phase={4} size={15} litColor={config.customColors.moon} glow />
                          <VectorMoon phase={6} size={13} litColor={config.customColors.moon} />
                        </div>

                        {config.toggles.showTraditionalNames && (
                          <span className="text-[9px] italic opacity-50 truncate max-w-full font-serif">
                            {TRADITIONAL_MOON_NAMES[m.month]?.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer in Preview */}
            <div className="flex items-center justify-between text-[9px] font-mono opacity-40 border-t pt-2 shrink-0 z-10" style={{ borderColor: currentTheme.palette.border }}>
              <span>TIMEDRIFT OBSIDIAN • CICLO SINÓDICO</span>
              <span>{resolution.toUpperCase()} ULTRA RESOLUTION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Canvas drawing helper for pristine offscreen renders
function drawCalendarGridOnCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  scale: number,
  config: CanvaConfig,
  months: { month: number; name: string; days: LunarDayData[] }[],
  theme: any
) {
  const startY = 240 * scale;
  const gridW = w - 160 * scale;
  const startX = 80 * scale;

  if (months.length === 1) {
    // Single month
    const m = months[0];
    const cols = 7;
    const cellW = gridW / cols;
    const cellH = 100 * scale;

    m.days.forEach((d, i) => {
      const col = (d.dayOfWeek) % 7;
      const row = Math.floor(i / 7);
      const cx = startX + col * cellW + cellW / 2;
      const cy = startY + row * cellH + cellH / 2;

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(startX + col * cellW + 4, startY + row * cellH + 4, cellW - 8, cellH - 8);

      ctx.fillStyle = config.customColors.text || theme.palette.text;
      ctx.font = `${Math.round(14 * scale)}px "JetBrains Mono", monospace`;
      ctx.fillText(`${d.day}`, cx, cy - 20 * scale);

      // Simple moon draw on canvas
      drawCanvasMoon(ctx, cx, cy + 5 * scale, 18 * scale, d.phase, config.customColors.moon || theme.palette.moonLit);
    });
  } else {
    // 12 Months Bento Grid
    const cols = 4;
    const rows = 3;
    const cardW = gridW / cols;
    const cardH = (h - startY - 80 * scale) / rows;

    months.forEach((m, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * cardW;
      const y = startY + row * cardH;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(x + 6 * scale, y + 6 * scale, cardW - 12 * scale, cardH - 12 * scale);

      ctx.strokeStyle = theme.palette.border;
      ctx.lineWidth = 1 * scale;
      ctx.strokeRect(x + 6 * scale, y + 6 * scale, cardW - 12 * scale, cardH - 12 * scale);

      ctx.fillStyle = config.customColors.text || theme.palette.text;
      ctx.font = `bold ${Math.round(16 * scale)}px "Space Grotesk", sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(m.name.toUpperCase(), x + 18 * scale, y + 32 * scale);

      // Draw key phases
      const pY = y + cardH / 2;
      const spacing = (cardW - 40 * scale) / 5;
      [0, 2, 4, 6].forEach((p, pIdx) => {
        drawCanvasMoon(ctx, x + 25 * scale + spacing * (pIdx + 1), pY, 14 * scale, p, config.customColors.moon || theme.palette.moonLit);
      });
    });
  }
}

// Direct canvas moon draw
function drawCanvasMoon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, phase: number, color: string) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#18181b';
  ctx.fill();

  if (phase === 4) {
    ctx.fillStyle = color;
    ctx.fill();
  } else if (phase === 2) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  } else if (phase === 6) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  } else if (phase > 0 && phase < 4) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  } else if (phase > 4) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();
}

// Generate pure vector SVG file for infinite lossless scaling
function generateVectorCalendarSVG(w: number, h: number, config: CanvaConfig, months: any[], theme: any): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${config.customColors.bg || theme.palette.bg}" />
  <text x="${w / 2}" y="100" fill="${config.customColors.text || theme.palette.text}" font-size="42" font-family="sans-serif" font-weight="bold" text-anchor="middle">
    ${config.title}
  </text>
  <text x="${w / 2}" y="145" fill="${config.customColors.accent || theme.palette.accent}" font-size="18" font-family="monospace" text-anchor="middle">
    ${config.subtitle}
  </text>
  <text x="${w / 2}" y="${h - 40}" fill="${theme.palette.muted}" font-size="14" font-family="monospace" text-anchor="middle">
    TIMEDRIFT OBSIDIAN • PURE VECTOR LUNAR CHRONOMETER • CICLO SINÓDICO 29.53d
  </text>
</svg>`;
}

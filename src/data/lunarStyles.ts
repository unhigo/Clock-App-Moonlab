import { LunarStyleTheme, LunarStyleId } from '../types';

export const LUNAR_STYLES: Record<LunarStyleId, LunarStyleTheme> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidiana Profunda',
    tagline: 'The Obsidian Watch • Misterio y Alta Relojería',
    description: 'Estética insigne de Timedrift: fondo negro absoluto, detalles en acero bruñido, silueta de corcel celestial y dial de astrolabio con acento esmeralda sutil.',
    palette: {
      bg: '#000000',
      card: '#0c0c0c',
      text: '#ffffff',
      muted: '#8E8E93',
      accent: '#10b981',
      moonLit: '#f4f4f5',
      moonShadow: '#18181b',
      border: 'rgba(255, 255, 255, 0.12)',
      gridLines: 'rgba(255, 255, 255, 0.07)'
    },
    typography: {
      headingFont: 'var(--font-display, "Space Grotesk", sans-serif)',
      bodyFont: 'var(--font-sans, "Inter", sans-serif)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.15em'
    },
    moonIconVariant: 'astronomical'
  },
  editorial: {
    id: 'editorial',
    name: 'Editorial Minimalista',
    tagline: 'Pureza Suiza • Tipografía de Alta Edición',
    description: 'Blanco y negro absoluto, líneas microscópicas de 0.5px, proporciones matemáticas perfectas y tipografía editorial elegante sin elementos superfluos.',
    palette: {
      bg: '#080808',
      card: '#111111',
      text: '#fafafa',
      muted: '#71717a',
      accent: '#ffffff',
      moonLit: '#ffffff',
      moonShadow: '#1f1f23',
      border: 'rgba(255, 255, 255, 0.18)',
      gridLines: 'rgba(255, 255, 255, 0.09)'
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'var(--font-sans, "Inter", sans-serif)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.22em'
    },
    moonIconVariant: 'minimal-vector'
  },
  spiritual: {
    id: 'spiritual',
    name: 'Espiritual Místico',
    tagline: 'Astrología Sagrada • Glifos y Energía Cósmica',
    description: 'Atmósfera mística inspirada en las fases de la luna y sus ciclos sagrados, veladuras amatista profundo, constelaciones y runas celestes.',
    palette: {
      bg: '#090514',
      card: '#130c25',
      text: '#f3e8ff',
      muted: '#a855f7',
      accent: '#c084fc',
      moonLit: '#f5d0fe',
      moonShadow: '#2e1065',
      border: 'rgba(192, 132, 252, 0.22)',
      gridLines: 'rgba(192, 132, 252, 0.1)'
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'var(--font-sans, "Inter", sans-serif)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.18em'
    },
    moonIconVariant: 'glow'
  },
  scientific: {
    id: 'scientific',
    name: 'Científico Astronómico',
    tagline: 'Cartografía Orbital • Coordenadas y Efemérides',
    description: 'Cuadrícula técnica basada en telescopios y cartas de navegación de la NASA. Datos exactos de iluminación angular, edad sinódica en decimales y marcas de mira telescópica.',
    palette: {
      bg: '#040b0f',
      card: '#081720',
      text: '#e0f2fe',
      muted: '#38bdf8',
      accent: '#0284c7',
      moonLit: '#38bdf8',
      moonShadow: '#082f49',
      border: 'rgba(56, 189, 248, 0.25)',
      gridLines: 'rgba(56, 189, 248, 0.12)'
    },
    typography: {
      headingFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      bodyFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.12em'
    },
    moonIconVariant: 'astronomical'
  },
  modern_dark: {
    id: 'modern_dark',
    name: 'Moderno Oscuro',
    tagline: 'Titanio & Carbón • Minimalismo Contemporáneo',
    description: 'Luminancia equilibrada en escala de grises para desarrolladores y creativos nocturnos. Contraste óptico optimizado para lectura rápida y descanso visual.',
    palette: {
      bg: '#0f0f11',
      card: '#18181b',
      text: '#f4f4f5',
      muted: '#a1a1aa',
      accent: '#e4e4e7',
      moonLit: '#ffffff',
      moonShadow: '#27272a',
      border: 'rgba(255, 255, 255, 0.1)',
      gridLines: 'rgba(255, 255, 255, 0.05)'
    },
    typography: {
      headingFont: 'var(--font-sans, "Inter", sans-serif)',
      bodyFont: 'var(--font-sans, "Inter", sans-serif)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.08em'
    },
    moonIconVariant: 'minimal-vector'
  },
  vintage: {
    id: 'vintage',
    name: 'Lunar Vintage',
    tagline: 'Grabado Siglo XVII • Alquimia y Pergamino',
    description: 'Reminiscencia de los atlas de Hevelius y Galileo. Textura de pergamino añejo sobre fondo sepia de carbón oscuro, con trazos finos de xilografía.',
    palette: {
      bg: '#120f0d',
      card: '#1d1916',
      text: '#f5e6d3',
      muted: '#c4a482',
      accent: '#d97706',
      moonLit: '#fef3c7',
      moonShadow: '#292019',
      border: 'rgba(217, 119, 6, 0.22)',
      gridLines: 'rgba(217, 119, 6, 0.09)'
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'serif',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.16em'
    },
    moonIconVariant: 'engraved'
  },
  retro: {
    id: 'retro',
    name: 'Retro 80s Synth',
    tagline: 'Cyber Synthwave • Neón Ámbar y Fósforo',
    description: 'Inspirado en pantallas de fósforo ámbar y terminales de observatorio de los años ochenta. Resplandor retro y números segmentados.',
    palette: {
      bg: '#0f0a05',
      card: '#1c1308',
      text: '#fbbf24',
      muted: '#d97706',
      accent: '#f59e0b',
      moonLit: '#fde68a',
      moonShadow: '#451a03',
      border: 'rgba(245, 158, 11, 0.3)',
      gridLines: 'rgba(245, 158, 11, 0.12)'
    },
    typography: {
      headingFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      bodyFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.15em'
    },
    moonIconVariant: 'geometric'
  },
  cyber: {
    id: 'cyber',
    name: 'Neón Ciber',
    tagline: 'Instrumental HUD • Fósforo Cian y Esmeralda',
    description: 'Look de interfaz de nave espacial y telemetría interestelar, acentos en cian ultra brillante con sombras profundas.',
    palette: {
      bg: '#03080a',
      card: '#081419',
      text: '#67e8f9',
      muted: '#22d3ee',
      accent: '#06b6d4',
      moonLit: '#a5f3fc',
      moonShadow: '#0e303c',
      border: 'rgba(6, 182, 212, 0.3)',
      gridLines: 'rgba(6, 182, 212, 0.12)'
    },
    typography: {
      headingFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      bodyFont: 'var(--font-sans, "Inter", sans-serif)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.14em'
    },
    moonIconVariant: 'glow'
  },
  gold_alchemy: {
    id: 'gold_alchemy',
    name: 'Alquimia Dorada',
    tagline: 'Oro Real • Proporción Áurea y Lujo Místico',
    description: 'Elegancia refinada con destellos de oro viejo metálico (#D4AF37), círculos de geometría hermética y contrastes de lujo sobre negro caviar.',
    palette: {
      bg: '#080806',
      card: '#14130f',
      text: '#fef08a',
      muted: '#ca8a04',
      accent: '#eab308',
      moonLit: '#fef9c3',
      moonShadow: '#2d2814',
      border: 'rgba(234, 179, 8, 0.25)',
      gridLines: 'rgba(234, 179, 8, 0.1)'
    },
    typography: {
      headingFont: 'serif',
      bodyFont: 'var(--font-sans, "Inter", sans-serif)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.2em'
    },
    moonIconVariant: 'geometric'
  },
  nordic: {
    id: 'nordic',
    name: 'Mármol Nórdico',
    tagline: 'Minimalismo Escandinavo • Serenidad Polar',
    description: 'Quietud ártica en tonos granito y nieve. Claridad cristalina, espacios negativos reconfortantes y máxima legibilidad zen.',
    palette: {
      bg: '#0c0e10',
      card: '#16191d',
      text: '#f1f5f9',
      muted: '#94a3b8',
      accent: '#cbd5e1',
      moonLit: '#f8fafc',
      moonShadow: '#334155',
      border: 'rgba(203, 213, 225, 0.15)',
      gridLines: 'rgba(203, 213, 225, 0.06)'
    },
    typography: {
      headingFont: 'var(--font-sans, "Inter", sans-serif)',
      bodyFont: 'var(--font-sans, "Inter", sans-serif)',
      monoFont: 'var(--font-mono, "JetBrains Mono", monospace)',
      tracking: '0.1em'
    },
    moonIconVariant: 'minimal-vector'
  }
};

export const LUNAR_STYLE_LIST = Object.values(LUNAR_STYLES);

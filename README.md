# Time Studio · Calendario Lunar & Simulador de Mareas 3D

Una aplicación técnica, minimalista y visualmente refinada para la exploración del tiempo astronómico, generación personalizada de calendarios lunares y simulación tridimensional en tiempo real de las fuerzas gravitatorias y mareas oceánicas.

---

## 🌓 Características Principales

### 1. Motor de Cálculo Lunar Astronómico
- **Ciclo Sinódico Preciso**: Algoritmo matemático basado en la duración media del ciclo sinódico (29,53058867 días) con época de referencia UTC.
- **Soporte Temporal Continuo**: Rango de cálculo desde 2026 hasta el infinito.
- **8 Fases Lunares Principales**:
  - 🌑 Luna Nueva (*New Moon*)
  - 🌒 Creciente Cóncava (*Waxing Crescent*)
  - 🌓 Cuarto Creciente (*First Quarter*)
  - 🌔 Gibosa Creciente (*Waxing Gibbous*)
  - 🌕 Luna Llena (*Full Moon*)
  - 🌖 Gibosa Menguante (*Waning Gibbous*)
  - 🌗 Cuarto Menguante (*Last Quarter*)
  - 🌘 Menguante Cóncava (*Waning Crescent*)
- **Datos Diarios Detallados**:
  - Porcentaje exacto de iluminación ($k = \frac{1 - \cos(2\pi \cdot f)}{2}$).
  - Edad de la luna en días (0.0 a 29.53 días).
  - Detección de Superlunas y Microlunas mediante ciclo anomalístico orbital (~27.55 días).
  - Nombres tradicionales de la luna según el mes (Luna del Lobo, de Nieve, de Fresa, de Cosecha, del Cazador, etc.).
  - Tránsito de constelaciones zodiacales lunares.

---

### 2. Generador y Editor de Calendarios Lunares (Editor Gráfico)
- **Vistas y Rangos Flexibles**:
  - Calendario anual completo.
  - Vistas mensuales interactivas.
  - Selector de rangos de fechas personalizados (temporadas, vacaciones, periodos lunares a medida).
- **10 Estilos Visuales de Autor**:
  1. *Editorial Minimalista*: Tipografía limpia en blanco y negro, retícula matemática de alta legibilidad.
  2. *Espiritual Místico*: Fondos celestiales etéreos con detalles dorados y esotéricos.
  3. *Científico Astronómico*: Cuadrícula técnica, datos vectoriales y coordenadas de efemérides.
  4. *Moderno Oscuro (Obsidian)*: Fondos oscuros profundos con detalles en acentos flúor.
  5. *Lunar Vintage*: Ilustraciones clásicas con estética de grabado botánico/astronómico del siglo XIX.
  6. *Retro Cyber*: Tipografía monoespaciada y tonos fósforo ámbar/verde de terminal.
  7. *Neon Sci-Fi*: Gradientes luminiscentes y contrastes de alta intensidad.
  8. *Blueprint Técnico*: Estilo plano cianográfico de ingeniería aeroespacial.
  9. *Pergamino Alquímico*: Texturas cálidas envejecidas con simbología clásica.
  10. *Nordic Ice*: Paleta polar fría en tonos cyan, plata y azul glacial.
- **Personalización de Lienzo**:
  - Formato Horizontal (*Landscape*) y Vertical (*Portrait*).
  - Selector de paletas cromáticas y subida de imágenes de fondo personalizadas.
  - Opciones de visualización: alternar nombres de fases, porcentajes de iluminación y nombres tradicionales.
- **Motor de Exportación Multiformato**:
  - **Formatos**: PDF vectorial, PNG, JPG, SVG y WebP.
  - **Resoluciones**: HD (1080p), 2K (1440p), 4K (UHD) y 8K (Ultra HD).

---

### 3. Simulador 3D de Mareas y Gravitación (Three.js)
- **Escena 3D en Tiempo Real**:
  - Modelo compuesto de la Tierra con texturas de continentes y batimetría marina generadas por código procedural (sin dependencias de archivos externos).
  - Abombamiento oceánico dinámico (*Tidal Bulge*) que representa el elipsoide de deformación de la hidrosfera en función de las posiciones angulares de la Luna y el Sol.
  - Modelo de la Luna con cráteres de eyección (Tycho/Copérnico) y mares basálticos procedurales.
  - Vector de luz solar direccional y representación de vectores de atracción gravitatoria diferencial ($F_{\text{marea}} \propto 1/r^3$).
- **Física de Mareas Vivas y Mareas Muertas**:
  - **Mareas Vivas / Sicigias**: Superposición y amplificación del tirón gravitacional del Sol y la Luna en Luna Nueva (conjunción, 0°) y Luna Llena (oposición, 180°).
  - **Mareas Muertas / Cuadraturas**: Atenuación en ángulo recto en Cuarto Creciente (90°) y Cuarto Menguante (270°).
  - Cálculo del **Coeficiente de Marea SHOM** (escala náutica estándar de 20 a 120).
- **Curva Mareográfica de 24 Horas**:
  - Gráfico interactivo con el nivel de agua instantáneo en metros.
  - Marcadores de Pleamar (▲) y Bajamar (▼) con horarios exactos.
  - Línea de *scrubbing* interactiva para arrastrar o saltar en el tiempo del día.
  - Reproductor con Play / Pausa y velocidad ajustable.
- **Puertos y Cuencas del Mundo**:
  - *Bahía de Fundy* (Canadá · Récord mundial de 16.3 m debido a resonancia hidrodinámica).
  - *Mont-Saint-Michel* (Francia · Hasta 14.2 m en el Canal de la Mancha).
  - *Ría de Vigo* (España · 4.5 m de marea atlántica europea).
  - *Bahía de San Francisco* (EE.UU. · 2.4 m, régimen mixto con pleamares desiguales).
  - *Honolulu* (Hawái · 0.95 m, régimen oceánico pelágico en cuenca abierta).
  - *Barcelona* (España · 0.55 m, cuenca mediterránea micromareal semicerrada).
- **Cámara y Modos de Visualización**:
  - Vista Orbital 3D libre con controles táctiles y ratón.
  - Vista Polo Norte / Eclíptica (alineación astronómica Sol-Tierra-Luna).
  - Vista de Enfoque en el Puerto Costero.
  - Control de exageración del abombamiento oceánico (1.0x a 5.0x).

---

### 4. Cronómetro Timedrift & Herramientas de Tiempo
- **Timedrift Chronometer**: Visualización de precisión técnica con dial interactivo, cronógrafo analógico y selector de temas (*Obsidian*, *Celestial*, *Stealth*, *Solaris*, *Cyber*).
- **Timeline Ruler**: Regla horaria de precisión con saltos de 12h, 24h y 36h.
- **Focus Timer & Pomodoro**: Temporizador de concentración con soporte de paisajes sonoros (*ambient soundscapes*).
- **Gestión de Husos Horarios (Timezones)**: Comparador internacional de horas por ciudades clave.
- **Estadísticas y Registro de Actividad**: Métricas de uso y bloques de tiempo.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador y Servidor**: [Vite 6](https://vitejs.dev/)
- **Gráficos 3D**: [Three.js r160+](https://threejs.org/) (PBR, `RoomEnvironment`, `PMREMGenerator`, `ACESFilmicToneMapping`)
- **Estilos y Diseño**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones e Interacciones**: [Motion](https://motion.dev/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Exportación de Documentos**: [jsPDF](https://github.com/parallax/jsPDF) y Renderizado Canvas HTML5
- **Efectos de Celebración**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── components/            # Componentes reutilizables de UI y navegación
│   │   ├── navigation/        # Sidebar, TopBar, MobileDock, modales
│   │   └── ui/                # Botones, tarjetas, badges, toasts
│   ├── features/              # Módulos y vistas principales
│   │   ├── calendar/          # Generador de calendarios lunares y vista anual/mensual
│   │   ├── clock/             # Cronómetro principal Timedrift y Timeline Ruler
│   │   ├── focus/             # Temporizador de enfoque
│   │   ├── pomodoro/          # Técnica Pomodoro
│   │   ├── music/             # Paisajes sonoros y pistas ambientales
│   │   ├── statistics/        # Métricas y estadísticas
│   │   ├── tides/             # Simulador 3D de mareas y curva mareográfica
│   │   │   ├── ThreeTidesCanvas.tsx    # Escena Three.js con modelos procedurales
│   │   │   ├── proceduralTextures.ts  # Generador procedural de texturas Tierra/Luna
│   │   │   ├── tideCalculations.ts    # Motor de armónicos mareales y física gravitacional
│   │   │   ├── MareographChart.tsx    # Gráfico SVG interactivo de 24 horas
│   │   │   ├── types.ts               # Tipos TypeScript de mareas y puertos
│   │   │   └── TidesSimulatorView.tsx # Vista principal del simulador
│   │   ├── timeline/          # Línea temporal interactiva
│   │   └── timezone/          # Comparador de husos horarios
│   ├── store/                 # Gestión de estado global (useTimeStore)
│   ├── utils/                 # Algoritmos astronómicos y fechas
│   │   ├── lunarEngine.ts     # Motor astronómico de fases lunares y efemérides
│   │   ├── solar.ts           # Cálculo de horas solares y crepúsculos
│   │   └── date.ts            # Utilidades de formateo de fechas
│   ├── App.tsx                # Enrutamiento y contenedor principal
│   ├── main.tsx               # Punto de entrada de la aplicación
│   └── index.css              # Variables CSS y tokens de diseño
├── metadata.json              # Metadatos del applet en AI Studio
├── package.json               # Dependencias y scripts de construcción
└── tsconfig.json              # Configuración de TypeScript
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o pnpm

### Pasos

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación se ejecutará en `http://localhost:3000`.

3. **Verificar tipos y linting**:
   ```bash
   npm run lint
   ```

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 📐 Fundamentos Científicos y Matemáticos

### Fuerza de Marea Diferencial
A diferencia del campo gravitatorio directo ($F \propto 1/r^2$), la fuerza que genera las mareas oceánicas es el **gradiente de gravedad** a lo largo del diámetro terrestre:

$$\vec{F}_{\text{marea}} \propto \frac{G \cdot M \cdot R_{\text{Tierra}}}{r^3}$$

Donde:
- $M$ es la masa del cuerpo celeste (Luna o Sol).
- $r$ es la distancia centro a centro entre la Tierra y el cuerpo celeste.
- Dado que la Luna está ~389 veces más cerca de la Tierra que el Sol, su efecto mareal es aproximadamente **2.17 veces más potente** que el del Sol, representando el Sol un ~46% del total.

### Día Lunar y Ciclo Semidiurno
Debido al movimiento orbital de la Luna alrededor de la Tierra en el mismo sentido que la rotación terrestre, un meridiano tarda **24 horas y 50 minutos** en volver a alinearse con la Luna. Esto origina dos pleamares y dos bajamares separadas por intervalos de aproximadamente **12 horas y 25 minutos**.

---

## 📄 Licencia

Este proyecto es privado y ha sido desarrollado como una herramienta interactiva de exploración astronómica y diseño editorial lunar.

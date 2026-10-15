import * as THREE from 'three';

/**
 * Creates a procedural 1024x512 equirectangular texture for Earth
 * 100% code-generated on an HTML5 canvas (zero external 404s)
 */
export function createProceduralEarthTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Ocean Base with subtle depth gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#061325'); // Arctic deep blue
  oceanGrad.addColorStop(0.25, '#0b1d3a');
  oceanGrad.addColorStop(0.5, '#0d2244'); // Equatorial oceanic blue
  oceanGrad.addColorStop(0.75, '#0b1d3a');
  oceanGrad.addColorStop(1, '#061325'); // Antarctic deep blue
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Continental Shelf / Shallow Bathymetry Glow
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)'; // Cyan shelf
  ctx.lineWidth = 4;

  // 3. Continents Vector Shapes (Simplified geographic silhouettes on equirectangular projection)
  ctx.fillStyle = '#1c2630'; // Slate dark continent landmass
  
  // Helper to project lon [-180, 180] and lat [-90, 90] to canvas [0, width], [height, 0]
  const toX = (lon: number) => ((lon + 180) / 360) * width;
  const toY = (lat: number) => ((90 - lat) / 180) * height;

  const drawPoly = (coords: [number, number][], fill = '#23303d', stroke = '#38bdf8') => {
    if (coords.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(toX(coords[0][0]), toY(coords[0][1]));
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(toX(coords[i][0]), toY(coords[i][1]));
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  };

  // North America
  drawPoly([
    [-168, 65], [-140, 70], [-100, 73], [-80, 62], [-60, 50],
    [-70, 42], [-80, 25], [-95, 18], [-105, 22], [-120, 34],
    [-125, 48], [-140, 58], [-160, 58]
  ], '#263442', 'rgba(56, 189, 248, 0.4)');

  // South America
  drawPoly([
    [-80, 10], [-60, 5], [-35, -5], [-38, -15], [-50, -30],
    [-65, -54], [-75, -50], [-70, -30], [-80, -5], [-80, 10]
  ], '#24323e', 'rgba(56, 189, 248, 0.4)');

  // Eurasia (Europe + Asia)
  drawPoly([
    [-10, 36], [0, 45], [10, 55], [30, 70], [60, 73],
    [100, 76], [140, 72], [170, 66], [140, 50], [120, 32],
    [105, 20], [80, 15], [70, 25], [50, 25], [35, 32],
    [25, 38], [10, 38], [-5, 36]
  ], '#2a3a4a', 'rgba(56, 189, 248, 0.45)');

  // Africa
  drawPoly([
    [-17, 30], [10, 37], [32, 31], [50, 12], [42, -5],
    [32, -28], [20, -35], [12, -20], [8, 4], [-15, 12], [-17, 30]
  ], '#253440', 'rgba(56, 189, 248, 0.4)');

  // Australia
  drawPoly([
    [114, -22], [125, -15], [140, -12], [150, -24],
    [152, -35], [138, -38], [115, -34], [114, -22]
  ], '#2a3845', 'rgba(56, 189, 248, 0.4)');

  // Antarctica
  drawPoly([
    [-180, -70], [-120, -74], [-60, -65], [0, -70],
    [60, -66], [120, -68], [180, -70], [180, -90], [-180, -90]
  ], '#dbeafe', 'rgba(255, 255, 255, 0.7)');

  // Greenland
  drawPoly([
    [-55, 60], [-25, 65], [-20, 80], [-50, 83], [-55, 60]
  ], '#c7d2fe', 'rgba(255, 255, 255, 0.6)');

  // 4. Subtle Latitude / Longitude Coordinate Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  // Parallels (every 30 deg)
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = toY(lat);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  // Meridians (every 45 deg)
  for (let lon = -180; lon <= 180; lon += 45) {
    const x = toX(lon);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // 5. Equator highlight (yellowish subtle dashed line)
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(0, toY(0));
  ctx.lineTo(width, toY(0));
  ctx.stroke();
  ctx.setLineDash([]);

  // 6. Subtle atmospheric swirl noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  for (let i = 0; i < 40; i++) {
    const cx = (Math.sin(i * 3.7) * 0.5 + 0.5) * width;
    const cy = (Math.cos(i * 2.1) * 0.4 + 0.5) * height;
    const rad = 20 + (i % 5) * 15;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates a procedural 1024x512 texture for the Moon
 * Including lunar maria (dark volcanic plains) and impact crater rays
 */
export function createProceduralMoonTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Lunar regolith highland base
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#5f6469');
  bgGrad.addColorStop(0.5, '#757c82');
  bgGrad.addColorStop(1, '#5f6469');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. High-frequency noise for surface roughness
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 28;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Lunar Maria (Dark Basaltic Plains)
  // Oceanus Procellarum, Mare Imbrium, Mare Serenitatis, Mare Tranquillitatis
  const maria: Array<{ x: number; y: number; rx: number; ry: number; rot: number; color: string }> = [
    { x: 340, y: 190, rx: 110, ry: 90, rot: 0.2, color: 'rgba(38, 42, 46, 0.75)' }, // Oceanus Procellarum
    { x: 420, y: 160, rx: 70, ry: 60, rot: -0.1, color: 'rgba(32, 36, 40, 0.78)' }, // Mare Imbrium
    { x: 520, y: 175, rx: 55, ry: 45, rot: 0.3, color: 'rgba(35, 38, 42, 0.7)' }, // Mare Serenitatis
    { x: 560, y: 220, rx: 50, ry: 40, rot: -0.2, color: 'rgba(33, 36, 40, 0.72)' }, // Mare Tranquillitatis
    { x: 610, y: 240, rx: 40, ry: 35, rot: 0.1, color: 'rgba(36, 40, 44, 0.65)' }, // Mare Fecunditatis
    { x: 490, y: 260, rx: 45, ry: 35, rot: 0.4, color: 'rgba(34, 38, 42, 0.68)' }, // Mare Nubium
    { x: 590, y: 155, rx: 35, ry: 30, rot: 0, color: 'rgba(30, 33, 37, 0.75)' } // Mare Crisium
  ];

  maria.forEach((m) => {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, m.rx, m.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = m.color;
    ctx.fill();
    ctx.restore();
  });

  // 4. Prominent Craters and Ejecta Rays (Tycho, Copernicus, Kepler)
  const drawCrater = (x: number, y: number, r: number, withRays = false) => {
    if (withRays) {
      // Ejecta rays
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 1;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        const rayLen = r * (4 + (a * 10) % 5);
        ctx.lineTo(x + Math.cos(a) * rayLen, y + Math.sin(a) * rayLen);
        ctx.stroke();
      }
    }

    // Crater Rim (bright)
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = Math.max(1, r * 0.25);
    ctx.stroke();

    // Crater Floor (shadowed)
    ctx.beginPath();
    ctx.arc(x + r * 0.15, y + r * 0.15, r * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 22, 25, 0.8)';
    ctx.fill();

    // Central Peak
    if (r > 6) {
      ctx.beginPath();
      ctx.arc(x, y, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240, 240, 245, 0.85)';
      ctx.fill();
    }
  };

  // Tycho (Southern Crater with magnificent rays)
  drawCrater(470, 360, 16, true);
  // Copernicus (Bright rayed crater in Oceanus Procellarum)
  drawCrater(390, 210, 14, true);
  // Kepler
  drawCrater(330, 215, 9, true);
  // Aristarchus (Brightest feature on the Moon)
  drawCrater(310, 170, 8, true);

  // Miscellaneous smaller craters across highlands
  for (let i = 0; i < 70; i++) {
    const rx = ((i * 137.5) % width);
    const ry = ((i * 83.1) % height);
    const rad = 2 + (i % 6);
    drawCrater(rx, ry, rad, false);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

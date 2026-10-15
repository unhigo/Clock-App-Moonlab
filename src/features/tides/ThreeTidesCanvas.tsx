import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { TideLocation, CameraViewMode } from './types';
import { createProceduralEarthTexture, createProceduralMoonTexture } from './proceduralTextures';

interface ThreeTidesCanvasProps {
  currentHour: number; // 0 to 24
  moonAngleRad: number; // angle of moon relative to sun (0 = new moon, PI = full moon)
  location: TideLocation;
  bulgeExaggeration: number; // 1.0 to 5.0
  showGravitationalVectors: boolean;
  showTidalBulge: boolean;
  showOrbitPath: boolean;
  cameraMode: CameraViewMode;
  isPlaying: boolean;
  onHourChange?: (newHour: number) => void;
}

// Pre-allocated scratch objects for zero GC in the render loop
const _vecEarthToMoon = new THREE.Vector3();
const _vecSunDir = new THREE.Vector3(1, 0, 0); // Sun is at +X
const _tempVec = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();
const _tempMatrix = new THREE.Matrix4();

export const ThreeTidesCanvas: React.FC<ThreeTidesCanvasProps> = ({
  currentHour,
  moonAngleRad,
  location,
  bulgeExaggeration,
  showGravitationalVectors,
  showTidalBulge,
  showOrbitPath,
  cameraMode,
  isPlaying,
  onHourChange
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Mutable refs to pass into the continuous animation loop without tearing down the WebGL context
  const propsRef = useRef({
    currentHour,
    moonAngleRad,
    location,
    bulgeExaggeration,
    showGravitationalVectors,
    showTidalBulge,
    showOrbitPath,
    cameraMode,
    isPlaying
  });

  useEffect(() => {
    propsRef.current = {
      currentHour,
      moonAngleRad,
      location,
      bulgeExaggeration,
      showGravitationalVectors,
      showTidalBulge,
      showOrbitPath,
      cameraMode,
      isPlaying
    };
  }, [
    currentHour,
    moonAngleRad,
    location,
    bulgeExaggeration,
    showGravitationalVectors,
    showTidalBulge,
    showOrbitPath,
    cameraMode,
    isPlaying
  ]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070a);
    scene.fog = new THREE.FogExp2(0x05070a, 0.012);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 16, 26);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Studio PBR Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const studioEnv = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = studioEnv.texture;

    // 3. Lighting Rig (Key Sunlight + Cool Hemisphere Fill)
    // Sunlight: directional light positioned far on +X
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(40, 2, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Hemisphere light representing deep cosmic fill
    const hemiLight = new THREE.HemisphereLight(0x1e293b, 0x070b12, 0.55);
    scene.add(hemiLight);

    // 4. Starfield Background (Zero external asset, procedural instanced points)
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const radius = 90 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 1.4,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. Sun Indicator in Distance
    const sunGroup = new THREE.Group();
    sunGroup.position.set(45, 0, 0);
    // Sun disc
    const sunDiscGeo = new THREE.CircleGeometry(4.5, 32);
    const sunDiscMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      side: THREE.DoubleSide
    });
    const sunDisc = new THREE.Mesh(sunDiscGeo, sunDiscMat);
    sunDisc.rotation.y = -Math.PI / 2;
    sunGroup.add(sunDisc);

    // Sun outer corona ring
    const sunCoronaGeo = new THREE.RingGeometry(4.6, 6.2, 32);
    const sunCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    const sunCorona = new THREE.Mesh(sunCoronaGeo, sunCoronaMat);
    sunCorona.rotation.y = -Math.PI / 2;
    sunGroup.add(sunCorona);
    scene.add(sunGroup);

    // 6. Earth Assembly (Composite 6-part procedural group)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 6.1 Solid Earth Sphere
    const earthRadius = 4.0;
    const earthTexture = createProceduralEarthTexture();
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.7,
      metalness: 0.15
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;
    earthGroup.add(earthMesh);

    // 6.2 Dynamic Oceanic Tidal Bulge Shell
    // Prolate ellipsoid representing ocean deformation under tidal forces
    const bulgeGeo = new THREE.SphereGeometry(earthRadius * 1.018, 64, 48);
    const bulgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, // Cyan oceanic
      transmission: 0.42,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1
    });
    const bulgeMesh = new THREE.Mesh(bulgeGeo, bulgeMat);
    bulgeMesh.renderOrder = 2;
    earthGroup.add(bulgeMesh);

    // 6.3 Atmosphere Fresnel Shell
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.045, 48, 36);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      depthWrite: false
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosMesh);

    // 6.4 Polar Axis Line & Caps (Earth's 23.5° obliquity tilt)
    earthGroup.rotation.z = (23.44 * Math.PI) / 180;

    const axisGeo = new THREE.CylinderGeometry(0.04, 0.04, earthRadius * 2.6, 16);
    const axisMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.8,
      roughness: 0.2
    });
    const axisMesh = new THREE.Mesh(axisGeo, axisMat);
    earthGroup.add(axisMesh);

    // Polar caps (brass tips)
    const tipGeo = new THREE.ConeGeometry(0.12, 0.4, 16);
    const tipNorth = new THREE.Mesh(tipGeo, axisMat);
    tipNorth.position.y = earthRadius * 1.3;
    earthGroup.add(tipNorth);

    const tipSouth = new THREE.Mesh(tipGeo, axisMat);
    tipSouth.position.y = -earthRadius * 1.3;
    tipSouth.rotation.x = Math.PI;
    earthGroup.add(tipSouth);

    // 6.5 Coastal Observation Beacon / Pin (Placed at location's lat/lon)
    const pinGroup = new THREE.Group();
    // Base contact disc
    const pinBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16);
    const pinBaseMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.6, roughness: 0.3 });
    const pinBase = new THREE.Mesh(pinBaseGeo, pinBaseMat);
    pinGroup.add(pinBase);
    // Pin post
    const pinPostGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12);
    const pinPostMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 });
    const pinPost = new THREE.Mesh(pinPostGeo, pinPostMat);
    pinPost.position.y = 0.25;
    pinGroup.add(pinPost);
    // Glowing beacon bead
    const pinBeadGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pinBeadMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const pinBead = new THREE.Mesh(pinBeadGeo, pinBeadMat);
    pinBead.position.y = 0.55;
    pinGroup.add(pinBead);
    
    // We add the pin to earthMesh so it rotates synchronously with Earth's diurnal spin
    earthMesh.add(pinGroup);

    // 7. Moon Assembly (Composite 4-part procedural group)
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonOrbitRadius = 17.5;
    const moonRadius = 1.15;
    const moonTexture = createProceduralMoonTexture();
    moonTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 7.1 Moon Core Sphere
    const moonGeo = new THREE.SphereGeometry(moonRadius, 48, 36);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.9,
      metalness: 0.08
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    moonGroup.add(moonMesh);

    // 7.2 Sub-lunar gravitational cone pointing toward Earth
    const gravConeGeo = new THREE.ConeGeometry(0.5, 2.2, 16, 1, true);
    const gravConeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const gravCone = new THREE.Mesh(gravConeGeo, gravConeMat);
    gravCone.position.set(0, 0, 0);
    gravCone.rotation.z = Math.PI / 2;
    moonGroup.add(gravCone);

    // 7.3 Lunar Orbit Ring
    const orbitRingGeo = new THREE.RingGeometry(moonOrbitRadius - 0.05, moonOrbitRadius + 0.05, 128);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x475569,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);

    // 8. Gravitational Force Vectors (Cylinders + Cones)
    const vectorsGroup = new THREE.Group();
    scene.add(vectorsGroup);

    // Lunar pull arrow from Earth center toward Moon
    const lunarArrowGroup = new THREE.Group();
    const lunarShaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.0, 12);
    const lunarArrowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // Cyan
    const lunarShaft = new THREE.Mesh(lunarShaftGeo, lunarArrowMat);
    lunarShaft.position.y = 2.0;
    lunarArrowGroup.add(lunarShaft);
    const lunarHeadGeo = new THREE.ConeGeometry(0.24, 0.7, 16);
    const lunarHead = new THREE.Mesh(lunarHeadGeo, lunarArrowMat);
    lunarHead.position.y = 4.35;
    lunarArrowGroup.add(lunarHead);
    vectorsGroup.add(lunarArrowGroup);

    // Solar pull arrow from Earth center toward Sun (+X)
    const solarArrowGroup = new THREE.Group();
    const solarShaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 12); // ~46% of lunar magnitude
    const solarArrowMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Amber
    const solarShaft = new THREE.Mesh(solarShaftGeo, solarArrowMat);
    solarShaft.position.y = 1.1;
    solarArrowGroup.add(solarShaft);
    const solarHeadGeo = new THREE.ConeGeometry(0.24, 0.7, 16);
    const solarHead = new THREE.Mesh(solarHeadGeo, solarArrowMat);
    solarHead.position.y = 2.55;
    solarArrowGroup.add(solarHead);
    solarArrowGroup.rotation.z = -Math.PI / 2; // Points toward +X (Sun)
    vectorsGroup.add(solarArrowGroup);

    // 9. Camera Orbit Controls (Pointer Dragging & Wheel Zooming with Damping)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = {
      radius: 28,
      theta: 0.8, // azimuth
      phi: 1.15 // elevation
    };
    let targetSpherical = { ...spherical };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetSpherical.theta -= deltaX * 0.007;
      targetSpherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, targetSpherical.phi - deltaY * 0.007));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetSpherical.radius = Math.max(9, Math.min(65, targetSpherical.radius + e.deltaY * 0.03));
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop (Lossless 60fps with Exponential Damping)
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const {
        currentHour: curH,
        moonAngleRad: curMoonAngle,
        location: curLoc,
        bulgeExaggeration: bulgeEx,
        showGravitationalVectors: showVec,
        showTidalBulge: showBulge,
        showOrbitPath: showOrbit,
        cameraMode: camMode,
        isPlaying: playing
      } = propsRef.current;

      // Time progression if playing
      if (playing && onHourChange) {
        const hourStep = dt * 1.5; // ~1 hour per 0.67s real time
        const nextH = (curH + hourStep) % 24;
        onHourChange(nextH);
      }

      // Position Moon on orbital circle
      // Sun is at +X (angle = 0).
      // Moon angle relative to Sun: curMoonAngle
      const moonX = Math.cos(curMoonAngle) * moonOrbitRadius;
      const moonZ = Math.sin(curMoonAngle) * moonOrbitRadius;
      moonGroup.position.set(moonX, 0, moonZ);

      // Orient gravCone to point back to Earth
      _vecEarthToMoon.set(moonX, 0, moonZ).normalize();
      gravCone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _vecEarthToMoon.clone().negate());

      // Diurnal spin of Earth: 24 hours = 360 degrees rotation
      // Standard rotation on Y axis of Earth
      const earthSpinAngle = (curH / 24) * Math.PI * 2;
      earthMesh.rotation.y = earthSpinAngle;

      // Position Coastal Observation Pin on Earth surface
      // Spherical coordinates from lat and lon
      const latRad = (curLoc.lat * Math.PI) / 180;
      const lonRad = (curLoc.lon * Math.PI) / 180;
      const pR = earthRadius + 0.02;
      const px = pR * Math.cos(latRad) * Math.sin(lonRad);
      const py = pR * Math.sin(latRad);
      const pz = pR * Math.cos(latRad) * Math.cos(lonRad);
      pinGroup.position.set(px, py, pz);
      // Orient pin normal to Earth's surface
      _tempVec.set(px, py, pz).normalize();
      pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _tempVec);

      // Tidal Bulge Ellipsoid Deformation & Alignment
      // The lunar tide pull aligns with the Earth-Moon axis.
      // The solar tide pull aligns with the Earth-Sun axis (+X).
      // Resultant tidal axis angle in the equatorial/ecliptic plane:
      // Vector sum: F_lunar * [cos(theta_M), sin(theta_M)] + F_solar * [1, 0]
      const fLunar = 1.0;
      const fSolar = 0.46; // ~46% of lunar tidal force
      const resX = fLunar * Math.cos(curMoonAngle) + fSolar;
      const resZ = fLunar * Math.sin(curMoonAngle);
      const tidalAxisAngle = Math.atan2(resZ, resX);
      const tidalMagnitude = Math.sqrt(resX * resX + resZ * resZ) / (fLunar + fSolar);

      // Scale dynamic bulge prolate ellipsoid
      // Prolate elongation along tidal axis, slight constriction perpendicular
      const baseElongation = 0.08 * (bulgeEx || 2.0) * tidalMagnitude;
      bulgeMesh.visible = showBulge;
      if (showBulge) {
        bulgeMesh.scale.set(
          1 + baseElongation,
          1 - baseElongation * 0.45,
          1 - baseElongation * 0.45
        );
        bulgeMesh.rotation.y = tidalAxisAngle;
      }

      // Gravitational Vectors
      vectorsGroup.visible = showVec;
      if (showVec) {
        // Lunar arrow points toward Moon
        lunarArrowGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), _vecEarthToMoon);
      }

      // Orbit path visibility
      orbitRing.visible = showOrbit;

      // Camera preset positioning with silky-smooth exponential damping
      const dampingFactor = 1 - Math.exp(-6 * dt);
      if (camMode === 'top') {
        // Top-down north pole view (ecliptic alignment)
        targetSpherical.phi = 0.05;
        targetSpherical.radius = 34;
      } else if (camMode === 'coastal') {
        // Close-up on the Earth's rotating coastal pin
        targetSpherical.radius = 11;
        targetSpherical.phi = 1.1;
      }

      spherical.radius += (targetSpherical.radius - spherical.radius) * dampingFactor;
      spherical.theta += (targetSpherical.theta - spherical.theta) * dampingFactor;
      spherical.phi += (targetSpherical.phi - spherical.phi) * dampingFactor;

      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);

      // Dispose Three.js resources
      pmremGenerator.dispose();
      studioEnv.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      bulgeGeo.dispose();
      bulgeMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      moonTexture.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'none' }}
    />
  );
};

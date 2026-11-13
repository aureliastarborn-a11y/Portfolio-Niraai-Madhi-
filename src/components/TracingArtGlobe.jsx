import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// 3D Miniature Art Frames Sphere (1,850+ vibrant multi-colored framed artworks)
// - Completely reactive movement driven by CURSOR and SCROLL:
//   * Cursor Tracking: Sphere actively angles and rotates following mouse/pointer position
//   * Cursor Kinetic Impulse: Fast cursor swishes add fluid rotational momentum
//   * Interactive 3D Drag: Direct click/touch drag with inertial damping in all directions
//   * Scroll Scrub Rotation: Scrolling actively drives dual-axis 3D spin (both X and Y)
//   * Scroll Bloom & Scatter: Sphere blooms open from compact core when entering,
//     forms a hollow sphere when centered, and scatters wide across widescreen when scrolling past
//   * Harmonic Breathing: Each frame gently breathes in scale at unique frequencies (bysanthosh.me)
//   * Per-element organic wobble: Micro-rotation drift on each frame
// - 10 vibrant color spectrums: sapphire blue, emerald green, ruby red, sunset orange,
//   amethyst violet, turquoise cyan, magenta, golden champagne, terracotta & ebony
// - Ambient floating wireframe background rectangles with mouse parallax

const ATLAS_URL = '/images/art-frames-atlas.png';
const ATLAS_COLS = 10;
const ATLAS_ROWS = 10;
const TOTAL_FRAMES = 1850;

export default function TracingArtGlobe() {
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  const stateRef = useRef({
    // Mouse / Cursor Tracking
    cursorTargetX: 0,
    cursorTargetY: 0,
    cursorCurX: 0,
    cursorCurY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    cursorVelX: 0,
    cursorVelY: 0,
    kineticRotY: 0,
    kineticRotX: 0,

    // Drag interaction
    isDown: false,
    prevX: 0,
    prevY: 0,
    dragRotY: 0,
    dragRotX: 0,
    dragVelY: 0,
    dragVelX: 0,

    // Scroll progress (0 = entering, 0.5 = centered, 1.0 = leaving)
    targetScrollProgress: 0.5,
    scrollProgress: 0.5,
    scrollVelocity: 0,
    lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
  });

  // Generate 1,850+ miniature artwork frames randomly distributed on a hollow 3D sphere shell
  const framesData = useMemo(() => {
    const items = [];
    const BASE_RADIUS = 2.75;
    const SHELL_THICKNESS = 0.80; // Hollow shell depth (2.35 to 3.15)

    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      // 1. Uniform isotropic distribution on sphere shell (independent of any axis)
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const r_xy = Math.sqrt(Math.max(0, 1 - u * u));

      const nx = r_xy * Math.cos(theta);
      const ny = u;
      const nz = r_xy * Math.sin(theta);

      // 2. Hollow sphere shell volume
      const radius = (BASE_RADIUS - SHELL_THICKNESS * 0.5) + random() * SHELL_THICKNESS;
      const restPos = new THREE.Vector3(nx * radius, ny * radius, nz * radius);

      // Contracted core position for scroll bloom (starts at 22% of radius, like bysanthosh.me)
      const corePos = restPos.clone().multiplyScalar(0.22);

      // 3. Atlas index (100 vibrant colorful varieties across 10x10 grid)
      const atlasIdx = i % (ATLAS_COLS * ATLAS_ROWS);
      const col = atlasIdx % ATLAS_COLS;
      const row = Math.floor(atlasIdx / ATLAS_COLS);

      // 4. Individual frame size variation
      let size = 0.18 + random() * 0.06;
      if (i % 23 === 0) size *= 1.30; // Accent feature frame
      if (i % 7 === 0) size *= 0.84;  // Delicate gem frame

      // 5. Per-element movement dynamics (matching bysanthosh.me)
      const scaleFreq = 0.7 + random() * 0.9;
      const phase = random() * Math.PI * 2;
      const rotSpeedX = (random() - 0.5) * 0.15;
      const rotSpeedY = (random() - 0.5) * 0.15;
      const rotSpeedZ = (random() - 0.5) * 0.15;

      // Radial stagger delay for bloom (frames closer to center bloom slightly earlier)
      const radialDelay = (restPos.length() / (BASE_RADIUS + SHELL_THICKNESS * 0.5)) * 0.15;

      // Natural hanging tilt
      const tiltRoll = (random() - 0.5) * 0.22; // +- 6.5 degrees
      const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), tiltRoll);

      // Widescreen scatter vector
      const scatterDist = 3.8 + random() * 3.2;
      const lateralSpread = (random() - 0.5) * 5.6;
      const verticalSpread = (random() - 0.5) * 2.4;
      const scatterDir = new THREE.Vector3(
        nx * scatterDist + lateralSpread,
        ny * scatterDist * 0.75 + verticalSpread,
        nz * scatterDist * 0.5
      );

      const tumbleAxis = new THREE.Vector3(
        random() - 0.5,
        random() - 0.5,
        random() - 0.5
      ).normalize();
      const tumbleSpeed = 1.0 + random() * 1.6;

      // UV coordinates in 1280x1280 atlas (10x10 grid)
      const uScale = 1.0 / ATLAS_COLS;
      const vScale = 1.0 / ATLAS_ROWS;
      const uOffset = col * uScale;
      const vOffset = (ATLAS_ROWS - 1 - row) * vScale;

      items.push({
        id: i,
        restPos,
        corePos,
        radialDelay,
        size,
        scaleFreq,
        phase,
        rotSpeedX,
        rotSpeedY,
        rotSpeedZ,
        tiltQuat,
        scatterDir,
        tumbleAxis,
        tumbleSpeed,
        uv: [uOffset, vOffset, uScale, vScale],
      });
    }

    return items;
  }, []);

  // Scroll listener: continuous scroll scrubbing matching bysanthosh.me
  useEffect(() => {
    stateRef.current.lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - stateRef.current.lastScrollY;
      stateRef.current.lastScrollY = currentY;

      // Track scroll velocity for kinetic pulse
      stateRef.current.scrollVelocity = Math.min(1.5, stateRef.current.scrollVelocity + Math.abs(deltaY) * 0.02);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;

        // Progress across viewport:
        // 0.0 = top of container enters bottom of screen
        // 0.5 = container centered in screen
        // 1.0 = bottom of container leaves top of screen
        const totalTravel = vh + rect.height;
        const currentTravel = vh - rect.top;
        const progress = Math.max(0, Math.min(1, currentTravel / totalTravel));

        stateRef.current.targetScrollProgress = progress;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Three.js 3D Scene Setup & Render Loop
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getViewportSize = () => ({
      width: window.innerWidth,
      height: mount.clientHeight || window.innerHeight * 0.85,
    });

    let { width, height } = getViewportSize();

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 11.0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // 2. Ambient Floating Wireframe Rectangles (Getty background aesthetic)
    const wireframesGroup = new THREE.Group();
    scene.add(wireframesGroup);

    const wireGeo = new THREE.BufferGeometry();
    const wirePositions = new Float32Array([
      -0.5, -0.5, 0,   0.5, -0.5, 0,
       0.5, -0.5, 0,   0.5,  0.5, 0,
       0.5,  0.5, 0,  -0.5,  0.5, 0,
      -0.5,  0.5, 0,  -0.5, -0.5, 0,
    ]);
    wireGeo.setAttribute('position', new THREE.BufferAttribute(wirePositions, 3));

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.07,
    });

    const WIREFRAME_COUNT = 52;
    for (let i = 0; i < WIREFRAME_COUNT; i++) {
      const line = new THREE.LineSegments(wireGeo, wireMat);
      const aspectType = i % 4;
      let ww = 0.6 + (i * 0.035) % 0.8;
      let hh = ww;
      if (aspectType === 1) hh *= 1.35;
      if (aspectType === 2) ww *= 1.45;
      if (aspectType === 3) hh *= 1.6;

      line.scale.set(ww, hh, 1);
      line.position.set(
        ((i * 1.83) % 28) - 14 + (Math.sin(i * 3.7) * 1.2),
        ((i * 1.41) % 15) - 7.5 + (Math.cos(i * 2.3) * 0.8),
        -3.5 - ((i * 0.35) % 4.5)
      );

      line.userData = {
        baseY: line.position.y,
        phase: i * 0.45,
        speed: 0.35 + (i % 5) * 0.15,
        driftAmp: 0.15 + (i % 3) * 0.1,
      };

      wireframesGroup.add(line);
    }

    // 3. Texture Atlas & Custom Multi-Color Material
    const texLoader = new THREE.TextureLoader();
    const atlasTex = texLoader.load(ATLAS_URL);
    atlasTex.generateMipmaps = true;
    atlasTex.minFilter = THREE.LinearMipmapLinearFilter;

    const frameMat = new THREE.MeshBasicMaterial({
      map: atlasTex,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: true,
      side: THREE.DoubleSide,
    });

    frameMat.onBeforeCompile = (shader) => {
      shader.vertexShader = `
        attribute vec4 aInstanceUV;
        varying vec2 vAtlasUv;
        varying float vDepthFactor;
        ${shader.vertexShader}
      `.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>
        vAtlasUv = uv * aInstanceUV.zw + aInstanceUV.xy;
        vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vDepthFactor = clamp((mvPos.z + 13.5) / 5.0, 0.0, 1.0);
        `
      );

      shader.fragmentShader = `
        varying vec2 vAtlasUv;
        varying float vDepthFactor;
        ${shader.fragmentShader}
      `.replace(
        '#include <map_fragment>',
        `
        #ifdef USE_MAP
          vec4 sampledDiffuseColor = texture2D(map, vAtlasUv);
          if (sampledDiffuseColor.a < 0.02) discard;

          // Atmospheric hollow depth: back cards softly muted, front cards crisp and bright
          float depthShade = mix(0.70, 1.05, vDepthFactor);
          sampledDiffuseColor.rgb *= depthShade;

          diffuseColor *= sampledDiffuseColor;
        #endif
        `
      );
    };

    // 4. Instanced 3D Mesh for 1,850+ miniature framed artworks
    const planeGeo = new THREE.PlaneGeometry(1, 1);

    const uvArray = new Float32Array(framesData.length * 4);
    for (let i = 0; i < framesData.length; i++) {
      const uv = framesData[i].uv;
      uvArray[i * 4 + 0] = uv[0];
      uvArray[i * 4 + 1] = uv[1];
      uvArray[i * 4 + 2] = uv[2];
      uvArray[i * 4 + 3] = uv[3];
    }
    planeGeo.setAttribute('aInstanceUV', new THREE.InstancedBufferAttribute(uvArray, 4));

    const instancedMesh = new THREE.InstancedMesh(planeGeo, frameMat, framesData.length);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // 5. Interactive Cursor Movement & Drag Orbit
    const handleMouseMove = (e) => {
      // Normalized cursor coordinates (-1 to 1)
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      // Target cursor tilt angles (sphere dynamically angles towards the cursor)
      stateRef.current.cursorTargetX = normX * 1.35; // Follows mouse horizontally
      stateRef.current.cursorTargetY = -normY * 0.95; // Follows mouse vertically

      // Cursor movement delta
      if (stateRef.current.lastMouseX !== 0) {
        const dx = e.clientX - stateRef.current.lastMouseX;
        const dy = e.clientY - stateRef.current.lastMouseY;
        // Kinetic impulse when cursor swishes fast
        stateRef.current.cursorVelX += dx * 0.0008;
        stateRef.current.cursorVelY += dy * 0.0008;

        if (stateRef.current.isDown) {
          stateRef.current.dragVelY = dx * 0.0045;
          stateRef.current.dragVelX = dy * 0.0045;
          stateRef.current.dragRotY += stateRef.current.dragVelY;
          stateRef.current.dragRotX += stateRef.current.dragVelX;
        }
      }

      stateRef.current.lastMouseX = e.clientX;
      stateRef.current.lastMouseY = e.clientY;
    };

    const handleMouseDown = (e) => {
      stateRef.current.isDown = true;
      stateRef.current.prevX = e.clientX;
      stateRef.current.prevY = e.clientY;
    };

    const handleMouseUp = () => {
      stateRef.current.isDown = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        stateRef.current.isDown = true;
        stateRef.current.prevX = e.touches[0].clientX;
        stateRef.current.prevY = e.touches[0].clientY;
        stateRef.current.lastMouseX = e.touches[0].clientX;
        stateRef.current.lastMouseY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (stateRef.current.isDown && e.touches.length === 1) {
        const dx = e.touches[0].clientX - stateRef.current.prevX;
        const dy = e.touches[0].clientY - stateRef.current.prevY;
        stateRef.current.dragVelY = dx * 0.005;
        stateRef.current.dragVelX = dy * 0.005;
        stateRef.current.dragRotY += stateRef.current.dragVelY;
        stateRef.current.dragRotX += stateRef.current.dragVelX;
        stateRef.current.prevX = e.touches[0].clientX;
        stateRef.current.prevY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      stateRef.current.isDown = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const handleResize = () => {
      const s = getViewportSize();
      camera.aspect = s.width / s.height;
      camera.updateProjectionMatrix();
      renderer.setSize(s.width, s.height);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation & Render Loop with Exact Cursor & Scroll Dynamics
    let animId;
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyScatterVec = new THREE.Vector3();
    const dummyScale = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const wobbleQuat = new THREE.Quaternion();
    const wobbleEuler = new THREE.Euler();
    const tumbleRot = new THREE.Quaternion();
    const forwardVec = new THREE.Vector3();
    const baseForward = new THREE.Vector3(0, 0, 1);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // ── 1. SMOOTH CURSOR TRACKING WITH LERP ──
      stateRef.current.cursorCurX += (stateRef.current.cursorTargetX - stateRef.current.cursorCurX) * 0.08;
      stateRef.current.cursorCurY += (stateRef.current.cursorTargetY - stateRef.current.cursorCurY) * 0.08;

      // Kinetic cursor velocity damping
      stateRef.current.cursorVelX *= 0.92;
      stateRef.current.cursorVelY *= 0.92;
      stateRef.current.kineticRotY += stateRef.current.cursorVelX;
      stateRef.current.kineticRotX += stateRef.current.cursorVelY;

      // Drag inertia damping
      if (!stateRef.current.isDown) {
        stateRef.current.dragVelY *= 0.94;
        stateRef.current.dragVelX *= 0.94;
        stateRef.current.dragRotY += stateRef.current.dragVelY;
        stateRef.current.dragRotX += stateRef.current.dragVelX;
      }

      // ── 2. SMOOTH SCROLL SCRUB PROGRESS (0.0 to 1.0) ──
      stateRef.current.scrollProgress += (stateRef.current.targetScrollProgress - stateRef.current.scrollProgress) * 0.075;
      stateRef.current.scrollVelocity *= 0.90;
      const sp = stateRef.current.scrollProgress;

      // ── 3. COMPUTE WHOLE SPHERE ROTATION ACCORDING TO CURSOR + SCROLL ──
      // Ambient slow drift
      const ambientY = time * 0.12;
      const ambientX = Math.sin(time * 0.08) * 0.06;

      // Scroll directly drives dual-axis spinning (3.5 full turns on Y, 1.2 turns on X):
      const scrollRotY = sp * Math.PI * 3.5;
      const scrollRotX = (sp - 0.5) * Math.PI * 1.2;

      // Total sphere rotation: Ambient + Scroll + Drag + Cursor Tilt + Kinetic Velocity
      const totalRotY = ambientY + scrollRotY + stateRef.current.dragRotY + stateRef.current.cursorCurX + stateRef.current.kineticRotY;
      const totalRotX = ambientX + scrollRotX + stateRef.current.dragRotX + stateRef.current.cursorCurY + stateRef.current.kineticRotX;

      const globeEuler = new THREE.Euler(totalRotX, totalRotY, 0, 'YXZ');
      const globeQuat = new THREE.Quaternion().setFromEuler(globeEuler);

      // Background wireframes react to cursor parallax & ambient drift
      wireframesGroup.children.forEach((line) => {
        const d = line.userData;
        line.position.y = d.baseY + Math.sin(time * d.speed + d.phase) * d.driftAmp;
      });
      wireframesGroup.position.x = -stateRef.current.cursorCurX * 0.6;
      wireframesGroup.position.y = -stateRef.current.cursorCurY * 0.45;

      // ── 4. SCROLL BLOOM & SCATTER STAGES (matching bysanthosh.me) ──
      // Stage A: Bloom expansion from core (sp from 0.0 to 0.45)
      // Stage B: Hollow sphere settled (sp around 0.45 to 0.55)
      // Stage C: Widescreen scatter dispersion (sp > 0.55 or fast scroll)
      let bloomT = 1.0;
      if (sp < 0.45) {
        bloomT = Math.max(0.0, Math.min(1.0, sp / 0.45));
        bloomT = bloomT * bloomT * (3.0 - 2.0 * bloomT); // smoothstep
      }

      let scatter = 0.0;
      if (sp > 0.55) {
        const scatterNorm = Math.min(1.0, (sp - 0.55) / 0.40);
        scatter = Math.pow(scatterNorm, 1.35) * 0.95;
      }
      scatter = Math.min(1.25, scatter + stateRef.current.scrollVelocity * 0.35);
      if (scatter < 0.002) scatter = 0.0;

      // ── 5. UPDATE ALL 1,850+ MINIATURE FRAMES ──
      for (let i = 0; i < framesData.length; i++) {
        const f = framesData[i];

        // Individual radial bloom stagger (bysanthosh.me):
        // Inner frames bloom slightly ahead of outer frames
        const frameBloom = Math.max(0.0, Math.min(1.0, (bloomT - f.radialDelay * 0.4) / (1.0 - f.radialDelay * 0.4 + 0.001)));
        const smoothBloom = frameBloom * frameBloom * (3.0 - 2.0 * frameBloom);

        // Interpolate position from compact core to full hollow sphere
        dummyPos.copy(f.corePos).lerp(f.restPos, smoothBloom);

        // Rotate entire sphere in 3D according to cursor & scroll
        dummyPos.applyQuaternion(globeQuat);

        // Scatter outward along trajectory on scroll
        if (scatter > 0.001) {
          dummyScatterVec.copy(f.scatterDir).applyQuaternion(globeQuat);
          dummyPos.addScaledVector(dummyScatterVec, scatter);
        }

        // Harmonic breathing scale pulsation (bysanthosh.me)
        const breath = 1.0 + 0.07 * Math.sin(time * f.scaleFreq + f.phase);
        const bloomScale = THREE.MathUtils.lerp(0.35, 1.0, smoothBloom);
        const currentSize = f.size * breath * bloomScale;

        // Billboard orientation towards camera with subtle spherical curvature
        forwardVec.set(dummyPos.x * 0.12, dummyPos.y * 0.12, 1.0).normalize();
        dummyQuat.setFromUnitVectors(baseForward, forwardVec);
        dummyQuat.multiply(f.tiltQuat);

        // Per-element gentle 3D wobble
        wobbleEuler.set(
          Math.sin(time * 0.6 + f.phase) * f.rotSpeedX,
          Math.cos(time * 0.6 + f.phase) * f.rotSpeedY,
          Math.sin(time * 0.8 + f.phase) * f.rotSpeedZ
        );
        wobbleQuat.setFromEuler(wobbleEuler);
        dummyQuat.multiply(wobbleQuat);

        // Organic 3D tumble during scatter
        if (scatter > 0.001) {
          tumbleRot.setFromAxisAngle(f.tumbleAxis, scatter * f.tumbleSpeed);
          dummyQuat.multiply(tumbleRot);
        }

        dummyScale.set(currentSize, currentSize, 1);
        dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
        instancedMesh.setMatrixAt(i, dummyMatrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [framesData]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-screen left-1/2 -translate-x-1/2 min-h-[750px] h-[85vh] lg:h-[900px] flex items-center justify-center my-6 sm:my-10 select-none overflow-visible pointer-events-auto"
      aria-label="Interactive 3D Art Gallery Globe with 1,850+ Miniature Multi-Colored Framed Artworks"
    >
      {/* ── FULL-VIEW EDGE-TO-EDGE HOLLOW 3D MULTI-COLORED ART PICTURE SPHERE ── */}
      <div
        ref={mountRef}
        className="relative size-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none overflow-visible"
        title="Move cursor to steer sphere in 3D, scroll to spin and bloom, or drag to rotate freely"
      >
        {/* Subtle center ambient glow behind hollow globe */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="size-[550px] sm:size-[750px] rounded-full bg-radial from-amber-500/[0.04] via-zinc-400/[0.015] to-transparent blur-3xl" />
        </div>
      </div>
    </div>
  );
}

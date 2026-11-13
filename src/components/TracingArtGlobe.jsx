import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// 3D Miniature Art Frames Sphere (1,850+ vibrant multi-colored framed artworks)
// - Completely borderless free movement (zero rectangular clipping box):
//   * Organic edge alpha dissolve in shader: cards smoothly dissolve to zero opacity
//     before reaching viewport boundaries, eliminating any straight-line cuts
//   * Controlled organic scatter envelope: cards disperse naturally across widescreen
//     without exceeding the visible field of view
//   * Expanded canvas viewport: taller vertical range with seamless negative margins
// - Movement according to CURSOR and SCROLL:
//   * Active Cursor Steering / Tilt: Sphere dynamically angles toward mouse position
//   * Cursor Kinetic Impulse: Fast cursor swishes add fluid momentum
//   * Direct 3D Drag: 360-degree rotation with inertia damping
//   * Scroll Scrub: Scrolling actively spins the whole sphere across dual axes
//   * Scroll Bloom: Blooms from compact inner core into hollow sphere when entering
//   * Harmonic Breathing: Each frame gently pulses at unique frequencies (bysanthosh.me)
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

  // Generate 1,850+ miniature artwork frames with organic borderless envelope
  const framesData = useMemo(() => {
    const items = [];
    const BASE_RADIUS = 2.65;
    const SHELL_THICKNESS = 0.75; // Hollow shell depth (2.27 to 3.02)

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

      // Contracted core position for scroll bloom (20% of radius)
      const corePos = restPos.clone().multiplyScalar(0.20);

      // 3. Atlas index (100 vibrant colorful varieties across 10x10 grid)
      const atlasIdx = i % (ATLAS_COLS * ATLAS_ROWS);
      const col = atlasIdx % ATLAS_COLS;
      const row = Math.floor(atlasIdx / ATLAS_COLS);

      // 4. Individual frame size variation
      let size = 0.17 + random() * 0.06;
      if (i % 23 === 0) size *= 1.28; // Accent feature frame
      if (i % 7 === 0) size *= 0.84;  // Delicate gem frame

      // 5. Per-element movement dynamics (matching bysanthosh.me)
      const scaleFreq = 0.7 + random() * 0.9;
      const phase = random() * Math.PI * 2;
      const rotSpeedX = (random() - 0.5) * 0.15;
      const rotSpeedY = (random() - 0.5) * 0.15;
      const rotSpeedZ = (random() - 0.5) * 0.15;

      // Radial stagger delay for bloom
      const radialDelay = (restPos.length() / (BASE_RADIUS + SHELL_THICKNESS * 0.5)) * 0.15;

      // Natural hanging tilt
      const tiltRoll = (random() - 0.5) * 0.22; // +- 6.5 degrees
      const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), tiltRoll);

      // 6. Controlled widescreen organic scatter envelope (NO rectangular border hits!)
      // Spreads wide horizontally (X) while gently undulating vertically (Y) so it never clips
      const scatterDistX = 2.8 + random() * 2.5;
      const scatterDistY = 1.1 + random() * 1.2;
      const scatterDistZ = 1.6 + random() * 1.8;

      const lateralSpread = (random() - 0.5) * 4.2;
      const verticalSpread = (random() - 0.5) * 1.1;

      const scatterDir = new THREE.Vector3(
        nx * scatterDistX + lateralSpread,
        ny * scatterDistY + verticalSpread,
        nz * scatterDistZ
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

  // Scroll listener: continuous scroll scrubbing
  useEffect(() => {
    stateRef.current.lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - stateRef.current.lastScrollY;
      stateRef.current.lastScrollY = currentY;

      stateRef.current.scrollVelocity = Math.min(1.5, stateRef.current.scrollVelocity + Math.abs(deltaY) * 0.02);

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;

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
      height: mount.clientHeight || window.innerHeight * 0.95,
    });

    let { width, height } = getViewportSize();

    // 1. Scene & Perspective Camera with generous field of view
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 11.5);

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

    // 2. Ambient Floating Wireframe Rectangles (Contained inside viewport)
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
      opacity: 0.06,
    });

    const WIREFRAME_COUNT = 48;
    for (let i = 0; i < WIREFRAME_COUNT; i++) {
      const line = new THREE.LineSegments(wireGeo, wireMat);
      const aspectType = i % 4;
      let ww = 0.55 + (i * 0.03) % 0.7;
      let hh = ww;
      if (aspectType === 1) hh *= 1.35;
      if (aspectType === 2) ww *= 1.45;
      if (aspectType === 3) hh *= 1.6;

      line.scale.set(ww, hh, 1);
      // Confine wireframes comfortably within frustum bounds (x in -9..9, y in -3..3)
      line.position.set(
        ((i * 1.67) % 20) - 10 + (Math.sin(i * 3.7) * 1.0),
        ((i * 1.25) % 8) - 4 + (Math.cos(i * 2.3) * 0.6),
        -3.5 - ((i * 0.35) % 4.0)
      );

      line.userData = {
        baseY: line.position.y,
        phase: i * 0.45,
        speed: 0.35 + (i % 5) * 0.15,
        driftAmp: 0.12 + (i % 3) * 0.08,
      };

      wireframesGroup.add(line);
    }

    // 3. Texture Atlas & Custom Multi-Color Material with Seamless Edge Dissolve
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

    // Custom shader injection: Seamless organic edge fade eliminates any rectangular clipping borders!
    frameMat.onBeforeCompile = (shader) => {
      shader.vertexShader = `
        attribute vec4 aInstanceUV;
        varying vec2 vAtlasUv;
        varying float vDepthFactor;
        varying vec2 vScreenPos;
        ${shader.vertexShader}
      `.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>
        vAtlasUv = uv * aInstanceUV.zw + aInstanceUV.xy;
        vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vDepthFactor = clamp((mvPos.z + 13.5) / 5.0, 0.0, 1.0);
        `
      ).replace(
        '#include <project_vertex>',
        `
        #include <project_vertex>
        // Normalized device coordinates for borderless soft edge dissolve:
        vScreenPos = gl_Position.xy / gl_Position.w;
        `
      );

      shader.fragmentShader = `
        varying vec2 vAtlasUv;
        varying float vDepthFactor;
        varying vec2 vScreenPos;
        ${shader.fragmentShader}
      `.replace(
        '#include <map_fragment>',
        `
        #ifdef USE_MAP
          vec4 sampledDiffuseColor = texture2D(map, vAtlasUv);
          if (sampledDiffuseColor.a < 0.02) discard;

          // ── ORGANIC BORDERLESS EDGE DISSOLVE ──
          // Smoothly fades to 0 opacity before reaching viewport bounds,
          // ensuring frames move freely without any rectangular border cuts!
          float fadeX = smoothstep(1.0, 0.82, abs(vScreenPos.x));
          float fadeY = smoothstep(1.0, 0.76, abs(vScreenPos.y));
          float edgeAlpha = fadeX * fadeY;
          if (edgeAlpha < 0.01) discard;

          // Atmospheric hollow depth: back cards softly muted, front cards crisp and bright
          float depthShade = mix(0.70, 1.05, vDepthFactor);
          sampledDiffuseColor.rgb *= depthShade;
          sampledDiffuseColor.a *= edgeAlpha;

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
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      stateRef.current.cursorTargetX = normX * 1.35;
      stateRef.current.cursorTargetY = -normY * 0.95;

      if (stateRef.current.lastMouseX !== 0) {
        const dx = e.clientX - stateRef.current.lastMouseX;
        const dy = e.clientY - stateRef.current.lastMouseY;
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

      // 1. Cursor tracking with lerp
      stateRef.current.cursorCurX += (stateRef.current.cursorTargetX - stateRef.current.cursorCurX) * 0.08;
      stateRef.current.cursorCurY += (stateRef.current.cursorTargetY - stateRef.current.cursorCurY) * 0.08;

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

      // 2. Scroll scrub progress smoothing
      stateRef.current.scrollProgress += (stateRef.current.targetScrollProgress - stateRef.current.scrollProgress) * 0.075;
      stateRef.current.scrollVelocity *= 0.90;
      const sp = stateRef.current.scrollProgress;

      // 3. Dual-axis sphere rotation driven by cursor + scroll
      const ambientY = time * 0.12;
      const ambientX = Math.sin(time * 0.08) * 0.06;

      const scrollRotY = sp * Math.PI * 3.5;
      const scrollRotX = (sp - 0.5) * Math.PI * 1.2;

      const totalRotY = ambientY + scrollRotY + stateRef.current.dragRotY + stateRef.current.cursorCurX + stateRef.current.kineticRotY;
      const totalRotX = ambientX + scrollRotX + stateRef.current.dragRotX + stateRef.current.cursorCurY + stateRef.current.kineticRotX;

      const globeEuler = new THREE.Euler(totalRotX, totalRotY, 0, 'YXZ');
      const globeQuat = new THREE.Quaternion().setFromEuler(globeEuler);

      // Background wireframes drift & mouse parallax
      wireframesGroup.children.forEach((line) => {
        const d = line.userData;
        line.position.y = d.baseY + Math.sin(time * d.speed + d.phase) * d.driftAmp;
      });
      wireframesGroup.position.x = -stateRef.current.cursorCurX * 0.6;
      wireframesGroup.position.y = -stateRef.current.cursorCurY * 0.45;

      // 4. Scroll bloom & organic scatter stages
      let bloomT = 1.0;
      if (sp < 0.45) {
        bloomT = Math.max(0.0, Math.min(1.0, sp / 0.45));
        bloomT = bloomT * bloomT * (3.0 - 2.0 * bloomT);
      }

      let scatter = 0.0;
      if (sp > 0.55) {
        const scatterNorm = Math.min(1.0, (sp - 0.55) / 0.40);
        scatter = Math.pow(scatterNorm, 1.35) * 0.95;
      }
      scatter = Math.min(1.25, scatter + stateRef.current.scrollVelocity * 0.35);
      if (scatter < 0.002) scatter = 0.0;

      // 5. Update all 1,850+ miniature frames
      for (let i = 0; i < framesData.length; i++) {
        const f = framesData[i];

        // Staggered bloom
        const frameBloom = Math.max(0.0, Math.min(1.0, (bloomT - f.radialDelay * 0.4) / (1.0 - f.radialDelay * 0.4 + 0.001)));
        const smoothBloom = frameBloom * frameBloom * (3.0 - 2.0 * frameBloom);

        dummyPos.copy(f.corePos).lerp(f.restPos, smoothBloom);
        dummyPos.applyQuaternion(globeQuat);

        // Scatter outward along trajectory
        if (scatter > 0.001) {
          dummyScatterVec.copy(f.scatterDir).applyQuaternion(globeQuat);
          dummyPos.addScaledVector(dummyScatterVec, scatter);
        }

        // Harmonic breathing
        const breath = 1.0 + 0.07 * Math.sin(time * f.scaleFreq + f.phase);
        const bloomScale = THREE.MathUtils.lerp(0.35, 1.0, smoothBloom);
        const currentSize = f.size * breath * bloomScale;

        // Billboard orientation
        forwardVec.set(dummyPos.x * 0.12, dummyPos.y * 0.12, 1.0).normalize();
        dummyQuat.setFromUnitVectors(baseForward, forwardVec);
        dummyQuat.multiply(f.tiltQuat);

        // Organic wobble
        wobbleEuler.set(
          Math.sin(time * 0.6 + f.phase) * f.rotSpeedX,
          Math.cos(time * 0.6 + f.phase) * f.rotSpeedY,
          Math.sin(time * 0.8 + f.phase) * f.rotSpeedZ
        );
        wobbleQuat.setFromEuler(wobbleEuler);
        dummyQuat.multiply(wobbleQuat);

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
      className="relative z-10 w-screen left-1/2 -translate-x-1/2 -my-8 sm:-my-16 min-h-[850px] h-[95vh] lg:h-[1050px] flex items-center justify-center select-none overflow-visible pointer-events-auto"
      aria-label="Interactive 3D Art Gallery Globe with 1,850+ Miniature Multi-Colored Framed Artworks"
    >
      {/* ── BORDERLESS FULL-VIEW HOLLOW 3D MULTI-COLORED ART PICTURE SPHERE ── */}
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
          <div className="size-[650px] sm:size-[850px] rounded-full bg-radial from-amber-500/[0.035] via-zinc-400/[0.01] to-transparent blur-3xl" />
        </div>
      </div>
    </div>
  );
}

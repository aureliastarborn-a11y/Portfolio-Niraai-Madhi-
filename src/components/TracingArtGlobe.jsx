import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// 3D Miniature Art Frames Sphere (1,850+ vibrant multi-colored framed artworks)
// - 100% Borderless, Unconstrained Free-Floating Sphere (No rectangular borders, no flat clipping cuts)
// - Minimal abstract floating outlined squares background with subtle opacity (matching getty.edu/tracingart/):
//   * 70+ minimal vector outlined squares with subtle opacities (0.12 to 0.26)
//   * Overlapping and nested blueprint squares with natural grid-jitter distribution
//   * Gentle floating harmonic drift and smooth interactive cursor parallax
//   * Soft vertical gradient fade mask (zero hard edges)
// - Full-range reactive movement according to CURSOR and SCROLL (matching bysanthosh.me & Getty):
//   * Cursor Steering: Sphere dynamically angles toward mouse position
//   * Cursor Kinetic Impulse: Fast cursor flicks impart rotational momentum
//   * Direct 3D Drag: 360-degree rotation with inertia damping
//   * Scroll Scrub: Scrolling actively drives dual-axis 3D spin
//   * Harmonic Breathing: Each frame gently pulses at unique frequencies
// - 10 vibrant color spectrums: sapphire blue, emerald green, ruby red, sunset orange,
//   amethyst violet, turquoise cyan, magenta, golden champagne, terracotta & ebony

const ATLAS_URL = '/images/art-frames-atlas.png';
const ATLAS_COLS = 10;
const ATLAS_ROWS = 10;
const TOTAL_FRAMES = 1850;

export default function TracingArtGlobe() {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const bgLayerRef = useRef(null);

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

  // ── 1. MINIMAL ABSTRACT FLOATING OUTLINED SQUARES BACKGROUND DATA ──
  const bgSquares = useMemo(() => {
    const items = [];
    let seed = 2026;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const COLS = 10;
    const ROWS = 7;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const xPercent = (c / COLS) * 100 + (random() - 0.5) * 7.5;
        const yPercent = (r / ROWS) * 100 + (random() - 0.5) * 9.0;

        const sizeBase = 28 + random() * 64;
        let w = sizeBase;
        let h = sizeBase;
        const aspect = random();
        if (aspect < 0.28) h *= 1.35; // portrait rectangle
        else if (aspect < 0.52) w *= 1.35; // landscape rectangle

        const opacity = 0.12 + random() * 0.14; // Subtle opacity (0.12 to 0.26)
        const hasOverlap = random() < 0.40; // overlapping companion box
        const overlapDx = (random() - 0.5) * 26;
        const overlapDy = (random() - 0.5) * 26;
        const hasNested = !hasOverlap && random() < 0.32; // nested inner box

        const driftDuration = 5.0 + random() * 4.5;
        const delay = -random() * 8.0;

        items.push({
          id: `${r}-${c}`,
          x: Math.max(1, Math.min(96, xPercent)),
          y: Math.max(2, Math.min(94, yPercent)),
          w: Math.round(w),
          h: Math.round(h),
          opacity: Number(opacity.toFixed(3)),
          hasOverlap,
          overlapDx: Math.round(overlapDx),
          overlapDy: Math.round(overlapDy),
          hasNested,
          driftDuration,
          delay,
        });
      }
    }
    return items;
  }, []);

  // ── 2. MINIATURE ARTWORK FRAMES DATA (FIBONACCI SPHERICAL SHELL) ──
  const framesData = useMemo(() => {
    const items = [];
    const BASE_RADIUS = 2.45;
    const SHELL_THICKNESS = 0.50; // Hollow shell depth (2.20 to 2.70)

    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const GOLDEN_ANGLE = 2.399963229728653; // radians

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      // Fibonacci spiral distribution on sphere surface
      const y = 1 - (i / (TOTAL_FRAMES - 1)) * 2; // from +1 to -1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = i * GOLDEN_ANGLE;

      // Natural jitter for organic Getty-style museum distribution
      const jitterPhi = phi + (random() - 0.5) * 0.15;
      const jitterY = Math.max(-0.995, Math.min(0.995, y + (random() - 0.5) * 0.025));
      const jitterR = Math.sqrt(Math.max(0, 1 - jitterY * jitterY));

      const nx = Math.cos(jitterPhi) * jitterR;
      const ny = jitterY;
      const nz = Math.sin(jitterPhi) * jitterR;

      // Shell radius (hollow sphere)
      const radius = (BASE_RADIUS - SHELL_THICKNESS * 0.5) + random() * SHELL_THICKNESS;
      const restPos = new THREE.Vector3(nx * radius, ny * radius, nz * radius);
      const corePos = restPos.clone().multiplyScalar(0.45); // compact core for entrance bloom

      // Varied frame dimensions: miniature square, portrait, and landscape rectangles
      const atlasIdx = i % (ATLAS_COLS * ATLAS_ROWS);
      const col = atlasIdx % ATLAS_COLS;
      const row = Math.floor(atlasIdx / ATLAS_COLS);

      let size = 0.15 + random() * 0.05;
      if (i % 19 === 0) size *= 1.32; // Occasional larger highlight frame
      if (i % 7 === 0) size *= 0.82;  // Miniature accent frame

      // Breathing frequency & phase for organic pulsing
      const scaleFreq = 0.8 + random() * 1.0;
      const phase = random() * Math.PI * 2;

      // Individual frame wobble speeds
      const rotSpeedX = (random() - 0.5) * 0.12;
      const rotSpeedY = (random() - 0.5) * 0.12;
      const rotSpeedZ = (random() - 0.5) * 0.12;

      // Subtle outward tilt & roll jitter so frames mount organically on the 3D sphere
      const roll = (random() - 0.5) * 0.30;
      const pitch = (random() - 0.5) * 0.22;
      const yaw = (random() - 0.5) * 0.22;
      const tiltQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll));

      // UV coordinates in 10x10 atlas
      const uScale = 1.0 / ATLAS_COLS;
      const vScale = 1.0 / ATLAS_ROWS;
      const uOffset = col * uScale;
      const vOffset = (ATLAS_ROWS - 1 - row) * vScale;

      items.push({
        id: i,
        restPos,
        corePos,
        normal: new THREE.Vector3(nx, ny, nz),
        size,
        scaleFreq,
        phase,
        rotSpeedX,
        rotSpeedY,
        rotSpeedZ,
        tiltQuat,
        uv: [uOffset, vOffset, uScale, vScale],
      });
    }

    return items;
  }, []);

  // ── 3. SCROLL SCRUBBING ──
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

  // ── 4. THREE.JS 3D SCENE SETUP & RENDER LOOP ──
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getViewportSize = () => ({
      width: window.innerWidth,
      height: mount.clientHeight || window.innerHeight * 0.85,
    });

    let { width, height } = getViewportSize();

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

    // 3D Depth Wireframe Rectangles (complementing the HTML background)
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
      color: 0x18181b,
      transparent: true,
      opacity: 0.14,
    });

    const WIREFRAME_COUNT = 40;
    for (let i = 0; i < WIREFRAME_COUNT; i++) {
      const line = new THREE.LineSegments(wireGeo, wireMat);
      const aspectType = i % 4;
      let ww = 0.55 + (i * 0.03) % 0.7;
      let hh = ww;
      if (aspectType === 1) hh *= 1.35;
      if (aspectType === 2) ww *= 1.45;
      if (aspectType === 3) hh *= 1.6;

      line.scale.set(ww, hh, 1);
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

    // Texture Atlas & Material
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

          float depthShade = mix(0.72, 1.05, vDepthFactor);
          sampledDiffuseColor.rgb *= depthShade;

          diffuseColor *= sampledDiffuseColor;
        #endif
        `
      );
    };

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

    // Mouse / Pointer handlers
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      stateRef.current.cursorTargetX = normX * 1.2;
      stateRef.current.cursorTargetY = -normY * 0.8;

      if (stateRef.current.lastMouseX !== 0) {
        const dx = e.clientX - stateRef.current.lastMouseX;
        const dy = e.clientY - stateRef.current.lastMouseY;
        stateRef.current.cursorVelX += dx * 0.0006;
        stateRef.current.cursorVelY += dy * 0.0006;

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

    // Animation loop
    let animId;
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyScale = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const wobbleQuat = new THREE.Quaternion();
    const wobbleEuler = new THREE.Euler();
    const forwardVec = new THREE.Vector3();
    const baseForward = new THREE.Vector3(0, 0, 1);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // Cursor tracking with lerp
      stateRef.current.cursorCurX += (stateRef.current.cursorTargetX - stateRef.current.cursorCurX) * 0.08;
      stateRef.current.cursorCurY += (stateRef.current.cursorTargetY - stateRef.current.cursorCurY) * 0.08;

      stateRef.current.cursorVelX *= 0.92;
      stateRef.current.cursorVelY *= 0.92;
      stateRef.current.kineticRotY += stateRef.current.cursorVelX;
      stateRef.current.kineticRotX += stateRef.current.cursorVelY;

      // Drag inertia
      if (!stateRef.current.isDown) {
        stateRef.current.dragVelY *= 0.94;
        stateRef.current.dragVelX *= 0.94;
        stateRef.current.dragRotY += stateRef.current.dragVelY;
        stateRef.current.dragRotX += stateRef.current.dragVelX;
      }

      // Scroll progress
      stateRef.current.scrollProgress += (stateRef.current.targetScrollProgress - stateRef.current.scrollProgress) * 0.075;
      stateRef.current.scrollVelocity *= 0.90;
      const sp = stateRef.current.scrollProgress;

      // Dual-axis sphere rotation (matching bysanthosh.me & Getty)
      const ambientY = time * 0.10;
      const ambientX = Math.sin(time * 0.07) * 0.05;

      const scrollRotY = sp * Math.PI * 4.0;
      const scrollRotX = (sp - 0.5) * Math.PI * 1.5;

      const totalRotY = ambientY + scrollRotY + stateRef.current.dragRotY + stateRef.current.cursorCurX * 0.45 + stateRef.current.kineticRotY;
      const totalRotX = ambientX + scrollRotX + stateRef.current.dragRotX + stateRef.current.cursorCurY * 0.40 + stateRef.current.kineticRotX;

      const globeEuler = new THREE.Euler(totalRotX, totalRotY, 0, 'YXZ');
      const globeQuat = new THREE.Quaternion().setFromEuler(globeEuler);

      // Background wireframes drift & mouse parallax
      wireframesGroup.children.forEach((line) => {
        const d = line.userData;
        line.position.y = d.baseY + Math.sin(time * d.speed + d.phase) * d.driftAmp;
      });
      wireframesGroup.position.x = -stateRef.current.cursorCurX * 0.5;
      wireframesGroup.position.y = -stateRef.current.cursorCurY * 0.35;

      // Apply mouse parallax to the minimal abstract HTML floating squares background
      if (bgLayerRef.current) {
        const bgParallaxX = -stateRef.current.cursorCurX * 22;
        const bgParallaxY = -stateRef.current.cursorCurY * 16;
        bgLayerRef.current.style.transform = `translate3d(${bgParallaxX.toFixed(2)}px, ${bgParallaxY.toFixed(2)}px, 0)`;
      }

      // Smooth entrance bloom into full hollow sphere
      let bloomT = 1.0;
      if (sp < 0.35) {
        const t = Math.max(0.0, Math.min(1.0, sp / 0.35));
        bloomT = t * t * (3.0 - 2.0 * t);
      }

      // Update 1,850+ frames on the hollow sphere
      for (let i = 0; i < framesData.length; i++) {
        const f = framesData[i];

        // Smooth bloom from core into hollow sphere
        dummyPos.copy(f.corePos).lerp(f.restPos, bloomT);
        dummyPos.applyQuaternion(globeQuat);

        // Harmonic breathing scale pulsation
        const breath = 1.0 + 0.07 * Math.sin(time * f.scaleFreq + f.phase);
        const bloomScale = THREE.MathUtils.lerp(0.45, 1.0, bloomT);
        const currentSize = f.size * breath * bloomScale;

        // Frame orientation: faces outward along normal with organic tilt
        forwardVec.copy(dummyPos).normalize();
        dummyQuat.setFromUnitVectors(baseForward, forwardVec);
        dummyQuat.multiply(f.tiltQuat);

        // Subtle frame-level harmonic wobble
        wobbleEuler.set(
          Math.sin(time * 0.6 + f.phase) * f.rotSpeedX,
          Math.cos(time * 0.6 + f.phase) * f.rotSpeedY,
          Math.sin(time * 0.8 + f.phase) * f.rotSpeedZ
        );
        wobbleQuat.setFromEuler(wobbleEuler);
        dummyQuat.multiply(wobbleQuat);

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
      className="relative z-10 w-screen left-1/2 -translate-x-1/2 my-12 sm:my-20 min-h-[750px] h-[85vh] lg:h-[900px] flex items-center justify-center select-none overflow-visible pointer-events-auto"
      aria-label="Interactive 3D Art Gallery Globe with 1,850+ Miniature Multi-Colored Framed Artworks"
    >
      {/* ── MINIMAL ABSTRACT FLOATING OUTLINED SQUARES BACKGROUND (SUBTLE OPACITY) ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        <style>{`
          @keyframes floatOutlineSq {
            0% { transform: translate3d(0, -6px, 0); }
            50% { transform: translate3d(2px, 4px, 0); }
            100% { transform: translate3d(-2px, -6px, 0); }
          }
        `}</style>

        <div
          ref={bgLayerRef}
          className="relative size-full will-change-transform"
        >
          {bgSquares.map((sq) => (
            <React.Fragment key={sq.id}>
              {/* Primary outlined square / rectangle */}
              <div
                className="absolute border border-zinc-900 pointer-events-none rounded-[1px]"
                style={{
                  left: `${sq.x}%`,
                  top: `${sq.y}%`,
                  width: `${sq.w}px`,
                  height: `${sq.h}px`,
                  opacity: sq.opacity,
                  animation: `floatOutlineSq ${sq.driftDuration}s ease-in-out infinite`,
                  animationDelay: `${sq.delay}s`,
                }}
              >
                {/* Nested inner outlined square (matching Getty catalog blueprint style) */}
                {sq.hasNested && (
                  <div
                    className="absolute inset-2 border border-zinc-900 rounded-[1px]"
                    style={{ opacity: 0.85 }}
                  />
                )}
              </div>

              {/* Overlapping companion outlined square */}
              {sq.hasOverlap && (
                <div
                  className="absolute border border-zinc-900 pointer-events-none rounded-[1px]"
                  style={{
                    left: `calc(${sq.x}% + ${sq.overlapDx}px)`,
                    top: `calc(${sq.y}% + ${sq.overlapDy}px)`,
                    width: `${Math.round(sq.w * 0.82)}px`,
                    height: `${Math.round(sq.h * 0.82)}px`,
                    opacity: sq.opacity * 0.88,
                    animation: `floatOutlineSq ${sq.driftDuration * 1.15}s ease-in-out infinite`,
                    animationDelay: `${sq.delay + 1.5}s`,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

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

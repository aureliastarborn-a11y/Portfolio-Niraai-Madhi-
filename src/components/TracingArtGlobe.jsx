import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// 3D Miniature Art Frames Sphere (1000+ mini framed artwork pictures)
// - Completely hollow inside (no solid ball or core - hollow 3D shell)
// - Random distribution irrespective of axis (zero poles, zero spirals, uniform isotropic shell)
// - Billboarded organic orientation: every frame faces the viewer with natural human hang tilt
// - Varied square and rectangle frames (3:4, 4:3, 1:1, 1:2, 2:1) matching getty.edu/tracingart/
// - Authentic museum framing: gilded gold, ebony, walnut, terracotta, bronze, ivory gallery mats
// - Ambient floating wireframe background rectangles matching the Getty museum aesthetic
// - Continuous scroll convergence and widescreen scatter physics
// - Full-view edge-to-edge spread (no clipping box)

const ATLAS_URL = '/images/art-frames-atlas.png';
const ATLAS_COLS = 8;
const ATLAS_ROWS = 8;
const TOTAL_FRAMES = 1120; // 1000+ miniature frames

export default function TracingArtGlobe() {
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  const stateRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    rotY: 0.25,
    rotX: -0.05,
    velY: 0,
    velX: 0,
    mouseTargetY: 0,
    mouseTargetX: 0,
    curRotY: 0.25,
    curRotX: -0.05,

    // Scroll scatter dynamics
    scatterAmount: 0.0,
    targetScatter: 0.0,
    scrollScatterVelocity: 0.0,
    lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
  });

  // Generate 1,120 miniature artwork frames randomly distributed on a hollow 3D sphere shell
  const framesData = useMemo(() => {
    const items = [];
    const BASE_RADIUS = 2.70;
    const SHELL_THICKNESS = 0.72; // Wide hollow shell depth (2.34 to 3.06)

    // Seeded pseudo-random generator for consistent distribution across hot-reloads
    let seed = 42;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      // 1. Mathematically uniform isotropic distribution on a sphere (independent of any axis):
      // u = cos(phi) uniform in [-1, 1], theta uniform in [0, 2*PI)
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const r_xy = Math.sqrt(Math.max(0, 1 - u * u));

      const nx = r_xy * Math.cos(theta);
      const ny = u;
      const nz = r_xy * Math.sin(theta);

      // 2. Hollow sphere shell volume (center is completely hollow, radius jitter creates depth):
      const radius = (BASE_RADIUS - SHELL_THICKNESS * 0.5) + random() * SHELL_THICKNESS;
      const restPos = new THREE.Vector3(nx * radius, ny * radius, nz * radius);

      // 3. Atlas index (64 museum framed varieties):
      const atlasIdx = i % (ATLAS_COLS * ATLAS_ROWS);
      const col = atlasIdx % ATLAS_COLS;
      const row = Math.floor(atlasIdx / ATLAS_COLS);

      // 4. Individual frame size variation matching Getty reference:
      let size = 0.22 + random() * 0.08;
      if (i % 19 === 0) size *= 1.30; // Feature paintings
      if (i % 7 === 0) size *= 0.85;  // Tiny delicate gem frames

      // 5. Natural organic hanging roll tilt (hand-hung painting character):
      const tiltRoll = (random() - 0.5) * 0.22; // +- 6.5 degrees
      const tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), tiltRoll);

      // 6. Widescreen scatter vector: spreads outward across full viewport on scroll
      const scatterDist = 3.6 + random() * 2.8;
      const lateralSpread = (random() - 0.5) * 5.2;
      const verticalSpread = (random() - 0.5) * 2.2;
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

      // UV coordinates in 1024x1024 atlas (8x8 grid)
      const uScale = 1.0 / ATLAS_COLS;
      const vScale = 1.0 / ATLAS_ROWS;
      const uOffset = col * uScale;
      const vOffset = (ATLAS_ROWS - 1 - row) * vScale;

      items.push({
        id: i,
        restPos,
        size,
        tiltQuat,
        scatterDir,
        tumbleAxis,
        tumbleSpeed,
        uv: [uOffset, vOffset, uScale, vScale],
      });
    }

    return items;
  }, []);

  // Scroll listener: continuous scroll scrubbing matching getty.edu/tracingart/
  useEffect(() => {
    stateRef.current.lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = Math.abs(currentY - stateRef.current.lastScrollY);
      stateRef.current.lastScrollY = currentY;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;

        // Centered in viewport: targetScatter = 0 (hollow sphere tightly convened)
        // Scrolling away: targetScatter increases smoothly (frames scatter open)
        const centerDist = Math.abs((rect.top + rect.height * 0.5) - vh * 0.5);
        const deadzone = 80;
        if (centerDist < deadzone) {
          stateRef.current.targetScatter = 0.0;
        } else {
          const maxDist = vh * 0.7;
          const distNorm = Math.min(1.0, (centerDist - deadzone) / maxDist);
          stateRef.current.targetScatter = Math.pow(distNorm, 1.35) * 0.95;
        }

        // Scroll velocity burst
        stateRef.current.scrollScatterVelocity = Math.min(
          1.25,
          stateRef.current.scrollScatterVelocity + Math.min(0.75, deltaY * 0.018)
        );
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

    // 2. Ambient Floating Wireframe Rectangles (Signature Getty Museum Aesthetic)
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
      if (aspectType === 1) hh *= 1.35; // portrait
      if (aspectType === 2) ww *= 1.45; // landscape
      if (aspectType === 3) hh *= 1.6;  // tall portrait

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

    // 3. Texture Atlas & Instanced Art Frames Material
    const texLoader = new THREE.TextureLoader();
    const atlasTex = texLoader.load(ATLAS_URL);
    atlasTex.generateMipmaps = true;
    atlasTex.minFilter = THREE.LinearMipmapLinearFilter;

    // Custom shader material with individual UV atlas sampling + hollow depth lighting
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
        // Depth modulation: front frames (mvPos.z ~ -8.5) vs back frames (mvPos.z ~ -13.5)
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
          float depthShade = mix(0.72, 1.04, vDepthFactor);
          sampledDiffuseColor.rgb *= depthShade;

          diffuseColor *= sampledDiffuseColor;
        #endif
        `
      );
    };

    // 4. Instanced 3D Mesh for 1,120 miniature framed artworks
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

    // 5. Mouse & Touch Drag Interaction
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;

      stateRef.current.mouseTargetY = normX * 0.35;
      stateRef.current.mouseTargetX = -normY * 0.25;

      if (stateRef.current.isDown) {
        const deltaX = e.clientX - stateRef.current.prevX;
        const deltaY = e.clientY - stateRef.current.prevY;
        stateRef.current.velY = deltaX * 0.004;
        stateRef.current.velX = deltaY * 0.004;
        stateRef.current.rotY += stateRef.current.velY;
        stateRef.current.rotX += stateRef.current.velX;
        stateRef.current.prevX = e.clientX;
        stateRef.current.prevY = e.clientY;
      }
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
      }
    };

    const handleTouchMove = (e) => {
      if (stateRef.current.isDown && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - stateRef.current.prevX;
        const deltaY = e.touches[0].clientY - stateRef.current.prevY;
        stateRef.current.velY = deltaX * 0.005;
        stateRef.current.velX = deltaY * 0.005;
        stateRef.current.rotY += stateRef.current.velY;
        stateRef.current.rotX += stateRef.current.velX;
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

    // Responsive viewport resize
    const handleResize = () => {
      const s = getViewportSize();
      camera.aspect = s.width / s.height;
      camera.updateProjectionMatrix();
      renderer.setSize(s.width, s.height);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation & Render Loop
    let animId;
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyScatterVec = new THREE.Vector3();
    const dummyScale = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const tumbleRot = new THREE.Quaternion();
    const forwardVec = new THREE.Vector3();
    const baseForward = new THREE.Vector3(0, 0, 1);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Ambient slow 3D orbit + inertia damping
      stateRef.current.rotY += 0.0016;

      if (!stateRef.current.isDown) {
        stateRef.current.velY *= 0.94;
        stateRef.current.velX *= 0.94;
        stateRef.current.rotY += stateRef.current.velY;
        stateRef.current.rotX += stateRef.current.velX;
      }

      // Smooth interpolation towards mouse tilt
      const targetY = stateRef.current.rotY + stateRef.current.mouseTargetY;
      const targetX = Math.max(-0.6, Math.min(0.6, stateRef.current.rotX + stateRef.current.mouseTargetX));

      stateRef.current.curRotY += (targetY - stateRef.current.curRotY) * 0.06;
      stateRef.current.curRotX += (targetX - stateRef.current.curRotX) * 0.06;

      const globeEuler = new THREE.Euler(stateRef.current.curRotX, stateRef.current.curRotY, 0, 'YXZ');
      const globeQuat = new THREE.Quaternion().setFromEuler(globeEuler);

      // Background floating wireframes harmonic drift & mouse parallax
      const time = performance.now() * 0.001;
      wireframesGroup.children.forEach((line) => {
        const d = line.userData;
        line.position.y = d.baseY + Math.sin(time * d.speed + d.phase) * d.driftAmp;
      });
      wireframesGroup.position.x = -stateRef.current.mouseTargetY * 0.7;
      wireframesGroup.position.y = -stateRef.current.mouseTargetX * 0.5;

      // ── SCATTER PHYSICS: CONTINUOUS SCROLL DYNAMICS ──
      stateRef.current.scrollScatterVelocity *= 0.90;
      const totalTargetScatter = Math.min(1.25, stateRef.current.targetScatter + stateRef.current.scrollScatterVelocity);
      stateRef.current.scatterAmount += (totalTargetScatter - stateRef.current.scatterAmount) * 0.075;
      let scatter = stateRef.current.scatterAmount;
      if (scatter < 0.002) scatter = 0;

      // ── UPDATE ALL 1,120 MINIATURE FRAMES ──
      for (let i = 0; i < framesData.length; i++) {
        const f = framesData[i];

        // 3D Orbit: Rest positions orbit around the origin via globeQuat
        dummyPos.copy(f.restPos).applyQuaternion(globeQuat);

        // Scatter outward along trajectory on scroll
        if (scatter > 0.001) {
          dummyScatterVec.copy(f.scatterDir).applyQuaternion(globeQuat);
          dummyPos.addScaledVector(dummyScatterVec, scatter);
        }

        // Camera-facing billboard orientation with subtle spherical curvature bulge:
        forwardVec.set(dummyPos.x * 0.12, dummyPos.y * 0.12, 1.0).normalize();
        dummyQuat.setFromUnitVectors(baseForward, forwardVec);
        dummyQuat.multiply(f.tiltQuat);

        // Organic 3D tumble during scatter
        if (scatter > 0.001) {
          tumbleRot.setFromAxisAngle(f.tumbleAxis, scatter * f.tumbleSpeed);
          dummyQuat.multiply(tumbleRot);
        }

        // Scale
        dummyScale.set(f.size, f.size, 1);

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
      aria-label="Interactive 3D Art Gallery Globe with 1000+ Miniature Framed Artwork Pictures"
    >
      {/* ── FULL-VIEW EDGE-TO-EDGE HOLLOW 3D MINIATURE ART PICTURE SPHERE ── */}
      <div
        ref={mountRef}
        className="relative size-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none overflow-visible"
        title="Scroll to scatter 1000+ miniature framed artworks or drag to rotate the hollow sphere"
      >
        {/* Subtle warm center ambient glow behind hollow globe */}
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

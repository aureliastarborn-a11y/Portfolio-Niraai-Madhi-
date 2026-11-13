import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// 3D Miniature Art Frames Sphere (1000+ mini framed artwork pictures)
// - 1000+ miniature framed images with varied square and rectangle frames
// - Real museum gilded gold, antique wood, ivory gallery, and bronze borders
// - Smooth scroll convergence and scatter dynamics (matching getty.edu/tracingart/)
// - Full-view edge-to-edge spread (no clipping box!)

const ATLAS_URL = '/images/art-frames-atlas.png';
const ATLAS_COLS = 8;
const ATLAS_ROWS = 6;
const TOTAL_FRAMES = 1120; // 1000+ mini frames

export default function TracingArtGlobe() {
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  const stateRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    rotY: 0.2,
    rotX: -0.06,
    velY: 0,
    velX: 0,
    mouseTargetY: 0,
    mouseTargetX: 0,
    curRotY: 0.2,
    curRotX: -0.06,

    // Scroll movement physics (inspired by getty.edu/tracingart/)
    scatterAmount: 0.0,
    targetScatter: 0.0,
    scrollScatterVelocity: 0.0,
    lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
  });

  // Generate 1,120 mini image frames with varied square & rectangle sizes on a 3D sphere
  const framesData = useMemo(() => {
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio
    const baseRadius = 2.85;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const y = 1 - (i / (TOTAL_FRAMES - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const nx = Math.cos(theta) * radiusAtY;
      const ny = y;
      const nz = Math.sin(theta) * radiusAtY;
      const normal = new THREE.Vector3(nx, ny, nz).normalize();

      // Atlas texture index (48 varieties)
      const atlasIdx = i % (ATLAS_COLS * ATLAS_ROWS);
      const col = atlasIdx % ATLAS_COLS;
      const row = Math.floor(atlasIdx / ATLAS_COLS);

      // Aspect ratio type based on row in atlas:
      // row 0, 1: Square
      // row 2, 3: Portrait rectangle
      // row 4, 5: Landscape rectangle
      const sizeScale = 0.8 + (i % 7) * 0.08 + ((i % 13 === 0) ? 0.35 : 0); // Some larger feature frames

      let w = 0.20 * sizeScale;
      let h = 0.20 * sizeScale;

      if (row >= 2 && row < 4) {
        // Portrait rectangle
        w = 0.165 * sizeScale;
        h = 0.225 * sizeScale;
      } else if (row >= 4) {
        // Landscape rectangle
        w = 0.225 * sizeScale;
        h = 0.165 * sizeScale;
      }

      const depth = 0.015; // Thin framed picture card thickness

      // Tangential outward orientation facing normal
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

      // Slight natural organic tilt angle (each painting hangs with human character)
      const tiltAngle = ((i % 5) - 2) * 0.08 + Math.sin(i * 1.7) * 0.05;
      const tiltQuat = new THREE.Quaternion().setFromAxisAngle(normal, tiltAngle);
      quat.premultiply(tiltQuat);

      // Resting position on sphere surface
      const restPos = normal.clone().multiplyScalar(baseRadius + (i % 5) * 0.02);

      // Scatter trajectory: wide horizontal spread across widescreen viewport
      const scatterDistance = 2.4 + (i % 8) * 0.5 + Math.sin(i * 1.4) * 0.4;
      const lateralAngle = i * 0.85;

      const spreadX = Math.cos(lateralAngle) * 2.2;
      const spreadY = Math.sin(lateralAngle) * 1.1;
      const tangent = new THREE.Vector3(
        -normal.z * spreadX,
        spreadY,
        normal.x * spreadX
      ).multiplyScalar(0.7);

      const scatterDir = normal.clone().multiplyScalar(scatterDistance).add(tangent);

      // Random tumble axis during 3D flight
      const tumbleAxis = new THREE.Vector3(
        (i % 5) - 2,
        (i % 7) - 3,
        (i % 3) - 1
      ).normalize();
      const tumbleSpeed = 1.0 + (i % 5) * 0.3;

      // UV coordinates in atlas (1024x768)
      // Cell is 128x128. WebGL texture coordinates (0,0 is bottom-left)
      const uScale = 1.0 / ATLAS_COLS;
      const vScale = 1.0 / ATLAS_ROWS;
      const uOffset = col * uScale;
      const vOffset = (ATLAS_ROWS - 1 - row) * vScale;

      items.push({
        id: i,
        normal,
        restPos,
        quat,
        w,
        h,
        depth,
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

        // Position-based convergence:
        // Centered in viewport: targetScatter = 0 (tight cohesive sphere)
        // Scrolling above/below: targetScatter smoothly increases (frames scatter open)
        const centerDist = Math.abs((rect.top + rect.height * 0.5) - vh * 0.5);
        const deadzone = 80;
        if (centerDist < deadzone) {
          stateRef.current.targetScatter = 0.0;
        } else {
          const maxDist = vh * 0.7;
          const distNorm = Math.min(1.0, (centerDist - deadzone) / maxDist);
          stateRef.current.targetScatter = Math.pow(distNorm, 1.35) * 0.95;
        }

        // Velocity pulse: rapid scroll expands the scatter wider
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

    // 1. Scene, Camera, WebGL Renderer
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
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.5);
    sunLight.position.set(5, 7, 7);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0ff, 1.2);
    fillLight.position.set(-6, -3, -5);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // 3. Central Pivot Group for interactive rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 4. Load Art Frames Texture Atlas
    const texLoader = new THREE.TextureLoader();
    const atlasTex = texLoader.load(ATLAS_URL);
    atlasTex.generateMipmaps = true;
    atlasTex.minFilter = THREE.LinearMipmapLinearFilter;

    // Custom Instanced Material supporting individual UV frame sampling
    const frameMat = new THREE.MeshStandardMaterial({
      map: atlasTex,
      roughness: 0.45,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    frameMat.onBeforeCompile = (shader) => {
      shader.vertexShader = `
        attribute vec4 aInstanceUV;
        varying vec2 vAtlasUv;
        ${shader.vertexShader}
      `.replace(
        '#include <uv_vertex>',
        `
        #include <uv_vertex>
        vAtlasUv = uv * aInstanceUV.zw + aInstanceUV.xy;
        `
      );

      shader.fragmentShader = `
        varying vec2 vAtlasUv;
        ${shader.fragmentShader}
      `.replace(
        '#include <map_fragment>',
        `
        #ifdef USE_MAP
          vec4 sampledDiffuseColor = texture2D( map, vAtlasUv );
          diffuseColor *= sampledDiffuseColor;
        #endif
        `
      );
    };

    // 5. Instanced 3D Mesh for 1,120 mini image frames
    const frameGeo = new THREE.BoxGeometry(1, 1, 1);

    // Attach instance UV attribute [uOffset, vOffset, uScale, vScale]
    const uvArray = new Float32Array(framesData.length * 4);
    for (let i = 0; i < framesData.length; i++) {
      const uv = framesData[i].uv;
      uvArray[i * 4 + 0] = uv[0];
      uvArray[i * 4 + 1] = uv[1];
      uvArray[i * 4 + 2] = uv[2];
      uvArray[i * 4 + 3] = uv[3];
    }
    frameGeo.setAttribute('aInstanceUV', new THREE.InstancedBufferAttribute(uvArray, 4));

    const instancedMesh = new THREE.InstancedMesh(frameGeo, frameMat, framesData.length);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    globeGroup.add(instancedMesh);

    // 6. Ground Ambient Shadow underneath
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 120);
      grad.addColorStop(0, 'rgba(30, 20, 15, 0.24)');
      grad.addColorStop(0.5, 'rgba(40, 28, 20, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.4;
    scene.add(shadowPlane);

    // 7. Mouse & Touch Drag Interaction
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

    // Full Viewport Resize Handler (keeps full-screen unclipped view)
    const handleResize = () => {
      const s = getViewportSize();
      camera.aspect = s.width / s.height;
      camera.updateProjectionMatrix();
      renderer.setSize(s.width, s.height);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation & Render Loop
    let animId;
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyScale = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const tumbleRot = new THREE.Quaternion();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Ambient slow rotation + inertia damping
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

      globeGroup.rotation.y = stateRef.current.curRotY;
      globeGroup.rotation.x = stateRef.current.curRotX;

      // ── SCATTER PHYSICS: 1000+ FRAMES SCATTER WIDE ON SCROLL ──
      stateRef.current.scrollScatterVelocity *= 0.90;

      const totalTargetScatter = Math.min(1.25, stateRef.current.targetScatter + stateRef.current.scrollScatterVelocity);
      stateRef.current.scatterAmount += (totalTargetScatter - stateRef.current.scatterAmount) * 0.075;
      let scatter = stateRef.current.scatterAmount;
      if (scatter < 0.002) scatter = 0;

      // Update each framed picture's position, orientation, and scale
      for (let i = 0; i < framesData.length; i++) {
        const f = framesData[i];

        // Moves outward radially + lateral dispersion across full viewport
        dummyPos.copy(f.restPos).addScaledVector(f.scatterDir, scatter);

        // Organic tumble in 3D space
        dummyQuat.copy(f.quat);
        if (scatter > 0.001) {
          tumbleRot.setFromAxisAngle(f.tumbleAxis, scatter * f.tumbleSpeed);
          dummyQuat.multiply(tumbleRot);
        }

        // Varied square & rectangular frame dimensions
        dummyScale.set(f.w, f.h, f.depth);

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
      {/* ── FULL-VIEW EDGE-TO-EDGE 3D MINIATURE ART PICTURE SPHERE (NO CLIPPING BOX) ── */}
      <div
        ref={mountRef}
        className="relative size-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none overflow-visible"
        title="Scroll to scatter 1000+ miniature framed artworks or drag to rotate the sphere"
      >
        {/* Ambient subtle center glow behind globe */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="size-[550px] sm:size-[750px] rounded-full bg-radial from-amber-500/[0.05] via-zinc-400/[0.02] to-transparent blur-3xl" />
        </div>
      </div>
    </div>
  );
}

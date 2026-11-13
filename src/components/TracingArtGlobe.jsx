import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

// 3D Miniature Architectural City Globe (Alex Shuper style)
// Real 3D building skyscraper planet where the 3D buildings scatter and reassemble on scroll
// Movement reference: getty.edu/tracingart/ (scroll-driven 3D convergence into a tight sphere and scatter on scroll)

// Alex Shuper Architectural Palette (Terracotta, Coral, Sandstone, Limestone, Copper)
const BUILDING_COLORS = [
  0xb85d43, // Terracotta Red
  0xc76c52, // Warm Coral Terracotta
  0xa84e36, // Deep Rust Brick
  0xd8c4af, // Cream Sandstone
  0xe8d7c5, // Pale Limestone
  0xc4ae9b, // Warm Beige
  0xf0eae1, // Modern Off-white Skyscraper
  0x7d493b, // Weathered Brownstone
  0x634b42, // Dark Bronze Granite
  0x8f5945, // Clay Ochre
  0xe0cebd, // Ivory Facade
  0x995341, // Burnt Sienna
  0xd47a5b, // Sunset Terracotta
  0xbaa390, // Antique Sandstone
  0x524039, // Slate Foundation
  0xad614d, // Roman Brick
];

function createFacadeTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Base building facade
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 128, 256);

  // Architectural window grid
  const rows = 18;
  const cols = 6;
  const padX = 5;
  const padY = 4;
  const winW = (128 - padX * (cols + 1)) / cols;
  const winH = (256 - padY * (rows + 1)) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padX + c * (winW + padX);
      const y = padY + r * (winH + padY);

      // Subtle variation in window illumination
      const isLit = (r * 7 + c * 13) % 9 === 0;
      ctx.fillStyle = isLit ? '#ffeaa7' : '#221a17';
      ctx.fillRect(x, y, winW, winH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export default function TracingArtGlobe() {
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  const stateRef = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    rotY: 0.25,
    rotX: -0.06,
    velY: 0,
    velX: 0,
    mouseTargetY: 0,
    mouseTargetX: 0,
    curRotY: 0.25,
    curRotX: -0.06,

    // Scroll movement physics (inspired by getty.edu/tracingart/)
    scatterAmount: 0.0,
    targetScatter: 0.0,
    scrollScatterVelocity: 0.0,
    lastScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
  });

  // Generate 860 dense architectural 3D building skyscrapers across the sphere
  const buildingsData = useMemo(() => {
    const COUNT = 860;
    const items = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle
    const baseRadius = 2.45;

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const nx = Math.cos(theta) * radiusAtY;
      const ny = y;
      const nz = Math.sin(theta) * radiusAtY;
      const normal = new THREE.Vector3(nx, ny, nz).normalize();

      // Building dimensions: varied heights, widths, and depths
      const isSpire = i % 17 === 0;
      const isTower = i % 7 === 0;
      let height = 0.28 + (i % 6) * 0.08 + Math.sin(i * 1.9) * 0.12;
      if (isSpire) height = 1.05 + (i % 5) * 0.12; // Landmark skyscraper spires
      else if (isTower) height = 0.65 + (i % 4) * 0.10; // High-rise towers

      const width = 0.10 + (i % 5) * 0.022;
      const depth = 0.10 + ((i + 2) % 5) * 0.022;

      // Resting position on sphere surface
      const restPos = normal.clone().multiplyScalar(baseRadius + height * 0.5);

      // Orientation quaternion: aligns (0, 1, 0) with normal
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Alignment to street grid
      const streetAngle = (i % 4) * (Math.PI / 2);
      const streetQuat = new THREE.Quaternion().setFromAxisAngle(normal, streetAngle);
      quat.premultiply(streetQuat);

      // Scatter trajectory: outward along normal with organic dispersion & tumble
      const scatterDistance = 1.8 + (i % 8) * 0.35 + Math.sin(i * 1.5) * 0.3;
      const lateralAngle = i * 0.85;
      const tangent = new THREE.Vector3(
        -normal.z * Math.cos(lateralAngle),
        Math.sin(lateralAngle) * 0.45,
        normal.x * Math.cos(lateralAngle)
      ).normalize().multiplyScalar(0.4);

      const scatterDir = normal.clone().multiplyScalar(scatterDistance).add(tangent);

      // Random tumble axis for 3D flight
      const tumbleAxis = new THREE.Vector3(
        (i % 5) - 2,
        (i % 7) - 3,
        (i % 3) - 1
      ).normalize();
      const tumbleSpeed = 1.1 + (i % 5) * 0.35;

      const colorHex = BUILDING_COLORS[i % BUILDING_COLORS.length];

      items.push({
        id: i,
        normal,
        restPos,
        quat,
        width,
        height,
        depth,
        scatterDir,
        tumbleAxis,
        tumbleSpeed,
        color: new THREE.Color(colorHex),
      });
    }

    return items;
  }, []);

  // Scroll listener: movement directly modeled after getty.edu/tracingart/
  useEffect(() => {
    stateRef.current.lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = Math.abs(currentY - stateRef.current.lastScrollY);
      stateRef.current.lastScrollY = currentY;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;

        // Position-based continuous convergence:
        // When center of globe is in center of viewport: targetScatter = 0 (solid closed sphere)
        // As user scrolls above or below: targetScatter smoothly increases (buildings scatter open)
        const centerDist = Math.abs((rect.top + rect.height * 0.5) - vh * 0.5);
        const deadzone = 80;
        if (centerDist < deadzone) {
          stateRef.current.targetScatter = 0.0;
        } else {
          const maxDist = vh * 0.65;
          const distNorm = Math.min(1.0, (centerDist - deadzone) / maxDist);
          stateRef.current.targetScatter = Math.pow(distNorm, 1.35) * 0.85;
        }

        // Velocity pulse: scrolling fast dynamically expands the scatter
        stateRef.current.scrollScatterVelocity = Math.min(
          1.2,
          stateRef.current.scrollScatterVelocity + Math.min(0.65, deltaY * 0.018)
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

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 700;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // 2. Lighting (Rich directional sunlight + ambient fill)
    const sunLight = new THREE.DirectionalLight(0xfff6ec, 2.9);
    sunLight.position.set(6, 8, 6);
    scene.add(sunLight);

    const skyLight = new THREE.DirectionalLight(0xdde8ff, 1.2);
    skyLight.position.set(-6, -2, -5);
    scene.add(skyLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // 3. Central Pivot Group for interactive rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 4. Planet Core Sphere (warm city street / bedrock foundation)
    const coreGeo = new THREE.SphereGeometry(2.44, 48, 48);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x8a624a,
      roughness: 0.85,
      metalness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 5. Instanced 3D Building Skyscrapers (860 towers)
    const facadeTex = createFacadeTexture();
    const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshStandardMaterial({
      map: facadeTex || undefined,
      roughness: 0.55,
      metalness: 0.12,
    });

    const instancedMesh = new THREE.InstancedMesh(buildingGeo, buildingMat, buildingsData.length);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Set individual colors for each building
    for (let i = 0; i < buildingsData.length; i++) {
      instancedMesh.setColorAt(i, buildingsData[i].color);
    }
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }
    globeGroup.add(instancedMesh);

    // 6. Ground Ambient Shadow underneath the planet
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 120);
      grad.addColorStop(0, 'rgba(40, 26, 18, 0.28)');
      grad.addColorStop(0.5, 'rgba(50, 32, 22, 0.09)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.5, 6.5),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.25;
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

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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

      // Continuous ambient rotation + inertia damping
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

      // ── SCATTER PHYSICS: BUILDINGS SCATTER OUTWARD WHILE SCROLLING ──
      // Velocity decay
      stateRef.current.scrollScatterVelocity *= 0.90;

      // Combine position-driven convergence and velocity pulse
      const totalTargetScatter = Math.min(1.2, stateRef.current.targetScatter + stateRef.current.scrollScatterVelocity);

      // Silky smooth spring interpolation matching the Getty reference
      stateRef.current.scatterAmount += (totalTargetScatter - stateRef.current.scatterAmount) * 0.075;
      let scatter = stateRef.current.scatterAmount;
      if (scatter < 0.002) scatter = 0;

      // Update each 3D building's position & orientation in the InstancedMesh
      for (let i = 0; i < buildingsData.length; i++) {
        const b = buildingsData[i];

        // Building moves outward radially along its normal vector when scrolling
        dummyPos.copy(b.restPos).addScaledVector(b.scatterDir, scatter);

        // Building tumbles slightly during flight
        dummyQuat.copy(b.quat);
        if (scatter > 0.001) {
          tumbleRot.setFromAxisAngle(b.tumbleAxis, scatter * b.tumbleSpeed);
          dummyQuat.multiply(tumbleRot);
        }

        // Scale box to individual skyscraper dimensions
        dummyScale.set(b.width, b.height, b.depth);

        dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
        instancedMesh.setMatrixAt(i, dummyMatrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;

      // Render 3D Scene
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
  }, [buildingsData]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 w-full flex items-center justify-center my-8 sm:my-12 select-none overflow-hidden"
      aria-label="Interactive 3D Miniature City Globe with Real 3D Building Scatter Physics"
    >
      {/* ── 3D MINIATURE CITY GLOBE (CENTERED IN EMPTY SPACE) ── */}
      <div
        ref={mountRef}
        className="relative w-full h-[620px] sm:h-[720px] lg:h-[800px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
        title="Scroll to scatter 3D buildings outward or drag to rotate the miniature city globe"
      >
        {/* Ambient subtle center glow behind globe */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="size-[440px] sm:size-[560px] rounded-full bg-radial from-amber-500/[0.05] via-zinc-400/[0.02] to-transparent blur-3xl" />
        </div>
      </div>
    </div>
  );
}

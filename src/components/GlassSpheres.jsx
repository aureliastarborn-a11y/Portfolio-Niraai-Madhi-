import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GlassSpheres() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lighting for glass refraction
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x8b5cf6, 3); // Violet
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 2.5); // Blue
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xec4899, 3, 10); // Pink
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // Glass Material with physical transmission
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      roughness: 0.12,
      transmission: 0.92,
      thickness: 1.2,
      ior: 1.5,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      transparent: true,
      opacity: 0.85,
    });

    // Create multiple floating glass spheres with different sizes
    const spheresData = [
      { radius: 1.35, pos: [1.6, 0.4, 0], speed: 0.003, floatSpeed: 0.0015, phase: 0 },
      { radius: 0.85, pos: [-2.2, -0.6, 0.5], speed: 0.004, floatSpeed: 0.002, phase: 2 },
      { radius: 0.55, pos: [-1.2, 1.6, -0.5], speed: 0.005, floatSpeed: 0.0025, phase: 4 },
      { radius: 0.45, pos: [2.5, -1.2, -0.8], speed: 0.004, floatSpeed: 0.0018, phase: 1.5 },
      { radius: 0.35, pos: [0.1, -1.8, 0.8], speed: 0.006, floatSpeed: 0.003, phase: 3.2 }
    ];

    const meshes = spheresData.map((data) => {
      const geometry = new THREE.SphereGeometry(data.radius, 48, 48);
      const mesh = new THREE.Mesh(geometry, glassMaterial.clone());
      mesh.position.set(data.pos[0], data.pos[1], data.pos[2]);
      scene.add(mesh);
      return { mesh, ...data, origY: data.pos[1], origX: data.pos[0] };
    });

    // Mouse tracking for interactive parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 1.5;
      targetMouseY = -y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Update spheres
      meshes.forEach((item) => {
        item.mesh.rotation.x += item.speed;
        item.mesh.rotation.y += item.speed * 0.8;
        
        // Floating sinusoidal motion + mouse parallax
        item.mesh.position.y = item.origY + Math.sin(elapsedTime * 1.5 + item.phase) * 0.25 + mouseY * 0.4;
        item.mesh.position.x = item.origX + Math.cos(elapsedTime * 1.2 + item.phase) * 0.15 + mouseX * 0.4;
      });

      // Subtle camera sway
      camera.position.x = mouseX * 0.5;
      camera.position.y = mouseY * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.95 }}
    />
  );
}

import React, { useRef, useState, useEffect } from 'react';

// Vertex shader
const vertexShaderSource = `
attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_blur;
varying vec2 v_position;
void main() {
  float blurRadius = min(u_blur, min(6.0, u_radius * 0.22));
  float padding = 1.0 + blurRadius * 1.35 / u_radius;
  v_position = a_position * padding;
  vec2 position = (u_center + v_position * u_radius) / u_resolution;
  gl_Position = vec4(position * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

// Base fragment shader routines
const baseFragCommon = `
precision highp float;
uniform sampler2D u_image;
uniform vec4 u_crop;
uniform vec2 u_aspect;
uniform float u_time;
uniform float u_radius;
uniform float u_blur;
uniform float u_opacity;
uniform float u_rotation;
varying vec2 v_position;

vec3 sampleImage(vec2 uv) {
  uv = (uv - 0.5) * u_aspect + 0.5;
  return texture2D(u_image, u_crop.xy + clamp(uv, 0.001, 0.999) * u_crop.zw).rgb;
}

vec4 glass(vec2 p) {
  float r = length(p);
  float alpha = 1.0 - smoothstep(1.0 - 1.5 / u_radius, 1.0, r);
  if (r >= 1.0) return vec4(0.0);
  float z = sqrt(max(0.0, 1.0 - r * r));
  vec3 normal = vec3(p, z);
  float edge = smoothstep(0.62, 1.0, r);
  float angle = atan(p.y, p.x);
  float wave = sin(angle * 5.0 + u_time * 0.65) * sin(angle * 3.0 - u_time * 0.4);
  vec2 lens = p / (1.0 + z * 1.4);
  lens += p * edge * wave * 0.045;
  float c = cos(u_rotation), s = sin(u_rotation);
  lens = mat2(c, -s, s, c) * lens;
  vec2 uv = lens * 0.5 + 0.5;
  float dispersion = edge * edge * 0.012;
  vec3 color = vec3(sampleImage(uv + p * dispersion).r,
                    sampleImage(uv).g,
                    sampleImage(uv - p * dispersion).b);
  float fresnel = pow(1.0 - z, 3.0);
  vec3 light = normalize(vec3(-0.55, -0.65, 0.7));
  float shine = pow(max(dot(normal, light), 0.0), 70.0);
  vec2 highlight = mat2(0.82, -0.57, 0.57, 0.82) * (p - vec2(-0.43, -0.58));
  float windowReflection = exp(-pow(abs(highlight.x) / 0.10, 4.0) - pow(abs(highlight.y) / 0.22, 4.0));
  float sideReflection = exp(-pow(abs(r - 0.91) / 0.035, 2.0))
                       * pow(max(dot(normalize(p + vec2(0.0001)), normalize(vec2(0.9, -0.3))), 0.0), 22.0);
  float rim = exp(-pow(abs(r - 0.963) / 0.018, 2.0));
  float innerRim = exp(-pow(abs(r - 0.927) / 0.019, 2.0));
  color *= 1.0 - (fresnel * 0.23 + innerRim * 0.13);
  color = mix(color, vec3(0.96, 0.98, 1.0), fresnel * 0.24);
  color += shine * 0.24 + rim * 0.16;
  color = mix(color, vec3(1.0), windowReflection * 0.38 + sideReflection * 0.26);
  return vec4(color * alpha, alpha);
}
`;

// Primary fragment shader with 25-tap blur
const primaryFragShader = `${baseFragCommon}
void main() {
  vec4 color;
  if (u_blur < 0.1) {
    color = glass(v_position);
  } else {
    float blurRadius = min(u_blur, min(6.0, u_radius * 0.22));
    float stepSize = blurRadius * 0.5 / u_radius;
    vec2 x = vec2(stepSize, 0.0);
    vec2 y = vec2(0.0, stepSize);

    color = glass(v_position - x * 2.0 - y * 2.0) * (1.0 / 256.0);
    color += glass(v_position - x - y * 2.0) * (4.0 / 256.0);
    color += glass(v_position - y * 2.0) * (6.0 / 256.0);
    color += glass(v_position + x - y * 2.0) * (4.0 / 256.0);
    color += glass(v_position + x * 2.0 - y * 2.0) * (1.0 / 256.0);

    color += glass(v_position - x * 2.0 - y) * (4.0 / 256.0);
    color += glass(v_position - x - y) * (16.0 / 256.0);
    color += glass(v_position - y) * (24.0 / 256.0);
    color += glass(v_position + x - y) * (16.0 / 256.0);
    color += glass(v_position + x * 2.0 - y) * (4.0 / 256.0);

    color += glass(v_position - x * 2.0) * (6.0 / 256.0);
    color += glass(v_position - x) * (24.0 / 256.0);
    color += glass(v_position) * (36.0 / 256.0);
    color += glass(v_position + x) * (24.0 / 256.0);
    color += glass(v_position + x * 2.0) * (6.0 / 256.0);

    color += glass(v_position - x * 2.0 + y) * (4.0 / 256.0);
    color += glass(v_position - x + y) * (16.0 / 256.0);
    color += glass(v_position + y) * (24.0 / 256.0);
    color += glass(v_position + x + y) * (16.0 / 256.0);
    color += glass(v_position + x * 2.0 + y) * (4.0 / 256.0);

    color += glass(v_position - x * 2.0 + y * 2.0) * (1.0 / 256.0);
    color += glass(v_position - x + y * 2.0) * (4.0 / 256.0);
    color += glass(v_position + y * 2.0) * (6.0 / 256.0);
    color += glass(v_position + x + y * 2.0) * (4.0 / 256.0);
    color += glass(v_position + x * 2.0 + y * 2.0) * (1.0 / 256.0);
  }
  gl_FragColor = color * u_opacity;
}
`;

// Atlas pre-pass shader
const atlasFragShader = `${baseFragCommon}
void main() {
  gl_FragColor = glass(v_position) * vec4(0.5, 0.5, 0.5, 1.0);
}
`;

// Atlas blur composite shader
const compositeFragShader = `
precision highp float;
uniform sampler2D u_image;
uniform vec2 u_atlasCenter;
uniform vec2 u_atlasScale;
uniform float u_radius;
uniform float u_blur;
uniform float u_opacity;
varying vec2 v_position;
vec4 sampleGlass(vec2 position) {
  return texture2D(u_image, u_atlasCenter + position * u_atlasScale);
}
void main() {
  vec4 color;
  if (u_blur < 0.1) {
    color = sampleGlass(v_position);
  } else {
    float blurRadius = min(u_blur, min(6.0, u_radius * 0.22));
    float stepSize = blurRadius * 0.5 / u_radius;
    vec2 x = vec2(stepSize, 0.0);
    vec2 y = vec2(0.0, stepSize);

    color = sampleGlass(v_position - x * 2.0 - y * 2.0) * (1.0 / 256.0);
    color += sampleGlass(v_position - x - y * 2.0) * (4.0 / 256.0);
    color += sampleGlass(v_position - y * 2.0) * (6.0 / 256.0);
    color += sampleGlass(v_position + x - y * 2.0) * (4.0 / 256.0);
    color += sampleGlass(v_position + x * 2.0 - y * 2.0) * (1.0 / 256.0);

    color += sampleGlass(v_position - x * 2.0 - y) * (4.0 / 256.0);
    color += sampleGlass(v_position - x - y) * (16.0 / 256.0);
    color += sampleGlass(v_position - y) * (24.0 / 256.0);
    color += sampleGlass(v_position + x - y) * (16.0 / 256.0);
    color += sampleGlass(v_position + x * 2.0 - y) * (4.0 / 256.0);

    color += sampleGlass(v_position - x * 2.0) * (6.0 / 256.0);
    color += sampleGlass(v_position - x) * (24.0 / 256.0);
    color += sampleGlass(v_position) * (36.0 / 256.0);
    color += sampleGlass(v_position + x) * (24.0 / 256.0);
    color += sampleGlass(v_position + x * 2.0) * (6.0 / 256.0);

    color += sampleGlass(v_position - x * 2.0 + y) * (4.0 / 256.0);
    color += sampleGlass(v_position - x + y) * (16.0 / 256.0);
    color += sampleGlass(v_position + y) * (24.0 / 256.0);
    color += sampleGlass(v_position + x + y) * (16.0 / 256.0);
    color += sampleGlass(v_position + x * 2.0 + y) * (4.0 / 256.0);

    color += sampleGlass(v_position - x * 2.0 + y * 2.0) * (1.0 / 256.0);
    color += sampleGlass(v_position - x + y * 2.0) * (4.0 / 256.0);
    color += sampleGlass(v_position + y * 2.0) * (6.0 / 256.0);
    color += sampleGlass(v_position + x + y * 2.0) * (4.0 / 256.0);
    color += sampleGlass(v_position + x * 2.0 + y * 2.0) * (1.0 / 256.0);
  }
  gl_FragColor = color * vec4(2.0, 2.0, 2.0, 1.0) * u_opacity;
}
`;

const UNIFORM_NAMES = [
  "resolution",
  "center",
  "radius",
  "image",
  "crop",
  "aspect",
  "time",
  "blur",
  "opacity",
  "rotation",
  "atlasCenter",
  "atlasScale"
];

export const ALL_SPHERE_IMAGES = [
  { src: "/images/sphere-textures/rocky-horizon.webp" },
  { src: "/images/sphere-textures/hillside-studio.webp" },
  { src: "/images/sphere-textures/folded-mesh.webp" },
  { src: "/images/sphere-textures/canyon-house.webp" },
  { src: "/images/sphere-textures/garden-terminals.webp" },
  { src: "/images/sphere-textures/cyan-terminals.webp" },
  { src: "/images/sphere-textures/ivory-sand.webp" },
  { src: "/images/sphere-textures/vaulted-library.webp" },
  { src: "/images/sphere-textures/midnight-water.webp" },
  { src: "/images/sphere-textures/curtain-sofa.webp" },
  { src: "/images/sphere-textures/garden-sculpture.webp" },
  { src: "/images/sphere-textures/skylit-corridor.webp" },
  { src: "/images/sphere-textures/steaming-crater.webp" },
  { src: "/images/sphere-textures/botanical-specimen.webp" },
  { src: "/images/sphere-textures/ornate-stonework.webp" },
  { src: "/images/sphere-textures/radiating-aperture.webp" },
  { src: "/images/sphere-textures/industrial-hall.webp" },
  { src: "/images/sphere-textures/curved-research-center.webp" },
  { src: "/images/sphere-textures/isometric-linework.webp" },
  { src: "/images/sphere-textures/colorful-facade.webp" },
  { src: "/images/sphere-textures/quiet-gallery.webp" },
  { src: "/images/sphere-textures/concrete-street.webp" },
  { src: "/images/sphere-textures/concrete-exhibition.webp" },
  { src: "/images/sphere-textures/columned-undercroft.webp" },
  { src: "/images/sphere-textures/analog-workstation.webp" },
  { src: "/images/sphere-textures/bird-release.webp" },
  { src: "/images/sphere-textures/green-city.webp" },
  { src: "/images/sphere-textures/neon-alley.webp" },
  { src: "/images/sphere-textures/skyward-grid.webp" },
  { src: "/images/sphere-textures/alpine-basin.webp" }
];

// 3D Fibonacci sphere distribution generator
export const generateSphericalCoords = (count, rng = Math.random) => {
  const phi = Math.PI * (3 - Math.sqrt(5));
  const r = rng() * Math.PI * 2;
  const n = (rng() - 0.5) * 0.5;
  const cosN = Math.cos(n);
  const sinN = Math.sin(n);
  return Array.from({ length: count }, (_, idx) => {
    const l = 1 - ((idx + 0.5) / count) * 2;
    const u = Math.sqrt(Math.max(0, 1 - l * l));
    const h = idx * phi + r + (rng() - 0.5) * 0.08;
    const c = 0.8 + 0.2 * rng();
    const d = c * u * Math.cos(h);
    const p = c * u * Math.sin(h);
    return {
      x: d,
      y: c * (l * cosN - p * sinN),
      z: c * (l * sinN + p * cosN),
      size: 0.94 + 0.12 * rng(),
      phase: rng() * Math.PI * 2
    };
  });
};

// Fixed deterministic distribution for fallback
const FIXED_SEED_RNG = (() => {
  let s = 0x21a11ec7;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
})();

export const FIXED_SPHERICAL_COORDS = generateSphericalCoords(ALL_SPHERE_IMAGES.length, FIXED_SEED_RNG);

export const HERO_RING_INDICES = [0, 3, 7, 10, 13, 18, 22, 29];
export const HERO_RING_IMAGES = HERO_RING_INDICES.map(i => ALL_SPHERE_IMAGES[i]);

const clamp = (v) => Math.max(0, Math.min(1, v));
const HALF_PI = Math.PI / 2;
const THIRD_PI = Math.PI / 3;
const ringPhaseOffset = (len) => ((len - 1) / len) * Math.PI * 2 + THIRD_PI + Math.PI / 24;

export function calcRingPosition(idx, total, width, height, timeMs, prefersReduced, parentHeight = height, scrollRot = 0) {
  const ringRadius = Math.min(320, 0.37 * width, 0.38 * height);
  const baseSphereRadius = Math.max(28, Math.min(64, 0.27 * ringRadius));
  const progress = prefersReduced ? 1 : clamp(timeMs / 2100);
  const angleSpread = Math.max(0, ringPhaseOffset(total) * (1 - Math.pow(1 - progress, 3)) - (idx / total) * Math.PI * 2);
  const smoothAngle = clamp(angleSpread / THIRD_PI);
  const ease = smoothAngle * smoothAngle * (3 - 2 * smoothAngle);
  const angle = HALF_PI + angleSpread + (prefersReduced ? 0 : scrollRot);
  return {
    x: width / 2 + Math.cos(angle) * ringRadius,
    y: height / 2 + Math.sin(angle) * ringRadius + (parentHeight - height / 2 + 2 * baseSphereRadius - ringRadius) * (1 - ease),
    radius: baseSphereRadius * (0.72 + 0.28 * ease),
    opacity: clamp(4 * angleSpread)
  };
}

function isFullyVisible(s, w, h) {
  return s.opacity === 1 && s.x - s.radius >= 0 && s.x + s.radius <= w && s.y - s.radius >= 0 && s.y + s.radius <= h;
}

const lerp = (a, b, t) => a + (b - a) * t;
const smoothstepQuad = (t) => t * t * (3 - 2 * t);
const FRAME_INTERVAL = 1000 / 60;
const ANGULAR_VELOCITY = Math.PI / 60; // 3 deg/sec rotation

export default function GlassSpheres({
  images = ALL_SPHERE_IMAGES,
  variant = 'field',
  active = true,
  coverRef,
  scrollRotation = 0,
  onContained
}) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  const scrollRotRef = useRef(0);
  const requestFrameFn = useRef(() => {});
  const fallbackAnimateFn = useRef(() => {});
  const onContainedRef = useRef(onContained);
  const [status, setStatus] = useState('loading');
  const [, setRestoredCount] = useState(0);

  useEffect(() => {
    onContainedRef.current = onContained;
  }, [onContained]);

  useEffect(() => {
    activeRef.current = active;
    if (active) {
      requestFrameFn.current();
      fallbackAnimateFn.current();
    }
  }, [active]);

  useEffect(() => {
    if (scrollRotation === undefined || scrollRotation === null) return;
    const updateRot = (val) => {
      scrollRotRef.current = val;
      requestFrameFn.current();
      fallbackAnimateFn.current();
    };

    if (typeof scrollRotation === 'number') {
      updateRot(scrollRotation);
    } else if (scrollRotation && typeof scrollRotation.get === 'function') {
      updateRot(scrollRotation.get());
      if (typeof scrollRotation.on === 'function') {
        return scrollRotation.on('change', updateRot);
      }
    }
  }, [scrollRotation]);

  // Context restored
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleRestore = () => setRestoredCount((c) => c + 1);
    canvas.addEventListener('webglcontextrestored', handleRestore);
    return () => canvas.removeEventListener('webglcontextrestored', handleRestore);
  }, []);

  // WebGL Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setStatus('loading');

    let gl;
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power'
      });
    } catch (err) {
      console.warn('WebGL unavailable, using fallback', err);
      setStatus('fallback');
      return;
    }

    if (!gl) {
      setStatus('fallback');
      return;
    }

    let isDisposed = false;
    let animFrameId = 0;
    let isTexturesLoaded = false;
    let clientW = 0;
    let clientH = 0;
    let fieldH = 0;
    let parentH = 0;
    let currentRot = 0;
    let elapsedMs = 0;
    let containedFired = false;
    let lastTime = 0;
    let frameThrottle = 0;
    let elapsedSec = 0;
    let isIntersecting = true;

    const baseCoords = generateSphericalCoords(images.length);
    const rotatedCoords = baseCoords.map(({ x, y, z }) => ({ x, y, z }));
    const sortedIndices = images.map((_, i) => i);
    let lastAngle = NaN;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const textures = [];
    const imageElements = [];
    const aspectRatios = [];

    // Setup WebGL Pipeline
    let renderer;
    try {
      renderer = ((glCtx, count) => {
        const programs = [];
        const shaders = [];
        const geomBuffer = glCtx.createBuffer();
        let atlasTexture = null;
        let atlasFbo = null;
        let atlasTileSize = 0;
        const atlasCols = Math.max(1, Math.ceil(Math.sqrt(count)));
        let atlasRows = 0;
        const maxTexSize = glCtx.getParameter(glCtx.MAX_TEXTURE_SIZE);
        let atlasSupported = true;

        const dispose = () => {
          programs.forEach((p) => glCtx.deleteProgram(p));
          shaders.forEach((s) => glCtx.deleteShader(s));
          if (geomBuffer) glCtx.deleteBuffer(geomBuffer);
          if (atlasTexture) glCtx.deleteTexture(atlasTexture);
          if (atlasFbo) glCtx.deleteFramebuffer(atlasFbo);
        };

        const compileProg = (fragSrc) => {
          const prog = glCtx.createProgram();
          if (!prog) throw new Error('Failed to create WebGL program');
          programs.push(prog);

          const vShader = glCtx.createShader(glCtx.VERTEX_SHADER);
          shaders.push(vShader);
          glCtx.shaderSource(vShader, vertexShaderSource);
          glCtx.compileShader(vShader);
          if (!glCtx.getShaderParameter(vShader, glCtx.COMPILE_STATUS)) {
            throw new Error(glCtx.getShaderInfoLog(vShader) || 'Vertex shader compilation error');
          }
          glCtx.attachShader(prog, vShader);

          const fShader = glCtx.createShader(glCtx.FRAGMENT_SHADER);
          shaders.push(fShader);
          glCtx.shaderSource(fShader, fragSrc);
          glCtx.compileShader(fShader);
          if (!glCtx.getShaderParameter(fShader, glCtx.COMPILE_STATUS)) {
            throw new Error(glCtx.getShaderInfoLog(fShader) || 'Fragment shader compilation error');
          }
          glCtx.attachShader(prog, fShader);

          glCtx.bindAttribLocation(prog, 0, 'a_position');
          glCtx.linkProgram(prog);
          if (!glCtx.getProgramParameter(prog, glCtx.LINK_STATUS)) {
            throw new Error(glCtx.getProgramInfoLog(prog) || 'Shader link error');
          }

          const uniforms = Object.fromEntries(UNIFORM_NAMES.map((u) => [u, glCtx.getUniformLocation(prog, `u_${u}`)]));
          return { program: prog, uniforms };
        };

        if (!geomBuffer) throw new Error('Geometry buffer creation failed');
        const primaryProg = compileProg(primaryFragShader);
        let atlasProg = null;
        let compositeProg = null;

        glCtx.bindBuffer(glCtx.ARRAY_BUFFER, geomBuffer);
        glCtx.bufferData(
          glCtx.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
          glCtx.STATIC_DRAW
        );
        glCtx.enableVertexAttribArray(0);
        glCtx.vertexAttribPointer(0, 2, glCtx.FLOAT, false, 0, 0);
        glCtx.blendFunc(glCtx.ONE, glCtx.ONE_MINUS_SRC_ALPHA);
        glCtx.clearColor(0, 0, 0, 0);

        const bindSphereUniforms = (u, item) => {
          glCtx.uniform1f(u.radius, item.radius);
          glCtx.uniform1f(u.blur, item.blur);
          glCtx.uniform1f(u.opacity, item.opacity);
          glCtx.uniform1f(u.rotation, item.rotation);
          glCtx.uniform4fv(u.crop, item.crop);
          glCtx.uniform2fv(u.aspect, item.aspect);
          glCtx.bindTexture(glCtx.TEXTURE_2D, item.texture);
        };

        return {
          render: (items, w, h, baseRadius, timeVal, scissorTop, scissorBottom) => {
            const blurredCount = items.reduce((acc, it) => acc + (it.blur >= 1 ? 1 : 0), 0);
            let hasAtlas = false;
            glCtx.disable(glCtx.SCISSOR_TEST);

            if (blurredCount > 0) {
              try {
                hasAtlas = ((radiusVal, blurCount) => {
                  if (!atlasSupported) return false;
                  const tileSize = Math.ceil((1.06 * radiusVal + 10) * 6);
                  const rows = Math.max(atlasRows, Math.ceil(blurCount / atlasCols));
                  if (Math.max(atlasCols, rows) * tileSize > maxTexSize) return false;

                  if (!atlasProg || !compositeProg) {
                    atlasProg = compileProg(atlasFragShader);
                    compositeProg = compileProg(compositeFragShader);
                    atlasTexture = glCtx.createTexture();
                    atlasFbo = glCtx.createFramebuffer();
                    if (!atlasTexture || !atlasFbo) throw new Error('Atlas creation failed');

                    glCtx.bindTexture(glCtx.TEXTURE_2D, atlasTexture);
                    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.LINEAR);
                    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.LINEAR);
                    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
                    glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
                    glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, atlasFbo);
                    glCtx.framebufferTexture2D(
                      glCtx.FRAMEBUFFER,
                      glCtx.COLOR_ATTACHMENT0,
                      glCtx.TEXTURE_2D,
                      atlasTexture,
                      0
                    );
                  }

                  if (atlasTileSize !== tileSize || atlasRows !== rows) {
                    atlasTileSize = tileSize;
                    atlasRows = rows;
                    glCtx.bindTexture(glCtx.TEXTURE_2D, atlasTexture);
                    glCtx.texImage2D(
                      glCtx.TEXTURE_2D,
                      0,
                      glCtx.RGBA,
                      atlasCols * tileSize,
                      rows * tileSize,
                      0,
                      glCtx.RGBA,
                      glCtx.UNSIGNED_BYTE,
                      null
                    );
                    glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, atlasFbo);
                    if (glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER) !== glCtx.FRAMEBUFFER_COMPLETE) {
                      throw new Error('Atlas framebuffer incomplete');
                    }
                  }
                  return true;
                })(baseRadius, blurredCount);
              } catch {
                atlasSupported = false;
                if (atlasTexture) glCtx.deleteTexture(atlasTexture);
                if (atlasFbo) glCtx.deleteFramebuffer(atlasFbo);
                atlasTexture = null;
                atlasFbo = null;
              }
            }

            if (hasAtlas && atlasProg) {
              glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, atlasFbo);
              glCtx.disable(glCtx.BLEND);
              glCtx.clear(glCtx.COLOR_BUFFER_BIT);
              glCtx.useProgram(atlasProg.program);
              const u = atlasProg.uniforms;
              const quarterSize = atlasTileSize / 3;
              glCtx.uniform2f(u.resolution, quarterSize, quarterSize);
              glCtx.uniform2f(u.center, quarterSize / 2, quarterSize / 2);
              glCtx.uniform1f(u.time, timeVal);

              let atlasIdx = 0;
              items.forEach((it) => {
                if (it.blur < 1) return;
                const slot = atlasIdx++;
                glCtx.viewport(
                  (slot % atlasCols) * atlasTileSize,
                  Math.floor(slot / atlasCols) * atlasTileSize,
                  atlasTileSize,
                  atlasTileSize
                );
                bindSphereUniforms(u, it);
                glCtx.drawArrays(glCtx.TRIANGLES, 0, 6);
              });
            }

            glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, null);
            glCtx.viewport(0, 0, glCtx.canvas.width, glCtx.canvas.height);
            glCtx.clear(glCtx.COLOR_BUFFER_BIT);
            glCtx.enable(glCtx.BLEND);

            const scaleRatio = glCtx.canvas.height / h;
            const scissorBottomPx = Math.floor((h - scissorBottom) * scaleRatio);
            glCtx.enable(glCtx.SCISSOR_TEST);
            glCtx.scissor(
              0,
              scissorBottomPx,
              glCtx.canvas.width,
              Math.ceil((h - scissorTop) * scaleRatio) - scissorBottomPx
            );

            let activeProg = null;
            let compositeSlot = 0;

            items.forEach((it) => {
              const useAtlas = hasAtlas && it.blur >= 1 && compositeProg;
              const curProg = useAtlas ? compositeProg : primaryProg;
              const u = curProg.uniforms;

              if (activeProg !== curProg) {
                activeProg = curProg;
                glCtx.useProgram(curProg.program);
                glCtx.uniform2f(u.resolution, w, h);
                glCtx.uniform1f(u.time, timeVal);
              }

              glCtx.uniform2f(u.center, it.x, it.y);

              if (curProg === compositeProg) {
                const slot = compositeSlot++;
                glCtx.uniform1f(u.radius, it.radius);
                glCtx.uniform1f(u.blur, it.blur);
                glCtx.uniform1f(u.opacity, it.opacity);
                glCtx.uniform2f(
                  u.atlasCenter,
                  (slot % atlasCols + 0.5) / atlasCols,
                  (Math.floor(slot / atlasCols) + 0.5) / atlasRows
                );
                glCtx.uniform2f(
                  u.atlasScale,
                  (3 * it.radius) / (atlasCols * atlasTileSize),
                  (-3 * it.radius) / (atlasRows * atlasTileSize)
                );
                glCtx.bindTexture(glCtx.TEXTURE_2D, atlasTexture);
              } else {
                bindSphereUniforms(u, it);
              }

              glCtx.drawArrays(glCtx.TRIANGLES, 0, 6);
            });

            glCtx.disable(glCtx.SCISSOR_TEST);
          },
          dispose
        };
      })(gl, images.length);
    } catch (err) {
      console.warn('Glass renderer creation error, falling back:', err);
      setStatus('fallback');
      return;
    }

    const sphereStateList = images.map((it) => ({
      x: 0,
      y: 0,
      radius: 0,
      blur: 0,
      opacity: 1,
      rotation: 0,
      texture: null,
      crop: it.crop || [0, 0, 1, 1],
      aspect: [1, 1]
    }));

    const renderList = [];

    const frameLoop = (timestamp) => {
      animFrameId = 0;
      if (
        isDisposed ||
        !activeRef.current ||
        !isTexturesLoaded ||
        gl.isContextLost() ||
        document.hidden ||
        !isIntersecting ||
        clientW === 0 ||
        clientH === 0
      ) {
        return;
      }

      if (timestamp - frameThrottle < FRAME_INTERVAL - 0.5) {
        animFrameId = requestAnimationFrame(frameLoop);
        return;
      }
      frameThrottle = timestamp;

      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      const rotLerpFactor = 1 - Math.exp(-10 * dt);
      const targetRot = motionQuery.matches ? 0 : scrollRotRef.current;
      const lerpedRot = lerp(currentRot, targetRot, rotLerpFactor);
      currentRot =
        motionQuery.matches || variant === 'ring' || Math.abs(lerpedRot - targetRot) < 0.001
          ? targetRot
          : lerpedRot;

      elapsedMs += dt * 1000;
      if (!motionQuery.matches) {
        elapsedSec += dt;
      }

      const totalAngle = currentRot + (variant !== 'field' || motionQuery.matches ? 0 : elapsedSec * ANGULAR_VELOCITY);
      const activeHeight = variant === 'field' ? fieldH : clientH;
      const baseRadius = Math.max(24, Math.min(54, 0.06 * Math.min(clientW, activeHeight)));

      // 3D Orbital rotation calculation
      if (totalAngle !== lastAngle) {
        const sinA = Math.sin(totalAngle);
        const cosA = Math.cos(totalAngle);
        baseCoords.forEach((coord, idx) => {
          const rotCoord = rotatedCoords[idx];
          rotCoord.x = coord.x * cosA + coord.z * sinA;
          rotCoord.z = -coord.x * sinA + coord.z * cosA;
        });
        // Depth-sort Painter's algorithm
        sortedIndices.sort((a, b) => rotatedCoords[a].z - rotatedCoords[b].z);
        lastAngle = totalAngle;
      }

      let scissorTop = 0;
      let scissorBottom = clientH;
      let coverLeft = 0, coverRight = 0, coverTop = 0, coverBottom = 0;

      if (variant === 'field') {
        const canvasRect = canvas.getBoundingClientRect();
        const parentRect = canvas.parentElement?.getBoundingClientRect();
        const coverRect = coverRef?.current?.getBoundingClientRect();

        if (coverRect) {
          coverLeft = coverRect.left - canvasRect.left + 32;
          coverRight = coverRect.right - canvasRect.left - 32;
          coverTop = coverRect.top - canvasRect.top + 32;
          coverBottom = coverRect.bottom - canvasRect.top - 32;
        }

        scissorTop = Math.max(0, -canvasRect.top, (parentRect?.top ?? canvasRect.top) - canvasRect.top);
        if (scissorTop >= (scissorBottom = clientH)) return;
      }

      renderList.length = 0;
      let allSettled = true;

      for (const idx of sortedIndices) {
        const imgDef = images[idx];
        const coord = baseCoords[idx];
        const rotCoord = rotatedCoords[idx];

        const normZ = clamp((rotCoord.z + 1) / 2);
        const depthScale = lerp(0.56, 1.36, normZ);
        const bobOffset = motionQuery.matches ? 0 : Math.sin(0.45 * elapsedSec + coord.phase) * (1.5 + 1.8 * coord.size);

        const ringPos =
          variant === 'ring'
            ? calcRingPosition(idx, images.length, clientW, parentH, elapsedMs, motionQuery.matches, clientH, totalAngle)
            : null;

        if (ringPos && !isFullyVisible(ringPos, clientW, parentH)) {
          allSettled = false;
        }

        const sphereRadius = ringPos?.radius ?? baseRadius * coord.size * depthScale;
        const sphereX = ringPos?.x ?? clientW / 2 + rotCoord.x * clientW * 0.48;
        const sphereY = ringPos?.y ?? activeHeight / 2 + rotCoord.y * activeHeight * 0.47 + bobOffset;
        const blurAmount = ringPos ? 0 : smoothstepQuad(clamp((0.5 - normZ) / 0.48));

        const state = sphereStateList[idx];
        state.x = sphereX;
        state.y = sphereY;
        state.radius = sphereRadius;
        state.blur = 6 * blurAmount;
        state.opacity = ringPos?.opacity ?? 1;
        state.rotation = (imgDef.rotation ?? 0) + (motionQuery.matches ? 0 : 0.012 * Math.sin(0.25 * elapsedSec + idx));
        state.texture = textures[idx];
        state.aspect = aspectRatios[idx];

        const boundPadding = sphereRadius + 1.35 * Math.min(state.blur, 0.22 * sphereRadius);
        const insideCover =
          sphereX - boundPadding >= coverLeft &&
          sphereX + boundPadding <= coverRight &&
          sphereY - boundPadding >= coverTop &&
          sphereY + boundPadding <= coverBottom;

        if (
          !insideCover &&
          state.opacity > 0 &&
          sphereX + boundPadding > 0 &&
          sphereX - boundPadding < clientW &&
          sphereY + boundPadding > scissorTop &&
          sphereY - boundPadding < scissorBottom
        ) {
          renderList.push(state);
        }
      }

      try {
        renderer.render(renderList, clientW, clientH, baseRadius, motionQuery.matches ? 0 : elapsedSec, scissorTop, scissorBottom);
      } catch (err) {
        cleanup();
        console.warn('WebGL render runtime error, falling back:', err);
        setStatus('fallback');
        return;
      }

      const ringDone = variant === 'ring' && (motionQuery.matches || elapsedMs >= 2100);
      if (allSettled && !containedFired) {
        containedFired = true;
        onContainedRef.current?.();
      }

      if (!motionQuery.matches && (variant === 'field' || !ringDone)) {
        animFrameId = requestAnimationFrame(frameLoop);
      }
    };

    const triggerRender = () => {
      if (
        animFrameId ||
        !isTexturesLoaded ||
        !activeRef.current ||
        isDisposed ||
        document.hidden ||
        !isIntersecting ||
        gl.isContextLost()
      ) {
        return;
      }
      lastTime = performance.now();
      frameThrottle = 0;
      animFrameId = requestAnimationFrame(frameLoop);
    };

    requestFrameFn.current = triggerRender;

    const handleResize = () => {
      clientW = canvas.clientWidth;
      clientH = canvas.clientHeight;
      const revealEl = canvas.closest('[data-personal-site]')?.querySelector('[data-footer-reveal]');
      fieldH = variant === 'field' && revealEl ? 1.5 * revealEl.clientHeight : clientH;
      parentH = canvas.parentElement?.clientHeight ?? clientH;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(2000000 / Math.max(1, clientW * clientH)));
      const wPx = Math.max(1, Math.floor(clientW * dpr));
      const hPx = Math.max(1, Math.floor(clientH * dpr));

      if (canvas.width !== wPx || canvas.height !== hPx) {
        canvas.width = wPx;
        canvas.height = hPx;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      triggerRender();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      } else {
        triggerRender();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        triggerRender();
      } else {
        cancelAnimationFrame(animFrameId);
        animFrameId = 0;
      }
    });
    observer.observe(canvas);

    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(canvas);

    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', triggerRender);

    const handleContextLost = (e) => {
      e.preventDefault();
      cleanup();
      setStatus('fallback');
    };

    const cleanup = () => {
      if (isDisposed) return;
      isDisposed = true;
      isTexturesLoaded = false;
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      resizeObs.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', triggerRender);
      requestFrameFn.current = () => {};

      imageElements.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.removeAttribute('src');
      });
      textures.forEach((tex) => gl.deleteTexture(tex));
      renderer?.dispose();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    handleResize();

    // Load textures
    Promise.all(
      images.map(
        (imgDef, i) =>
          new Promise((resolve, reject) => {
            const img = new window.Image();
            imageElements.push(img);
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              if (isDisposed) return resolve();
              try {
                const tex = gl.createTexture();
                if (!tex) return reject(new Error('Failed to create WebGL texture'));
                textures[i] = tex;
                const aspect = img.naturalWidth / img.naturalHeight;
                aspectRatios[i] = imgDef.crop
                  ? [1, 1]
                  : [Math.min(1, 1 / aspect), Math.min(1, aspect)];

                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                resolve();
              } catch (e) {
                reject(e);
              }
            };
            img.onerror = () => reject(new Error(`Failed to load texture ${imgDef.src}`));
            img.src = imgDef.src;
          })
      )
    )
      .then(() => {
        if (!isDisposed) {
          isTexturesLoaded = true;
          setStatus('ready');
          triggerRender();
        }
      })
      .catch((err) => {
        if (!isDisposed) {
          cleanup();
          console.warn('Glass texture loading error, falling back:', err);
          setStatus('fallback');
        }
      });

    return cleanup;
  }, [images, variant, coverRef]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="sphere-canvas pointer-events-none absolute inset-0 z-0 size-full"
        tabIndex={-1}
        aria-hidden="true"
        style={{ opacity: status === 'ready' ? 1 : 0 }}
      />
      {status === 'fallback' && (
        <div
          className={`sphere-fallback pointer-events-none absolute inset-0 z-0 overflow-hidden ${
            variant === 'ring' ? 'sphere-fallback-ring' : ''
          }`}
          aria-hidden="true"
        >
          {images.map((item, idx) => {
            const count = images.length;
            const angle =
              HALF_PI + ringPhaseOffset(count) - (idx / count) * Math.PI * 2;
            const coord =
              variant === 'ring'
                ? { x: Math.cos(angle), y: Math.sin(angle), z: 0.4, size: 1 }
                : FIXED_SPHERICAL_COORDS[idx % FIXED_SPHERICAL_COORDS.length];
            const normZ = (coord.z + 1) / 2;
            const dist = Math.max(1, 0.28 / Math.max(Math.hypot(coord.x, coord.y), 0.001));
            const scale = variant === 'ring' ? 1 : coord.size * lerp(0.56, 1.36, normZ);
            const blur = variant === 'ring' ? 0 : 8 * smoothstepQuad(clamp((0.5 - normZ) / 0.48));
            const yPercent = 50 + coord.y * dist * (variant === 'ring' ? 50 : 47);
            const xPercent = 50 + coord.x * dist * (variant === 'ring' ? 50 : 48);

            return (
              <img
                key={`${item.src}-${idx}`}
                src={item.src}
                alt=""
                width={96}
                height={96}
                draggable="false"
                style={{
                  position: 'absolute',
                  left: `${xPercent.toFixed(4)}%`,
                  top: `${(variant === 'field' ? 0.75 * yPercent : yPercent).toFixed(4)}%`,
                  transform: `scale(${scale.toFixed(4)}) rotate(${item.rotation ?? 0}rad)`,
                  filter: `blur(${blur.toFixed(4)}px)`,
                  userSelect: 'none'
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

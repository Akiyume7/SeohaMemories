import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GalaxyCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    // Setup
    const canvas = canvasRef.current;
    const count = 128 * 128;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2, 3);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const orbit = new OrbitControls(camera, canvas);
    orbit.enableDamping = true;
    // Star alpha texture
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = ctx.canvas.height = 32;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 32, 32);
    let grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0.0, '#fff');
    grd.addColorStop(1.0, '#000');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.rect(15, 0, 2, 32); ctx.fill();
    ctx.beginPath(); ctx.rect(0, 15, 32, 2); ctx.fill();
    grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0.1, '#ffff');
    grd.addColorStop(0.6, '#0000');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 32, 32);
    const alphaMap = new THREE.CanvasTexture(ctx.canvas);
    // Galaxy geometry
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyPosition = new Float32Array(count * 3);
    const galaxySeed = new Float32Array(count * 3);
    const galaxySize = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      galaxyPosition[i * 3] = i / count;
      galaxySeed[i * 3 + 0] = Math.random();
      galaxySeed[i * 3 + 1] = Math.random();
      galaxySeed[i * 3 + 2] = Math.random();
      galaxySize[i] = Math.random() * 2 + 0.5;
    }
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPosition, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(galaxySize, 1));
    galaxyGeometry.setAttribute('seed', new THREE.BufferAttribute(galaxySeed, 3));
    // Colors
    const innColor = new THREE.Color('#ff584d');
    const outColor = new THREE.Color('#ffffff');
    // Shader material
    const galaxyMaterial = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: renderer.getPixelRatio() },
        uBranches: { value: 4 },
        uRadius: { value: 3.49 },
        uSpin: { value: Math.PI * 0.25 },
        uRandomness: { value: 0.35 },
        uAlphaMap: { value: alphaMap },
        uColorInn: { value: innColor },
        uColorOut: { value: outColor },
      },
      vertexShader: `
        precision highp float;
        attribute vec3 position;
        attribute float size;
        attribute vec3 seed;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform float uTime;
        uniform float uSize;
        uniform float uBranches;
        uniform float uRadius;
        uniform float uSpin;
        uniform float uRandomness;
        varying float vDistance;
        #define PI  3.14159265359
        #define PI2 6.28318530718
        float random (vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        vec3 scatter (vec3 seed) {
          float u = random(seed.xy);
          float v = random(seed.yz);
          float theta = u * 6.28318530718;
          float phi = acos(2.0 * v - 1.0);
          float sinTheta = sin(theta);
          float cosTheta = cos(theta);
          float sinPhi = sin(phi);
          float cosPhi = cos(phi);
          float x = sinPhi * cosTheta;
          float y = sinPhi * sinTheta;
          float z = cosPhi;
          return vec3(x, y, z);
        }
        void main() {
          vec3 p = position;
          float st = sqrt(p.x);
          float qt = p.x * p.x;
          float mt = mix(st, qt, p.x);
          float angle = qt * uSpin * (2.0 - sqrt(1.0 - qt));
          float branchOffset = (PI2 / uBranches) * floor(seed.x * uBranches);
          p.x = position.x * cos(angle + branchOffset) * uRadius;
          p.z = position.x * sin(angle + branchOffset) * uRadius;
          p += scatter(seed) * random(seed.zx) * uRandomness * mt;
          p.y *= 0.5 + qt * 0.5;
          vec3 temp = p;
          float ac = cos(-uTime * (2.0 - st) * 0.5);
          float as = sin(-uTime * (2.0 - st) * 0.5);
          p.x = temp.x * ac - temp.z * as;
          p.z = temp.x * as + temp.z * ac;
          vDistance = mt;
          vec4 mvp = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvp;
          gl_PointSize = (10.0 * size * uSize) / -mvp.z;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform vec3 uColorInn;
        uniform vec3 uColorOut;
        uniform sampler2D uAlphaMap;
        varying float vDistance;
        #define PI  3.14159265359
        void main() {
          vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
          float a = texture2D(uAlphaMap, uv).g;
          if (a < 0.1) discard;
          vec3 color = mix(uColorInn, uColorOut, vDistance);
          float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);
          color = max(color, vec3(c));
          gl_FragColor = vec4(color, a);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxy);
    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      galaxyMaterial.uniforms.uTime.value += 0.001;
      orbit.update();
      renderer.render(scene, camera);
    };
    animate();
    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      galaxyGeometry.dispose();
      alphaMap.dispose();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full h-full fixed inset-0 z-0 pointer-events-none" />
  );
};

export default GalaxyCanvas; 
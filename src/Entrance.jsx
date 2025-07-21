import React from 'react';
import * as THREE from 'three';
import { BookOpen } from 'lucide-react';
import FloatingParticles from './FloatingParticles';
import ThemeToggle from './ThemeToggle';
import GalaxyCanvas from './GalaxyCanvas';

const MagicalOrbsCanvas = () => {
  const canvasRef = React.useRef();
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10);
    // Glowing orbs
    const orbGroup = new THREE.Group();
    const orbColors = [0x8b5cf6, 0xff69b4, 0x00bfff];
    for (let i = 0; i < 3; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.7 + i * 0.2, 32, 32);
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: orbColors[i],
        transparent: true,
        opacity: 0.7,
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(Math.cos((i / 3) * Math.PI * 2) * 1.2, 0, Math.sin((i / 3) * Math.PI * 2) * 1.2);
      orbGroup.add(orb);
      // Add glow
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: orbColors[i],
        transparent: true,
        opacity: 0.25,
      });
      const glow = new THREE.Mesh(new THREE.SphereGeometry(1.2 + i * 0.3, 32, 32), glowMaterial);
      glow.position.copy(orb.position);
      orbGroup.add(glow);
    }
    scene.add(orbGroup);
    // Animation
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      orbGroup.rotation.y += 0.002;
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
    };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-10 pointer-events-none" />;
};

const Entrance = ({ darkMode, setDarkMode, isMobile, handleOrbClick }) => (
  <div className="min-h-screen transition-all duration-1000 bg-gradient-to-br from-blue-100 via-pink-100 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    {/* Theme toggle */}
    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} />
    </div>
    {/* Galaxy background */}
    <GalaxyCanvas />
    {/* Magical orbs at center */}
    <MagicalOrbsCanvas />
    {/* Sparkle particles */}
    <FloatingParticles isMobile={isMobile} />
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
      <div 
        className="relative cursor-pointer transform transition-all duration-700 hover:scale-105 group mb-8"
        onClick={handleOrbClick}
      >
        <div className="flex flex-col items-center pt-4 pb-4">
          <div className="inline-block px-8 py-4 rounded-2xl shadow-lg border transition-all duration-300 font-bold text-4xl md:text-5xl backdrop-blur-md
            bg-white/80 dark:bg-slate-800/80 border-white/40 dark:border-white/20 text-blue-900 dark:text-white">
            Seoha Memories
          </div>
        </div>
        {/* Glassmorphic Enter button */}
        <div className="flex justify-center">
          <button
            className={`px-6 py-3 md:px-10 md:py-4 rounded-2xl shadow-lg border transition-all duration-300 font-bold text-lg md:text-2xl backdrop-blur-md
              ${darkMode
                ? 'bg-slate-800/80 border-white/20 text-white hover:bg-slate-700/90'
                : 'bg-white/80 border-white/40 text-blue-900 hover:bg-white/90'}`}
            style={{ fontSize: isMobile ? '1.2rem' : '2rem', letterSpacing: '0.01em' }}
            onClick={handleOrbClick}
          >
            🎉1 Year Anniversary🎈
          </button>
        </div>
      </div>
      <div className="text-center">
        <div className="inline-flex items-center px-4 md:px-8 py-3 md:py-4 rounded-full bg-white/40 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700 shadow-lg">
          <BookOpen className="mr-2 md:mr-3 text-blue-400" size={isMobile ? 20 : 24} />
          <span className="text-sm md:text-lg text-blue-900 dark:text-blue-200 font-medium">
            Tap to explore the memory💖
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Entrance; 
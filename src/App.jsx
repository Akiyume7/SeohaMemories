import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Moon, Sun, ChevronLeft, ChevronRight, BookOpen, User, Clock, Hash } from 'lucide-react';

const SeohaMemories = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const magicalOrbsRef = useRef([]);
  const particleSystemRef = useRef();
  const animationIdRef = useRef();

  // Memory cards with structured data
  const memoryCards = [
    {
      name: "Seoha",
      message: "Welcome to your magical universe! Every memory is a constellation waiting to be discovered. This cosmic collection holds the precious moments that define your journey through the stars.",
      tiktok_id: "@seoha_universe",
      timestamp: "2024-01-15T09:30:00Z",
      emoji: "🌌",
      bgColor: "from-blue-100 via-purple-50 to-pink-100"
    },
    {
      name: "Cosmic Wanderer",
      message: "Today I witnessed something extraordinary - the way dreams dance with reality, creating ripples across the fabric of space and time. Each moment becomes eternal when captured in starlight.",
      tiktok_id: "@cosmic_dreams",
      timestamp: "2024-02-20T14:45:00Z",
      emoji: "✨",
      bgColor: "from-pink-100 via-purple-50 to-blue-100"
    },
    {
      name: "Stardust Soul",
      message: "We are all made of ancient starlight, carrying the wisdom of galaxies within our hearts. Your memories shine brighter than any constellation in the infinite cosmic ballet.",
      tiktok_id: "@stardust_memories",
      timestamp: "2024-03-10T18:20:00Z",
      emoji: "💫",
      bgColor: "from-cyan-100 via-blue-50 to-purple-100"
    },
    {
      name: "Future Self",
      message: "The universe stretches endlessly before you, filled with unwritten stories and undiscovered wonders. Each new day brings possibilities as infinite as the stars themselves.",
      tiktok_id: "@future_cosmos",
      timestamp: "2024-04-05T21:15:00Z",
      emoji: "🌟",
      bgColor: "from-purple-100 via-pink-50 to-blue-100"
    }
  ];

  // Check for mobile device
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Format timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Floating particles component
  const FloatingParticles = ({ isBookView = false }) => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(isBookView ? 25 : 12)].map((_, i) => (
        <div
          key={i}
          className={`absolute ${isBookView ? 'animate-float-slow' : 'animate-pulse'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 12}s`,
            fontSize: isMobile ? '1rem' : '1.5rem',
            opacity: 0.6
          }}
        >
          {['✨', '💫', '⭐', '🌸', '💙', '💗', '🌟'][Math.floor(Math.random() * 7)]}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float-slow {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
        .animate-float-slow {
          animation: float-slow linear infinite;
        }
      `}</style>
    </div>
  );

  // Initialize magical orbs with orbiting particles
  useEffect(() => {
    if (!canvasRef.current || showNotebook) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    });
    
    const canvasSize = isMobile ? 280 : 400;
    renderer.setSize(canvasSize, canvasSize);
    renderer.setClearColor(0x000000, 0);
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create multiple magical orbs
    const orbGroup = new THREE.Group();
    magicalOrbsRef.current = [];

    // Main central orb (largest)
    const mainOrbGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const mainOrbMaterial = new THREE.MeshPhongMaterial({
      color: darkMode ? 0x4a00ff : 0x8b5cf6,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
      emissive: darkMode ? 0x2d1b69 : 0x4c1d95,
      emissiveIntensity: 0.2
    });
    const mainOrb = new THREE.Mesh(mainOrbGeometry, mainOrbMaterial);
    magicalOrbsRef.current.push({ mesh: mainOrb, speed: 0.01, radius: 0 });
    orbGroup.add(mainOrb);

    // Surrounding magical orbs
    for (let i = 0; i < 3; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.4 + Math.random() * 0.3, 16, 16);
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: [0xff69b4, 0x00bfff, 0xffd700][i],
        transparent: true,
        opacity: 0.6,
        shininess: 150,
        emissive: [0x8b0066, 0x006080, 0xb8860b][i],
        emissiveIntensity: 0.3
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      
      const angle = (i / 3) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 0.5;
      orb.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * radius);
      
      magicalOrbsRef.current.push({ 
        mesh: orb, 
        speed: 0.005 + Math.random() * 0.01, 
        radius: radius, 
        baseAngle: angle 
      });
      orbGroup.add(orb);
    }

    scene.add(orbGroup);

    // Create orbiting particle system
    const particleCount = 800;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Create spiral galaxy pattern
      const angle = (i / particleCount) * Math.PI * 8;
      const radius = 3 + (i / particleCount) * 8;
      const spiralTightness = 0.5;
      
      positions[i * 3] = Math.cos(angle + radius * spiralTightness) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = Math.sin(angle + radius * spiralTightness) * radius;

      // Color gradient from center to edge
      const distance = radius / 11;
      colors[i * 3] = 1 - distance * 0.5; // Red
      colors[i * 3 + 1] = 0.8 - distance * 0.3; // Green  
      colors[i * 3 + 2] = 1; // Blue

      sizes[i] = Math.random() * 3 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particleSystemRef.current = particles;
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xffffff, 1, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff69b4, 0.5, 30);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);

    camera.position.set(0, 3, 12);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      // Animate magical orbs
      magicalOrbsRef.current.forEach((orbData, index) => {
        if (index === 0) {
          // Main orb gentle rotation
          orbData.mesh.rotation.x += orbData.speed;
          orbData.mesh.rotation.y += orbData.speed * 1.5;
        } else {
          // Orbiting orbs
          const angle = orbData.baseAngle + time * orbData.speed;
          orbData.mesh.position.x = Math.cos(angle) * orbData.radius;
          orbData.mesh.position.z = Math.sin(angle) * orbData.radius;
          orbData.mesh.position.y = Math.sin(time * 2 + index) * 0.5;
          orbData.mesh.rotation.y += 0.02;
        }
      });

      // Rotate particle galaxy
      if (particleSystemRef.current) {
        particleSystemRef.current.rotation.y += 0.002;
        particleSystemRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [darkMode, showNotebook, isMobile]);

  const handleOrbClick = () => {
    setShowNotebook(true);
  };

  const nextPage = () => {
    if (currentPage < memoryCards.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  if (!showNotebook) {
    return (
      <div className={`min-h-screen transition-all duration-1000 ${darkMode 
        ? 'bg-gradient-to-br from-black via-gray-900 to-purple-900' 
        : 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900'
      }`}>
        <FloatingParticles />
        
        {/* Theme toggle */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            {darkMode ? <Sun size={isMobile ? 20 : 24} /> : <Moon size={isMobile ? 20 : 24} />}
          </button>
        </div>

        {/* Magical orbs entrance */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className={`text-4xl md:text-7xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-pulse`}>
              Seoha Memories
            </h1>
            <p className="text-lg md:text-2xl text-blue-200/80 font-light px-4">
              Enter the magical realm of memories
            </p>
          </div>
          
          <div 
            className="relative cursor-pointer transform transition-all duration-700 hover:scale-105 group mb-8"
            onClick={handleOrbClick}
          >
            <canvas 
              ref={canvasRef}
              className="rounded-full shadow-2xl group-hover:shadow-blue-500/30"
            />
            
            {/* Magical aura effect */}
            <div className="absolute -inset-4 rounded-full bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent group-hover:from-purple-500/30 group-hover:via-blue-500/20 transition-all duration-500 animate-pulse" />
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-4 md:px-8 py-3 md:py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <BookOpen className="mr-2 md:mr-3 text-blue-300" size={isMobile ? 20 : 24} />
              <span className="text-sm md:text-lg text-blue-200/90 font-medium">
                Tap to explore the memory cosmos
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = memoryCards[currentPage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      <FloatingParticles isBookView={true} />
      
      {/* Header - Responsive */}
      <div className="flex justify-between items-center p-4 md:p-6 relative z-10">
        <button
          onClick={() => setShowNotebook(false)}
          className="flex items-center space-x-2 md:space-x-3 px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base"
        >
          <ChevronLeft size={isMobile ? 16 : 20} />
          <span className="font-medium">Back to Cosmos</span>
        </button>
        
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
          Seoha Memories
        </h1>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 md:p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:scale-110 shadow-lg"
        >
          {darkMode ? <Sun size={isMobile ? 16 : 20} className="text-amber-500" /> : <Moon size={isMobile ? 16 : 20} className="text-slate-600" />}
        </button>
      </div>

      {/* Memory card container - Responsive */}
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
        <div className="relative max-w-4xl w-full">
          
          {/* Memory Card */}
          <div className={`w-full transition-all duration-700 ${
            isFlipping ? 'scale-95 opacity-80' : 'scale-100'
          }`}>
            <div className={`w-full rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-br ${currentCard.bgColor} p-6 md:p-12 min-h-[400px] md:min-h-[500px] flex flex-col`}>
              
              {/* Card header with metadata */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="text-4xl md:text-6xl">{currentCard.emoji}</div>
                  <div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <User size={16} />
                      <span className="font-semibold text-sm md:text-base">{currentCard.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 mt-1">
                      <Hash size={14} />
                      <span className="text-xs md:text-sm">{currentCard.tiktok_id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock size={16} />
                  <div className="text-right text-xs md:text-sm">
                    <div>{formatDate(currentCard.timestamp)}</div>
                    <div className="text-slate-400">{formatTime(currentCard.timestamp)}</div>
                  </div>
                </div>
              </div>
              
              {/* Card content */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-base md:text-xl leading-relaxed text-slate-700 text-center md:text-left">
                  {currentCard.message}
                </div>
              </div>
              
              {/* Card footer */}
              <div className="text-center mt-6 md:mt-8">
                <span className="text-sm md:text-base text-slate-400">
                  Memory {currentPage + 1} of {memoryCards.length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons - Responsive positioning */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className={`absolute ${isMobile ? '-left-2 top-1/2' : 'left-4 top-1/2'} -translate-y-1/2 p-3 md:p-4 rounded-full transition-all duration-300 ${
              currentPage === 0 || isFlipping
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:scale-110 hover:-translate-x-1 md:hover:-translate-x-2 shadow-lg'
            } bg-white/90 backdrop-blur-sm text-slate-600 z-10`}
          >
            <ChevronLeft size={isMobile ? 24 : 28} />
          </button>
          
          <button
            onClick={nextPage}
            disabled={currentPage === memoryCards.length - 1 || isFlipping}
            className={`absolute ${isMobile ? '-right-2 top-1/2' : 'right-4 top-1/2'} -translate-y-1/2 p-3 md:p-4 rounded-full transition-all duration-300 ${
              currentPage === memoryCards.length - 1 || isFlipping
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:scale-110 hover:translate-x-1 md:hover:translate-x-2 shadow-lg'
            } bg-white/90 backdrop-blur-sm text-slate-600 z-10`}
          >
            <ChevronRight size={isMobile ? 24 : 28} />
          </button>
        </div>
      </div>
      
      {/* Page indicators - Responsive */}
      <div className="flex justify-center space-x-2 md:space-x-3 pb-6 md:pb-8">
        {memoryCards.map((_, index) => (
          <button
            key={index}
            onClick={() => !isFlipping && setCurrentPage(index)}
            disabled={isFlipping}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
              index === currentPage 
                ? 'bg-gradient-to-r from-blue-400 to-pink-400 scale-125 shadow-lg' 
                : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SeohaMemories;
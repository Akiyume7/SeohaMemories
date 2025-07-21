import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import Entrance from './Entrance';
import View from './View';
import FloatingParticles from './FloatingParticles';

const pastelGradients = [
  'from-blue-100 via-pink-100 to-blue-50',
  'from-pink-100 via-blue-100 to-pink-50',
  'from-purple-100 via-blue-50 to-pink-100',
  'from-cyan-100 via-pink-50 to-purple-100',
  'from-pink-50 via-blue-50 to-purple-50',
  'from-blue-50 via-pink-50 to-purple-100',
  'from-pink-100 via-purple-50 to-blue-100',
  'from-blue-100 via-purple-50 to-pink-100',
];

function convertFirestoreTimestamp(ts) {
  if (!ts || typeof ts.seconds !== 'number') return null;
  return new Date(ts.seconds * 1000 + Math.floor((ts.nanoseconds || 0) / 1e6));
}

const SeohaMemories = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [memoryCards, setMemoryCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const magicalOrbsRef = useRef([]);
  const particleSystemRef = useRef();
  const animationIdRef = useRef();
  const [search, setSearch] = useState('');
  const [showAZDropdown, setShowAZDropdown] = useState(false);
  const azDropdownRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}data/users.json`)
      .then(res => res.json())
      .then(data => {
        const cards = data.map((item, idx) => ({
          ...item,
          bgColor: pastelGradients[idx % pastelGradients.length],
          timestamp: convertFirestoreTimestamp(item.timestamp)
        }));
        setMemoryCards(cards);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || showNotebook) return;
    // No-op: galaxy/orb logic moved to GalaxyCanvas.jsx
    // (All Three.js setup for Entrance is now handled in GalaxyCanvas)
    // This effect can be left empty or removed.
  }, [darkMode, showNotebook, isMobile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtered cards for search
  const filteredCards = memoryCards.filter(card => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (card.name && card.name.toLowerCase().includes(q)) ||
      (card.tiktok_id && card.tiktok_id.toLowerCase().includes(q))
    );
  });
  const filteredCurrentPage = Math.min(currentPage, Math.max(filteredCards.length - 1, 0));
  const currentCard = filteredCards[filteredCurrentPage] || {};
  const currentCardWithDate = {
    ...currentCard,
    dateStr: formatDate(currentCard.timestamp),
    timeStr: formatTime(currentCard.timestamp),
  };

  if (!showNotebook) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-pink-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-all duration-1000">
          <span className="text-2xl text-blue-400 animate-pulse">Loading memories...</span>
        </div>
      );
    }
    return (
      <Entrance
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isMobile={isMobile}
        handleOrbClick={() => setShowNotebook(true)}
        canvasRef={canvasRef}
      />
    );
  }

  return (
    <View
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      isMobile={isMobile}
      setShowNotebook={setShowNotebook}
      search={search}
      setSearch={setSearch}
      showAZDropdown={showAZDropdown}
      setShowAZDropdown={setShowAZDropdown}
      azDropdownRef={azDropdownRef}
      memoryCards={memoryCards}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isFlipping={isFlipping}
      filteredCards={filteredCards}
      filteredCurrentPage={filteredCurrentPage}
      currentCard={currentCardWithDate}
    />
  );
};

export default SeohaMemories;
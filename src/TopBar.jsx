import React from 'react';
import { ChevronLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const TopBar = ({ setShowNotebook, darkMode, setDarkMode, isMobile }) => (
  <div className="w-full flex justify-between items-center px-4 md:px-8 py-3 md:py-4 backdrop-blur-sm border-b border-blue-100 dark:border-slate-700 shadow-sm fixed top-0 left-0 z-30">
    <button
      onClick={() => setShowNotebook(false)}
      className="flex items-center space-x-2 md:space-x-3 px-3 md:px-6 py-2 md:py-3 rounded-full bg-white/90 dark:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-800/80 transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base border border-blue-100 dark:border-slate-700"
    >
      <ChevronLeft size={isMobile ? 16 : 20} />
      <span className="font-medium">BACK</span>
    </button>
    <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} />
  </div>
);

export default TopBar; 
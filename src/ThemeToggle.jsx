import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ darkMode, setDarkMode, isMobile }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className={`p-2 md:p-3 rounded-full shadow-md transition-all duration-200 hover:scale-110 focus:outline-none
      ${darkMode ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-slate-100'}
    `}
    aria-label="Toggle dark mode"
  >
    {darkMode
      ? <Moon size={isMobile ? 32 : 36} />
      : <Sun size={isMobile ? 32 : 36} />}
  </button>
);

export default ThemeToggle; 
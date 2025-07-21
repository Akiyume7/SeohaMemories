import React from 'react';

const AZDropdown = ({ memoryCards, setCurrentPage, setSearch, showAZDropdown, setShowAZDropdown, azDropdownRef }) => {
  if (!showAZDropdown) return null;
  const alphabet = Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i));
  const getFirstLetter = name => {
    if (!name) return '';
    const match = name.match(/[A-Z]/i);
    return match ? match[0].toUpperCase() : '';
  };
  const hasLetter = letter => memoryCards.some(card => getFirstLetter(card.name) === letter);
  const hasNonAlpha = memoryCards.some(card => getFirstLetter(card.name) === '');
  return (
    <div ref={azDropdownRef} className="absolute right-0 mt-2 w-14 max-h-72 overflow-y-auto bg-white dark:bg-slate-800/90 backdrop-blur-md border border-blue-100 dark:border-slate-700 rounded-2xl shadow-lg flex flex-col items-center py-2 z-50">
      {[
        ...alphabet.map(letter => {
          const exists = hasLetter(letter);
          return (
            <button
              key={letter}
              disabled={!exists}
              onClick={() => {
                if (!exists) return;
                setShowAZDropdown(false);
                setSearch('');
                const idx = memoryCards.findIndex(card => getFirstLetter(card.name) === letter);
                if (idx !== -1) setCurrentPage(idx);
              }}
              className={`w-8 h-8 aspect-square flex items-center justify-center rounded-full font-bold text-xs md:text-base transition-all duration-200 mb-1
                border border-blue-100 dark:border-slate-700
                ${exists ? 'bg-white dark:bg-slate-700/80 hover:bg-blue-200 dark:hover:bg-slate-800/80 text-blue-700 dark:text-slate-200 cursor-pointer' : 'bg-white/30 dark:bg-slate-700/30 text-slate-300 cursor-not-allowed'}
              `}
              style={{ minWidth: '2rem', minHeight: '2rem', fontSize: '1rem' }}
            >
              {letter}
            </button>
          );
        }),
        (() => {
          const exists = hasNonAlpha;
          return (
            <button
              key="#"
              disabled={!exists}
              onClick={() => {
                if (!exists) return;
                setShowAZDropdown(false);
                setSearch('');
                const idx = memoryCards.findIndex(card => getFirstLetter(card.name) === '');
                if (idx !== -1) setCurrentPage(idx);
              }}
              className={`w-8 h-8 aspect-square flex items-center justify-center rounded-full font-bold text-xs md:text-base transition-all duration-200 mb-1
                border border-blue-100 dark:border-slate-700
                ${exists ? 'bg-white dark:bg-slate-700/80 hover:bg-blue-200 dark:hover:bg-slate-800/80 text-blue-700 dark:text-slate-200 cursor-pointer' : 'bg-white/30 dark:bg-slate-700/30 text-slate-300 cursor-not-allowed'}
              `}
              style={{ minWidth: '2rem', minHeight: '2rem', fontSize: '1rem' }}
            >
              #
            </button>
          );
        })()
      ]}
    </div>
  );
};

export default AZDropdown; 
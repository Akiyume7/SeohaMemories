import React from 'react';
import TopBar from './TopBar';
import AZDropdown from './AZDropdown';
import FloatingParticles from './FloatingParticles';
import MemoryCard from './MemoryCard';
import { Bookmark } from 'lucide-react';

const View = ({
  darkMode,
  setDarkMode,
  isMobile,
  setShowNotebook,
  search,
  setSearch,
  showAZDropdown,
  setShowAZDropdown,
  azDropdownRef,
  memoryCards,
  currentPage,
  setCurrentPage,
  isFlipping,
  filteredCards,
  filteredCurrentPage,
  currentCard,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-1000 relative overflow-hidden">
    <img src="/background.webp" alt="background" className="fixed inset-0 w-full h-full object-cover object-center z-0 pointer-events-none select-none" style={{ opacity: 0.75 }} draggable="false" />
    <FloatingParticles isBookView={true} isMobile={isMobile} />
    <TopBar setShowNotebook={setShowNotebook} darkMode={darkMode} setDarkMode={setDarkMode} isMobile={isMobile} />
    <div className="h-20 md:h-24" />
    <div className="flex flex-col items-center pt-4 pb-4">
      <h1 className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-blue-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg mb-4 md:mb-8" style={{ WebkitTextStroke: '1.5px #fff', textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
        Seoha Memories
      </h1>
    </div>
    <div className="flex justify-center pb-4 z-20 relative gap-2">
      <div className="relative flex items-center w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(0);
          }}
          placeholder="Search by name or TikTok ID..."
          className="w-full px-4 py-2 rounded-xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800/70 shadow focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <button
          type="button"
          aria-label="Show A-Z bookmark filter"
          onClick={() => setShowAZDropdown(v => !v)}
          className={`ml-2 p-2 rounded-full border-2 shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300
            ${showAZDropdown ? 'bg-blue-100 dark:bg-slate-700 border-blue-400 dark:border-slate-500' : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700'}
          `}
        >
          <Bookmark className={`w-6 h-6 ${showAZDropdown ? 'text-blue-500 dark:text-blue-300' : 'text-slate-400 dark:text-slate-300'}`} />
        </button>
        <div className="absolute top-full right-0 mt-2">
          <AZDropdown
            memoryCards={memoryCards}
            setCurrentPage={setCurrentPage}
            setSearch={setSearch}
            showAZDropdown={showAZDropdown}
            setShowAZDropdown={setShowAZDropdown}
            azDropdownRef={azDropdownRef}
          />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center min-h-[40vh] md:min-h-[50vh] px-4 py-8">
      <div className="relative max-w-4xl w-full">
        {filteredCards.length === 0 ? (
          <div className="w-full rounded-2xl md:rounded-3xl shadow-2xl bg-white dark:bg-slate-800/80 p-12 flex flex-col items-center justify-center min-h-[300px]">
            <span className="text-xl text-slate-400 dark:text-slate-300">No memories found.</span>
          </div>
        ) : (
          <MemoryCard
            currentCard={currentCard}
            filteredCurrentPage={filteredCurrentPage}
            filteredCards={filteredCards}
            isFlipping={isFlipping}
            setCurrentPage={setCurrentPage}
          />
        )}
        {/* Navigation buttons - Responsive positioning */}
        {filteredCards.length > 0 && (
          <>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
              disabled={filteredCurrentPage === 0 || isFlipping}
              className={`absolute ${isMobile ? '-left-2 top-1/2' : 'left-4 top-1/2'} -translate-y-1/2 p-3 md:p-4 rounded-full transition-all duration-300 ${
                filteredCurrentPage === 0 || isFlipping
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:scale-110 hover:-translate-x-1 md:hover:-translate-x-2 shadow-lg'
              } bg-white/90 backdrop-blur-sm text-slate-600 z-10`}
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, filteredCards.length - 1))}
              disabled={filteredCurrentPage === filteredCards.length - 1 || isFlipping}
              className={`absolute ${isMobile ? '-right-2 top-1/2' : 'right-4 top-1/2'} -translate-y-1/2 p-3 md:p-4 rounded-full transition-all duration-300 ${
                filteredCurrentPage === filteredCards.length - 1 || isFlipping
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:scale-110 hover:translate-x-1 md:hover:translate-x-2 shadow-lg'
              } bg-white/90 backdrop-blur-sm text-slate-600 z-10`}
            >
              &gt;
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);

export default View; 
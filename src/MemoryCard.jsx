import React from 'react';
import { User, Hash, Clock } from 'lucide-react';
import PageIndicators from './PageIndicators';

const knightImages = [
  `${import.meta.env.BASE_URL}knight/little_knight_1.png`,
  `${import.meta.env.BASE_URL}knight/little_knight_2.png`,
  `${import.meta.env.BASE_URL}knight/little_knight_3.png`,
  `${import.meta.env.BASE_URL}knight/little_knight_4.png`,
  `${import.meta.env.BASE_URL}knight/little_knight_5.png`,
  `${import.meta.env.BASE_URL}knight/little_knight_6.png`,
  `${import.meta.env.BASE_URL}knight/little_knight_7.png`,
  `${import.meta.env.BASE_URL}knight/little_knight_8.png`,
];

function getRandomKnights() {
  // Pick 1-3 random knights, no overlap
  const count = Math.floor(Math.random() * 3) + 1;
  const arr = [];
  const usedRanges = [];
  for (let i = 0; i < count; i++) {
    let tries = 0;
    let knight = null;
    while (tries < 10) {
      const img = knightImages[Math.floor(Math.random() * knightImages.length)];
      const widthPercent = 10 + Math.random() * 10; // 10% to 20%
      const leftPercent = 10 + Math.random() * (80 - widthPercent); // ensure it fits in 10%-90%
      const range = [leftPercent, leftPercent + widthPercent];
      // Check for overlap
      const overlaps = usedRanges.some(([l, r]) => !(range[1] < l || range[0] > r));
      if (!overlaps) {
        const flip = Math.random() < 0.5 ? -1 : 1;
        const delay = 0.05 + Math.random() * 0.18;
        knight = {
          src: img,
          bottom: `${Math.random() * 20}%`,
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          rotate: `0deg`,
          flip,
          delay,
        };
        usedRanges.push(range);
        break;
      }
      tries++;
    }
    // If couldn't find a non-overlapping spot, just add anyway
    if (!knight) {
      const img = knightImages[Math.floor(Math.random() * knightImages.length)];
      const widthPercent = 10 + Math.random() * 10;
      const leftPercent = 10 + Math.random() * (80 - widthPercent);
      const flip = Math.random() < 0.5 ? -1 : 1;
      const delay = 0.05 + Math.random() * 0.18;
      knight = {
        src: img,
        bottom: `${Math.random() * 20}%`,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        rotate: `0deg`,
        flip,
        delay,
      };
      usedRanges.push([leftPercent, leftPercent + widthPercent]);
    }
    arr.push(knight);
  }
  return arr;
}

const MemoryCard = ({ currentCard, filteredCurrentPage, filteredCards, isFlipping, setCurrentPage }) => {
  const knights = React.useMemo(() => getRandomKnights(), [filteredCurrentPage]);
  const [animating, setAnimating] = React.useState(false);
  const prevPage = React.useRef(filteredCurrentPage);

  React.useEffect(() => {
    if (prevPage.current !== filteredCurrentPage) {
      setAnimating(true);
      const timeout = setTimeout(() => setAnimating(false), 400);
      prevPage.current = filteredCurrentPage;
      return () => clearTimeout(timeout);
    }
  }, [filteredCurrentPage]);

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-2xl md:rounded-3xl shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-4 md:p-8 h-[26rem] md:h-[34rem] flex flex-col pb-4 relative overflow-hidden`}
      style={{ willChange: undefined }}
    >
      {/* Card background overlay */}
      <img src={`${import.meta.env.BASE_URL}Seoha.webp`} alt="card overlay" className="absolute inset-0 m-auto w-2/3 h-2/3 object-contain z-0 pointer-events-none select-none opacity-100 animate-sway" style={{ left: '0', right: '0', top: '0', bottom: '0', transformOrigin: 'bottom center' }} draggable="false" />
      {/* FlyMic overlay, floats to the right of Seoha */}
      <img src={`${import.meta.env.BASE_URL}FlyMic.png`} alt="fly mic" className="absolute z-0 pointer-events-none select-none opacity-90 drop-shadow-lg animate-float-mic" style={{ left: '18%', top: '32%', width: '28%', minWidth: '40px', maxWidth: '90px' }} draggable="false" />
      {knights.map((k, i) => (
        <img
          key={i}
          src={k.src}
          alt="knight overlay"
          className={`absolute object-contain z-0 pointer-events-none select-none ${animating ? '' : 'animate-pop'}`}
          style={{
            bottom: k.bottom,
            left: k.left,
            width: k.width,
            transform: `scaleX(${k.flip}) rotate(${k.rotate})`,
            animationDelay: !animating ? `${k.delay}s` : undefined,
          }}
          draggable="false"
        />
      ))}
      {/* Card header with metadata */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-4 md:space-y-0 z-10 relative transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="text-4xl md:text-6xl">{currentCard.emoji}</div>
          <div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-200" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.18), 0 0 2px #fff' }}>
              <User size={16} />
              <span className="font-semibold text-sm md:text-base" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.18), 0 0 2px #fff' }}>{currentCard.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 mt-1">
              <Hash size={14} />
              <span className="text-xs md:text-sm" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.18), 0 0 2px #fff' }}>{currentCard.tiktok_id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <Clock size={16} />
          <div className="text-right text-xs md:text-sm">
            <div>{currentCard.dateStr}</div>
            <div className="text-slate-400 dark:text-slate-500">{currentCard.timeStr}</div>
          </div>
        </div>
      </div>
      {/* Card content - scrollable message */}
      <div className="flex-1 flex flex-col justify-center z-10 relative">
        <div className={`text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200 text-center md:text-left overflow-y-auto max-h-44 md:max-h-64 pr-2 custom-scrollbar shadow-sm transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.18), 0 0 2px #fff' }}>
          <div className="inline-block w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl px-3 py-2">
            {currentCard.message}
          </div>
        </div>
      </div>
      {/* Card footer */}
      <div className={`text-center mt-4 md:mt-6 z-10 relative transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <span className="inline-block text-sm md:text-base text-slate-400 dark:text-slate-300 mb-2 px-3 py-1 rounded-xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-md">
          Memory {filteredCurrentPage + 1} of {filteredCards.length}
        </span>
        {/* Page indicators - Responsive */}
        {filteredCards.length > 0 && (
          <PageIndicators
            filteredCards={filteredCards}
            filteredCurrentPage={filteredCurrentPage}
            setCurrentPage={setCurrentPage}
            isFlipping={isFlipping}
          />
        )}
      </div>
      <style>{`
        @keyframes pop {
          0% { transform: scale(0); }
          60% { transform: scale(1.2); }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes sway {
          0% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
          100% { transform: rotate(-2deg); }
        }
        .animate-sway {
          animation: sway 2.2s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes float-mic {
          0% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
          100% { transform: translateY(0); }
        }
        .animate-float-mic {
          animation: float-mic 2.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MemoryCard; 
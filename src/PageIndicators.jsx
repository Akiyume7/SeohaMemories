import React from 'react';

const PageIndicators = ({ filteredCards, filteredCurrentPage, setCurrentPage, isFlipping }) => {
  const total = filteredCards.length;
  const current = filteredCurrentPage;

  // Determine which indices to show
  let indices = [];
  if (total <= 3) {
    indices = Array.from({ length: total }, (_, i) => i);
  } else if (current === 0) {
    indices = [0, 1, 2];
  } else if (current === total - 1) {
    indices = [total - 3, total - 2, total - 1];
  } else {
    indices = [current - 1, current, current + 1];
  }

  return (
    <div className="flex items-center justify-center gap-2 min-h-[1.5rem]" style={{ position: 'relative', minWidth: '4.5rem' }}>
      {indices.map((index, i) => {
        // Animation: center dot is current, sides are faded/scaled
        let style = '';
        let extra = {};
        // Position animation: -1 (left), 0 (center), 1 (right)
        const pos = i - 1;
        const translate = `translateX(${pos * 2}rem)`;
        if (index === current) {
          style = 'bg-blue-400 scale-125 opacity-100 shadow-md z-10';
          extra = { style: { zIndex: 10, transition: 'all 0.7s cubic-bezier(.4,0,.2,1)', transform: `${translate} scale(1.25)` } };
        } else {
          style = 'bg-slate-300 dark:bg-slate-700 opacity-50 scale-90';
          extra = { style: { zIndex: 1, transition: 'all 0.7s cubic-bezier(.4,0,.2,1)', transform: `${translate} scale(0.9)` } };
        }
        return (
          <button
            key={index}
            onClick={() => !isFlipping && setCurrentPage(index)}
            disabled={isFlipping}
            className={`w-4 h-4 aspect-square rounded-full transition-all duration-700 ${style}`}
            {...extra}
          />
        );
      })}
    </div>
  );
};

export default PageIndicators; 
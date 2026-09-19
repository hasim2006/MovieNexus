'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../../types';
import MovieCard from './MovieCard';

interface ContentRowProps {
  title: string;
  badge?: string;
  movies: MediaItem[];
  onOpenDetail: (movie: MediaItem) => void;
  onOpenShare: (movie: MediaItem) => void;
  onToggleWatchlist: (movieId: string) => void;
  watchlistIds: string[];
}

export default function ContentRow({
  title,
  badge,
  movies,
  onOpenDetail,
  onOpenShare,
  onToggleWatchlist,
  watchlistIds,
}: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 10);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-3 relative group py-2">
      {/* Row Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">{title}</h2>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-brand/20 text-brand border border-brand/40 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-24 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md rounded-r-xl transition-all shadow-2xl opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex items-center gap-4 overflow-x-auto no-scrollbar py-4 scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpenDetail={onOpenDetail}
              onOpenShare={onOpenShare}
              onToggleWatchlist={onToggleWatchlist}
              isInWatchlist={watchlistIds.includes(movie.id)}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-24 bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md rounded-l-xl transition-all shadow-2xl opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

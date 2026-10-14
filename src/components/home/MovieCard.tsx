'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Plus, Check, Info, Volume2, VolumeX, Share2 } from 'lucide-react';
import { MediaItem } from '../../types';

interface MovieCardProps {
  movie: MediaItem;
  onOpenDetail: (movie: MediaItem) => void;
  onOpenShare: (movie: MediaItem) => void;
  onToggleWatchlist: (movieId: string) => void;
  isInWatchlist: boolean;
}

export default function MovieCard({
  movie,
  onOpenDetail,
  onOpenShare,
  onToggleWatchlist,
  isInWatchlist,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 400); // 400ms hover delay before expand preview
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div
      className="relative flex-shrink-0 w-44 sm:w-56 md:w-64 group cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Standard Poster View */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 transition-all duration-300 group-hover:shadow-2xl group-hover:border-zinc-700">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top 10 Badge */}
        {movie.isTop10 && (
          <div className="absolute top-2 left-2 bg-brand text-white font-black text-[10px] px-2 py-0.5 rounded shadow-lg">
            TOP {movie.isTop10}
          </div>
        )}

        {/* 4K Badge */}
        {movie.is4K && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-amber-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-amber-400/40">
            4K
          </div>
        )}

        {/* Bottom Overlay Title info */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 pt-8">
          <h3 className="text-white font-bold text-xs sm:text-sm truncate drop-shadow">{movie.title}</h3>
          <div className="flex items-center gap-2 text-[10px] text-zinc-300 mt-1">
            <span className="text-emerald-400 font-semibold">{movie.matchPercentage}%</span>
            <span>{movie.duration}</span>
            <span className="border border-zinc-700 px-1 rounded">{movie.rating}</span>
          </div>
        </div>
      </div>

      {/* Expanded Hover Trailer Preview Popup */}
      {isHovered && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-[280px] sm:w-[320px] bg-[#121215] rounded-2xl shadow-2xl z-50 border border-zinc-700/80 overflow-hidden animate-fade-in red-glow">
          {/* Video Preview */}
          <div className="relative aspect-video w-full bg-black">
            <video
              ref={videoRef}
              src={movie.trailerUrl}
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full text-xs"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-brand" />}
            </button>
          </div>

          {/* Expanded Card Controls & Details */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href={`/watch/${movie.id}`}
                  className="w-9 h-9 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition-transform hover:scale-110"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </Link>
                <button
                  onClick={() => onToggleWatchlist(movie.id)}
                  className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white flex items-center justify-center transition-colors"
                >
                  {isInWatchlist ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => onOpenShare(movie)}
                  className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white flex items-center justify-center transition-colors"
                  title="Share Video"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onOpenDetail(movie)}
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white flex items-center justify-center transition-colors ml-auto"
                title="More Info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-emerald-400">{movie.matchPercentage}% Match</span>
                <span className="border border-zinc-700 px-1 rounded text-[10px] text-zinc-300">{movie.rating}</span>
                <span className="text-zinc-400">{movie.duration}</span>
                {movie.is4K && <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1 rounded font-bold">4K</span>}
              </div>

              <div className="flex flex-wrap gap-1 text-[11px] text-zinc-400 pt-1">
                {movie.genres.slice(0, 3).map((g, i) => (
                  <span key={g}>
                    {g}
                    {i < Math.min(movie.genres.length, 3) - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Card hover easing: cubic-bezier(0.4, 0, 0.2, 1)

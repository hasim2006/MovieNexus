'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Info, Volume2, VolumeX, Plus, Check, Sparkles, ShieldAlert } from 'lucide-react';
import { MediaItem } from '../../types';

interface HeroBannerProps {
  movie: MediaItem;
  onOpenDetail: (movie: MediaItem) => void;
  onToggleWatchlist: (movieId: string) => void;
  isInWatchlist: boolean;
}

export default function HeroBanner({
  movie,
  onOpenDetail,
  onToggleWatchlist,
  isInWatchlist,
}: HeroBannerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-[80vh] sm:h-[88vh] lg:h-[92vh] overflow-hidden bg-black">
      {/* Background Media: Video Trailer with Image Fallback */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={videoRef}
          src={movie.trailerUrl}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onCanPlay={() => setIsVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100 scale-105' : 'opacity-0'
          }`}
        />

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/80 to-transparent w-full md:w-3/4" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-4 animate-slide-up">
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 font-black text-brand tracking-widest uppercase bg-brand/10 border border-brand/40 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5" /> STREAMVAULT ORIGINAL
            </span>
            {movie.is4K && (
              <span className="bg-zinc-800/90 text-amber-400 font-bold border border-amber-400/30 px-2 py-0.5 rounded text-[11px]">
                4K ULTRA HD
              </span>
            )}
            {movie.isDolbyAtmos && (
              <span className="bg-zinc-800/90 text-sky-400 font-bold border border-sky-400/30 px-2 py-0.5 rounded text-[11px]">
                ATMOS 5.1
              </span>
            )}
            <span className="bg-zinc-800/80 text-emerald-400 font-semibold px-2 py-0.5 rounded text-[11px]">
              {movie.matchPercentage}% Match
            </span>
            <span className="border border-zinc-700 text-zinc-300 font-medium px-1.5 py-0.5 rounded text-[10px]">
              {movie.rating}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Description */}
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-xl text-shadow">
            {movie.description}
          </p>

          {/* Genres */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            {movie.genres.map((genre, idx) => (
              <span key={genre} className="flex items-center gap-2">
                <span className="hover:text-white cursor-pointer transition-colors">{genre}</span>
                {idx < movie.genres.length - 1 && <span className="text-zinc-600">•</span>}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/watch/${movie.id}`}
              className="flex items-center gap-2.5 px-6 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl text-sm transition-all shadow-xl red-glow hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Watch 4K</span>
            </Link>

            <button
              onClick={() => onOpenDetail(movie)}
              className="flex items-center gap-2 px-5 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-white font-semibold rounded-xl text-sm backdrop-blur-md transition-all border border-zinc-700/60 hover:scale-105"
            >
              <Info className="w-5 h-5 text-zinc-300" />
              <span>More Info</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(movie.id)}
              className="flex items-center gap-2 px-4 py-3 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-medium rounded-xl text-sm backdrop-blur-md border border-zinc-800 transition-all"
              title={isInWatchlist ? 'Remove from My List' : 'Add to My List'}
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="hidden sm:inline">In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-zinc-300" />
                  <span className="hidden sm:inline">My List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Mute Controller */}
        <div className="absolute right-4 sm:right-8 bottom-16 sm:bottom-24 z-20 flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-3 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-full backdrop-blur-md border border-zinc-700/60 transition-all hover:scale-110"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-brand" />}
          </button>
          <div className="hidden sm:block border-l-2 border-brand pl-3 py-1 bg-black/40 backdrop-blur-sm pr-4 rounded-r-md text-xs font-bold uppercase tracking-wider text-zinc-300">
            {movie.rating}
          </div>
        </div>
      </div>
    </div>
  );
}

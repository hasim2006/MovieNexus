'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Play, Plus, Check, Share2, Sparkles, Volume2, Film, Clapperboard } from 'lucide-react';
import { MediaItem } from '../../types';
import { SAMPLE_MOVIES } from '../../lib/sample-data';

interface DetailModalProps {
  movie: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenShare: (movie: MediaItem) => void;
  onToggleWatchlist: (movieId: string) => void;
  isInWatchlist: boolean;
}

export default function DetailModal({
  movie,
  isOpen,
  onClose,
  onOpenShare,
  onToggleWatchlist,
  isInWatchlist,
}: DetailModalProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);

  if (!isOpen || !movie) return null;

  const relatedMovies = SAMPLE_MOVIES.filter(m => m.id !== movie.id).slice(0, 3);
  const currentSeason = movie.seasons?.find(s => s.seasonNumber === selectedSeason);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#121215] border border-zinc-700/80 rounded-3xl overflow-hidden shadow-2xl my-8 text-zinc-100 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-all border border-zinc-700 hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop & Media Title */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-black">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/50 to-transparent" />

          {/* Action Overlay */}
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {movie.isOriginal && (
                <span className="bg-brand text-white font-black px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                  Original
                </span>
              )}
              <span className="text-emerald-400 font-semibold">{movie.matchPercentage}% Match</span>
              <span className="text-zinc-300 font-medium">{movie.releaseYear}</span>
              <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] text-zinc-300">{movie.rating}</span>
              {movie.is4K && <span className="bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded text-[10px]">4K</span>}
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">{movie.title}</h2>

            <div className="flex items-center gap-3 pt-1">
              <Link
                href={`/watch/${movie.id}`}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl text-xs sm:text-sm transition-all red-glow"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play 4K</span>
              </Link>
              <button
                onClick={() => onToggleWatchlist(movie.id)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-zinc-700 transition-colors"
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to My List</span>
                  </>
                )}
              </button>
              <button
                onClick={() => onOpenShare(movie)}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Main Description */}
            <div className="md:col-span-2 space-y-4">
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">{movie.description}</p>

              {/* Technical Specifications */}
              <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800/80 space-y-3 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-brand">Audio & Subtitle Tracks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400">
                  <div>
                    <span className="text-zinc-200 font-semibold">Audio Tracks:</span>
                    <p className="mt-0.5 text-[11px]">{movie.audioLanguages.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-zinc-200 font-semibold">Subtitles:</span>
                    <p className="mt-0.5 text-[11px]">{movie.subtitleLanguages.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Meta Column */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-zinc-400">Director:</span>
                <p className="text-white font-medium mt-0.5">{movie.director}</p>
              </div>
              <div>
                <span className="text-zinc-400">Cast:</span>
                <p className="text-white font-medium mt-0.5 leading-relaxed">{movie.cast.join(', ')}</p>
              </div>
              <div>
                <span className="text-zinc-400">Genres:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {movie.genres.map(g => (
                    <span key={g} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md text-[11px]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Episodes List (if series) */}
          {movie.type === 'series' && movie.seasons && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clapperboard className="w-5 h-5 text-brand" /> Episodes
                </h3>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold"
                >
                  {movie.seasons.map(s => (
                    <option key={s.seasonNumber} value={s.seasonNumber}>
                      Season {s.seasonNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {currentSeason?.episodes.map(ep => (
                  <div key={ep.id} className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-zinc-900/60 hover:bg-zinc-800/80 rounded-2xl border border-zinc-800 transition-colors">
                    <img src={ep.thumbnailUrl} alt={ep.title} className="w-full sm:w-40 aspect-video object-cover rounded-xl" />
                    <div className="flex-1 space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{ep.title}</h4>
                        <span className="text-xs text-zinc-400 font-medium">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2">{ep.description}</p>
                    </div>
                    <Link
                      href={`/watch/${movie.id}?ep=${ep.id}`}
                      className="w-full sm:w-auto px-4 py-2 bg-brand text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 red-glow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Watch
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Recommendations */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-base font-bold text-white">More Like This</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedMovies.map(rel => (
                <div key={rel.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group">
                  <img src={rel.backdropUrl} alt={rel.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-3 space-y-1">
                    <h4 className="font-bold text-white text-xs truncate">{rel.title}</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{rel.description}</p>
                    <Link href={`/watch/${rel.id}`} className="inline-block pt-1 text-xs font-semibold text-brand hover:underline">
                      Stream Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

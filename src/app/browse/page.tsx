'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Sparkles } from 'lucide-react';
import MovieCard from '../../components/home/MovieCard';
import DetailModal from '../../components/home/DetailModal';
import ShareModal from '../../components/share/ShareModal';
import { getStoredMovies, getStoredUser, saveStoredUser } from '../../lib/db';
import { MediaItem, User } from '../../types';

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [only4K, setOnly4K] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [shareMovie, setShareMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    setMovies(getStoredMovies());
    setUser(getStoredUser());
  }, []);

  const activeProfile = user?.profiles.find(p => p.id === user.activeProfileId) || user?.profiles[0];
  const watchlist = activeProfile?.watchlist || [];

  const toggleWatchlist = (movieId: string) => {
    if (!user || !activeProfile) return;
    const isSaved = watchlist.includes(movieId);
    const updatedWatchlist = isSaved
      ? watchlist.filter(id => id !== movieId)
      : [...watchlist, movieId];

    const updatedProfiles = user.profiles.map(p =>
      p.id === activeProfile.id ? { ...p, watchlist: updatedWatchlist } : p
    );

    const updatedUser = { ...user, profiles: updatedProfiles };
    setUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  const filteredMovies = movies.filter((movie) => {
    if (categoryFilter === 'movies' && movie.type !== 'movie') return false;
    if (categoryFilter === 'series' && movie.type !== 'series') return false;
    if (categoryFilter === 'originals' && !movie.isOriginal) return false;
    if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) return false;
    if (only4K && !movie.is4K) return false;
    return true;
  });

  const allGenres = ['All', 'Sci-Fi', 'Cyberpunk', 'Action', 'Fantasy', 'Adventure', 'Comedy', 'Family', 'Animation', 'Documentary'];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white capitalize flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-brand" />
            {categoryFilter === 'originals' ? 'StreamVault Originals' : `${categoryFilter} Catalog`}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse high-bitrate 4K movies and TV series available in Dolby Atmos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-2xl text-xs font-semibold">
            {['all', 'movies', 'series', 'originals'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
                  categoryFilter === cat ? 'bg-brand text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-2xl px-3.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand"
          >
            {allGenres.map((g) => (
              <option key={g} value={g}>
                Genre: {g}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOnly4K(!only4K)}
            className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold transition-all ${
              only4K ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            4K UHD Only
          </button>
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpenDetail={(m) => setSelectedMovie(m)}
              onOpenShare={(m) => setShareMovie(m)}
              onToggleWatchlist={toggleWatchlist}
              isInWatchlist={watchlist.includes(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <Filter className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No titles match your filter criteria</h3>
          <p className="text-xs text-zinc-400">Try adjusting your genre or category selections.</p>
        </div>
      )}

      {selectedMovie && (
        <DetailModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onOpenShare={(m) => setShareMovie(m)}
          onToggleWatchlist={toggleWatchlist}
          isInWatchlist={watchlist.includes(selectedMovie.id)}
        />
      )}

      {shareMovie && (
        <ShareModal
          movie={shareMovie}
          isOpen={!!shareMovie}
          onClose={() => setShareMovie(null)}
        />
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 text-center text-zinc-400">
        Loading catalog...
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}

// Filter: 4K UHD HDR dynamic tags

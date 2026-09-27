'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Film } from 'lucide-react';
import MovieCard from '../../components/home/MovieCard';
import DetailModal from '../../components/home/DetailModal';
import ShareModal from '../../components/share/ShareModal';
import { getStoredMovies, getStoredUser, saveStoredUser } from '../../lib/db';
import { MediaItem, User } from '../../types';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
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

  const results = movies.filter(m => {
    const q = query.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.genres.some(g => g.toLowerCase().includes(q)) ||
      m.director.toLowerCase().includes(q) ||
      m.cast.some(c => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-brand" />
          Search Results for "{query}"
        </h1>
        <p className="text-xs text-zinc-400 mt-1">Found {results.length} titles in StreamVault database.</p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((movie) => (
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
          <Film className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No videos found for "{query}"</h3>
          <p className="text-xs text-zinc-400">Try searching for keywords like "Sci-Fi", "Cyberpunk", or "2026".</p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 text-center text-zinc-400">
        Loading search results...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}

// Debounced search input handler (300ms)

'use client';

import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/home/HeroBanner';
import ContentRow from '../components/home/ContentRow';
import DetailModal from '../components/home/DetailModal';
import ShareModal from '../components/share/ShareModal';
import { getStoredMovies, getStoredUser, saveStoredUser, getStoredSectionConfigs } from '../lib/db';
import { MediaItem, User, SectionConfig } from '../types';

export default function HomePage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [shareMovie, setShareMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    setMovies(getStoredMovies());
    setUser(getStoredUser());
    setSections(getStoredSectionConfigs());
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

  // Sort movies according to priorityRank ascending (1 appears first)
  const prioritySortedMovies = [...movies].sort((a, b) => a.priorityRank - b.priorityRank);

  // Hero movie: assignedSection === 'hero' or highest priority movie
  const featuredMovie = prioritySortedMovies.find(m => m.assignedSection === 'hero') || prioritySortedMovies[0] || null;

  // Filter shelves
  const continueWatchingMovies = prioritySortedMovies.filter(m =>
    activeProfile?.continueWatching.some(cw => cw.mediaId === m.id)
  );

  const originals = prioritySortedMovies.filter(m => m.isOriginal || m.assignedSection === 'originals');
  const trending = prioritySortedMovies.filter(m => m.isTrending || m.assignedSection === 'trending');
  const sciFiMovies = prioritySortedMovies.filter(m => m.genres.includes('Sci-Fi') || m.assignedSection === 'scifi');

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Featured Hero Banner */}
      {featuredMovie && (
        <HeroBanner
          movie={featuredMovie}
          onOpenDetail={(m) => setSelectedMovie(m)}
          onToggleWatchlist={toggleWatchlist}
          isInWatchlist={watchlist.includes(featuredMovie.id)}
        />
      )}

      {/* Media Carousels */}
      <div className="-mt-16 sm:-mt-24 relative z-20 space-y-8 pb-16">
        {/* Continue Watching Row */}
        {continueWatchingMovies.length > 0 && (
          <ContentRow
            title={`Continue Watching for ${activeProfile?.name || 'Alex'}`}
            badge="Resume"
            movies={continueWatchingMovies}
            onOpenDetail={(m) => setSelectedMovie(m)}
            onOpenShare={(m) => setShareMovie(m)}
            onToggleWatchlist={toggleWatchlist}
            watchlistIds={watchlist}
          />
        )}

        {/* StreamVault Originals */}
        <ContentRow
          title="StreamVault Originals"
          badge="4K Exclusive"
          movies={originals}
          onOpenDetail={(m) => setSelectedMovie(m)}
          onOpenShare={(m) => setShareMovie(m)}
          onToggleWatchlist={toggleWatchlist}
          watchlistIds={watchlist}
        />

        {/* Trending Now (Rank Sorted) */}
        <ContentRow
          title="Trending Worldwide"
          badge="Top Ranked"
          movies={trending}
          onOpenDetail={(m) => setSelectedMovie(m)}
          onOpenShare={(m) => setShareMovie(m)}
          onToggleWatchlist={toggleWatchlist}
          watchlistIds={watchlist}
        />

        {/* Sci-Fi & Multiverse */}
        <ContentRow
          title="Sci-Fi & Cyberpunk Spectacles"
          movies={sciFiMovies}
          onOpenDetail={(m) => setSelectedMovie(m)}
          onOpenShare={(m) => setShareMovie(m)}
          onToggleWatchlist={toggleWatchlist}
          watchlistIds={watchlist}
        />
      </div>

      {/* Modals */}
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

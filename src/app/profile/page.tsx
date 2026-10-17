'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User as UserIcon, Shield, Play, Trash2, Plus, Clock, Bookmark, CheckCircle } from 'lucide-react';
import MovieCard from '../../components/home/MovieCard';
import DetailModal from '../../components/home/DetailModal';
import ShareModal from '../../components/share/ShareModal';
import { getStoredMovies, getStoredUser, saveStoredUser } from '../../lib/db';
import { MediaItem, User, UserProfile } from '../../types';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history' | 'settings'>('watchlist');
  const [selectedMovie, setSelectedMovie] = useState<MediaItem | null>(null);
  const [shareMovie, setShareMovie] = useState<MediaItem | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    setMovies(getStoredMovies());
  }, []);

  if (!user) return null;

  const activeProfile = user.profiles.find(p => p.id === user.activeProfileId) || user.profiles[0];
  const watchlistMovies = movies.filter(m => activeProfile?.watchlist.includes(m.id));
  const continueWatchingMovies = movies.filter(m =>
    activeProfile?.continueWatching.some(cw => cw.mediaId === m.id)
  );

  const toggleWatchlist = (movieId: string) => {
    const isSaved = activeProfile.watchlist.includes(movieId);
    const updatedWatchlist = isSaved
      ? activeProfile.watchlist.filter(id => id !== movieId)
      : [...activeProfile.watchlist, movieId];

    const updatedProfiles = user.profiles.map(p =>
      p.id === activeProfile.id ? { ...p, watchlist: updatedWatchlist } : p
    );

    const updatedUser = { ...user, profiles: updatedProfiles };
    setUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  const handleClearHistory = () => {
    const updatedProfiles = user.profiles.map(p =>
      p.id === activeProfile.id ? { ...p, continueWatching: [] } : p
    );
    const updatedUser = { ...user, profiles: updatedProfiles };
    setUser(updatedUser);
    saveStoredUser(updatedUser);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Profile Banner */}
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <img
            src={activeProfile.avatarUrl}
            alt={activeProfile.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-brand/60 red-glow"
          />
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{activeProfile.name}</h1>
              {activeProfile.isKids && <span className="bg-sky-500/20 text-sky-400 font-bold text-xs px-2 py-0.5 rounded">KIDS MODE</span>}
            </div>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="bg-brand/10 text-brand border border-brand/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {user.role === 'admin' ? 'Master Admin' : 'Premium VIP Streamer'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Switcher Buttons */}
        <div className="flex items-center gap-3">
          {user.profiles.map(p => (
            <button
              key={p.id}
              onClick={() => {
                const updated = { ...user, activeProfileId: p.id };
                setUser(updated);
                saveStoredUser(updated);
              }}
              className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                p.id === activeProfile.id
                  ? 'bg-zinc-800 border-brand text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-zinc-800 pb-3 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`flex items-center gap-2 pb-2 transition-colors ${
            activeTab === 'watchlist' ? 'text-brand border-b-2 border-brand font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>My List ({watchlistMovies.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 pb-2 transition-colors ${
            activeTab === 'history' ? 'text-brand border-b-2 border-brand font-bold' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Continue Watching ({continueWatchingMovies.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          {watchlistMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {watchlistMovies.map(movie => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onOpenDetail={(m) => setSelectedMovie(m)}
                  onOpenShare={(m) => setShareMovie(m)}
                  onToggleWatchlist={toggleWatchlist}
                  isInWatchlist={true}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
              <Bookmark className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">Your watchlist is currently empty</h3>
              <p className="text-xs text-zinc-400">Explore movies and click "+ My List" to save titles here.</p>
              <Link href="/browse" className="inline-block px-5 py-2.5 bg-brand text-white rounded-xl text-xs font-bold red-glow">
                Explore Catalog
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-400">Recorded watch points across your devices.</p>
            {continueWatchingMovies.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Watch History
              </button>
            )}
          </div>

          {continueWatchingMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {continueWatchingMovies.map(movie => {
                const cw = activeProfile.continueWatching.find(c => c.mediaId === movie.id);
                const percent = cw ? Math.min(100, Math.floor((cw.timestamp / cw.durationSeconds) * 100)) : 0;

                return (
                  <div key={movie.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between group">
                    <div className="relative aspect-video w-full bg-black">
                      <img src={movie.backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/watch/${movie.id}`}
                          className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center red-glow hover:scale-110 transition-transform"
                        >
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </Link>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-zinc-800">
                        <div className="h-full bg-brand red-glow" style={{ width: `${percent}%` }} />
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{movie.title}</h4>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          {percent}% completed ({cw ? Math.floor(cw.timestamp / 60) : 0}m left)
                        </span>
                      </div>
                      <Link href={`/watch/${movie.id}`} className="p-2 bg-zinc-800 text-white rounded-xl text-xs font-semibold hover:bg-zinc-700">
                        Resume
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-zinc-800">
              <Clock className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No watch history yet</h3>
              <p className="text-xs text-zinc-400">Start streaming any movie to resume seamlessly anytime.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedMovie && (
        <DetailModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onOpenShare={(m) => setShareMovie(m)}
          onToggleWatchlist={toggleWatchlist}
          isInWatchlist={activeProfile.watchlist.includes(selectedMovie.id)}
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

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Upload, Trash2, Edit3, ArrowLeft, Eye, Star, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { getStoredMovies, saveStoredMovies } from '../../../lib/db';
import { MediaItem } from '../../../types';

export default function AdminVideosPage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setMovies(getStoredMovies());
  }, []);

  const handleDeleteMovie = (id: string) => {
    if (confirm('Are you sure you want to delete this video item?')) {
      const updated = movies.filter(m => m.id !== id);
      setMovies(updated);
      saveStoredMovies(updated);
    }
  };

  const handleToggleOriginal = (id: string) => {
    const updated = movies.map(m =>
      m.id === id ? { ...m, isOriginal: !m.isOriginal } : m
    );
    setMovies(updated);
    saveStoredMovies(updated);
  };

  const filteredMovies = movies.filter(m => {
    if (filterStatus === 'published' && m.status !== 'published') return false;
    if (filterStatus === 'scheduled' && m.status !== 'scheduled') return false;
    if (filterStatus === 'originals' && !m.isOriginal) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-brand" /> Video Catalog Management
            </h1>
            <p className="text-xs text-zinc-400">Manage 4K stream metadata, scheduled releases, and HLS renditions.</p>
          </div>
        </div>

        <Link
          href="/admin/upload"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl text-xs shadow-xl red-glow transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Video</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-2xl w-fit text-xs font-semibold">
        {['all', 'published', 'scheduled', 'originals'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl capitalize transition-all ${
              filterStatus === st ? 'bg-brand text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Videos Data Table */}
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Media</th>
                <th className="p-4">Type & Rating</th>
                <th className="p-4">Resolutions</th>
                <th className="p-4">Views</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredMovies.map(movie => (
                <tr key={movie.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{movie.title}</h4>
                      <p className="text-[11px] text-zinc-400 truncate max-w-xs">{movie.genres.join(', ')}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <span className="font-semibold uppercase text-white">{movie.type}</span>
                      <span className="block border border-zinc-700 w-fit px-1.5 py-0.5 rounded text-[10px] text-zinc-300">
                        {movie.rating}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {movie.availableResolutions.map(r => (
                        <span key={r} className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[10px] font-mono">
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-white">
                    {movie.viewsCount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      movie.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {movie.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleOriginal(movie.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        movie.isOriginal ? 'bg-brand/20 border-brand text-brand' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                      title="Toggle StreamVault Original"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/watch/${movie.id}`}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl inline-block border border-zinc-700"
                      title="Preview Player"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Fast metadata editor and deletion modal

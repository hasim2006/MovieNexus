'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Pin, ArrowUp, ArrowDown, Save, CheckCircle2, Shield, Eye, Download } from 'lucide-react';
import { getStoredMovies, saveStoredMovies, getStoredSectionConfigs, saveStoredSectionConfigs, addAuditLogEntry, getAdminSession } from '../../../lib/db';
import { MediaItem, SectionConfig } from '../../../types';

export default function AdminSectionsPage() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setMovies(getStoredMovies());
    setSections(getStoredSectionConfigs());
    setSession(getAdminSession());
  }, []);

  const handlePriorityChange = (movieId: string, newRank: number) => {
    const updated = movies.map(m =>
      m.id === movieId ? { ...m, priorityRank: Math.max(1, newRank) } : m
    );
    setMovies(updated);
  };

  const handleSectionAssignment = (movieId: string, sectionCat: string) => {
    const updated = movies.map(m =>
      m.id === movieId ? { ...m, assignedSection: sectionCat } : m
    );
    setMovies(updated);
  };

  const handleToggleDownload = (movieId: string) => {
    const updated = movies.map(m =>
      m.id === movieId ? { ...m, allowDownloads: !m.allowDownloads } : m
    );
    setMovies(updated);
  };

  const handleSaveLayout = () => {
    saveStoredMovies(movies);
    saveStoredSectionConfigs(sections);

    addAuditLogEntry({
      adminUsername: session?.username || 'admin',
      role: session?.role || 'super_admin',
      action: 'REORDER_SECTION',
      targetResource: 'Homepage Content Controller',
      ipAddress: '192.168.1.45',
      status: 'success',
      details: 'Updated movie priority rankings and section assignments',
    });

    setSuccessMsg('Homepage layout & movie priorities saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Sort movies by priorityRank ascending (1, 2, 3...)
  const sortedMovies = [...movies].sort((a, b) => a.priorityRank - b.priorityRank);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-brand" /> Homepage Content & Priority Controller
            </h1>
            <p className="text-xs text-zinc-400">Control movie placement, row pinning, priority ranks, and download toggles without coding.</p>
          </div>
        </div>

        <button
          onClick={handleSaveLayout}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-extrabold rounded-xl text-xs shadow-xl red-glow transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Homepage Layout</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Priority Table */}
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Media Priority Rankings & Homepage Sections</h3>
          <span className="text-xs text-zinc-400">Higher priority (e.g. Rank 1) displays first</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/40 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Rank #</th>
                <th className="p-4">Media</th>
                <th className="p-4">Assigned Homepage Section</th>
                <th className="p-4">Download Permission</th>
                <th className="p-4 text-right">Priority Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {sortedMovies.map((movie, idx) => (
                <tr key={movie.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-brand text-sm">
                    #{movie.priorityRank}
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <img src={movie.posterUrl} alt={movie.title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{movie.title}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                        <span className="text-emerald-400 font-semibold">{movie.matchPercentage}% Match</span>
                        <span>•</span>
                        <span>{movie.genres.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={movie.assignedSection || 'trending'}
                      onChange={(e) => handleSectionAssignment(movie.id, e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand"
                    >
                      <option value="hero">Billboard Hero Featured</option>
                      <option value="originals">StreamVault Originals Shelf</option>
                      <option value="trending">Trending Worldwide Shelf</option>
                      <option value="scifi">Sci-Fi & Cyberpunk Shelf</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleDownload(movie.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        movie.allowDownloads ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{movie.allowDownloads ? 'Downloads Enabled' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handlePriorityChange(movie.id, movie.priorityRank - 1)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition-colors"
                      title="Move Up Priority"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePriorityChange(movie.id, movie.priorityRank + 1)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl border border-zinc-700 transition-colors"
                      title="Move Down Priority"
                    >
                      <ArrowDown className="w-4 h-4" />
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

// Priority weight reordering calculation

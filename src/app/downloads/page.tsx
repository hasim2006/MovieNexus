'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Play, Pause, Trash2, HardDrive, ShieldCheck, Film, Sparkles, CheckCircle2 } from 'lucide-react';
import { getStoredDownloads, removeOfflineDownload, updateDownloadProgress, calculateTotalStorageUsed, startOfflineDownload } from '../../lib/downloads-db';
import { getStoredMovies } from '../../lib/db';
import { DownloadItem, MediaItem } from '../../types';

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);

  useEffect(() => {
    setDownloads(getStoredDownloads());
    setMovies(getStoredMovies());
  }, []);

  const handleStartDemoDownload = (movie: MediaItem) => {
    const item = startOfflineDownload(movie, '1080p');
    setDownloads(getStoredDownloads());

    // Simulate progress
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      updateDownloadProgress(item.id, p);
      setDownloads(getStoredDownloads());
      if (p >= 100) clearInterval(interval);
    }, 400);
  };

  const handleRemoveDownload = (id: string) => {
    removeOfflineDownload(id);
    setDownloads(getStoredDownloads());
  };

  const handleTogglePause = (id: string, currentStatus: DownloadItem['status']) => {
    const nextStatus = currentStatus === 'downloading' ? 'paused' : 'downloading';
    updateDownloadProgress(id, getStoredDownloads().find(d => d.id === id)?.progressPercent || 50, nextStatus);
    setDownloads(getStoredDownloads());
  };

  const storageMeter = calculateTotalStorageUsed(downloads);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Storage Quota Meter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Download className="w-7 h-7 text-brand" /> In-App Offline Downloads
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Downloaded streams are encrypted and playable offline exclusively inside StreamVault.
          </p>
        </div>

        {/* Storage Bar */}
        <div className="p-4 bg-[#121215] border border-zinc-800 rounded-2xl space-y-2 w-full md:w-80 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-sky-400" /> Offline Storage
            </span>
            <span className="font-mono text-white font-bold">{storageMeter.usedMB} MB / 50 GB</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400" style={{ width: `${Math.max(2, (storageMeter.usedMB / 50000) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Download Items List */}
      {downloads.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloads.map(item => (
              <div key={item.id} className="p-4 bg-[#121215] border border-zinc-800 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center gap-4">
                  <img src={item.posterUrl} alt={item.title} className="w-16 h-22 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{item.title}</h3>
                      <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.quality}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400">
                      {(item.downloadedBytes / 1048576).toFixed(1)} MB / {(item.fileSizeBytes / 1048576).toFixed(1)} MB
                    </p>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand/20 text-brand animate-pulse'
                      }`}>
                        {item.status}
                      </span>
                      {item.status === 'downloading' && (
                        <span className="text-[11px] text-zinc-400 font-mono">{item.downloadSpeedMbps} Mbps</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand red-glow transition-all duration-300" style={{ width: `${item.progressPercent}%` }} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  {item.status === 'completed' ? (
                    <Link
                      href={`/watch/${item.mediaId}`}
                      className="px-4 py-2 bg-brand text-white rounded-xl text-xs font-bold flex items-center gap-1.5 red-glow"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Play Offline Stream
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleTogglePause(item.id, item.status)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      {item.status === 'downloading' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{item.status === 'downloading' ? 'Pause' : 'Resume'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleRemoveDownload(item.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors"
                    title="Remove Download"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-[#121215] rounded-3xl border border-zinc-800 shadow-2xl">
          <Download className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">No active downloads</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Download your favorite 4K titles to enjoy uninterrupted streaming without internet access.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            {movies.slice(0, 2).map(m => (
              <button
                key={m.id}
                onClick={() => handleStartDemoDownload(m)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-zinc-700 transition-all"
              >
                + Demo Download "{m.title}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

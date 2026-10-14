'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, HardDrive, Zap, Upload, Film, Shield, TrendingUp, Activity,
  Globe, CheckCircle2, AlertCircle, ArrowUpRight
} from 'lucide-react';
import { getStoredAnalytics, getStoredTranscodes, getStoredMovies } from '../../lib/db';
import { StreamingAnalytics, TranscodeJob, MediaItem } from '../../types';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<StreamingAnalytics | null>(null);
  const [transcodes, setTranscodes] = useState<TranscodeJob[]>([]);
  const [moviesCount, setMoviesCount] = useState<number>(0);

  useEffect(() => {
    setAnalytics(getStoredAnalytics());
    setTranscodes(getStoredTranscodes());
    setMoviesCount(getStoredMovies().length);
  }, []);

  if (!analytics) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Admin Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand" />
            <h1 className="text-3xl font-black text-white">StreamVault Admin Studio</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time CDN metrics, transcoding cluster status, and storage telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/upload"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl text-xs shadow-xl red-glow transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New 4K Video</span>
          </Link>
          <Link
            href="/admin/videos"
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <Film className="w-4 h-4" />
            <span>Video Manager ({moviesCount})</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Concurrent Viewers</span>
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics.totalViewersNow.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% peak at {analytics.peakViewersToday.toLocaleString()} today
          </p>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Cloud Storage Usage</span>
            <HardDrive className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics.storageUsedTB} <span className="text-sm text-zinc-400 font-normal">/ {analytics.storageLimitTB} TB</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400" style={{ width: `${(analytics.storageUsedTB / analytics.storageLimitTB) * 100}%` }} />
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Egress CDN Bandwidth</span>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics.bandwidthUsedTB} <span className="text-sm text-zinc-400 font-normal">TB this month</span>
          </div>
          <p className="text-[11px] text-zinc-400">Avg Bitrate: {analytics.avgBitrateMbps} Mbps</p>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Transcode Nodes</span>
            <Upload className="w-5 h-5 text-brand" />
          </div>
          <div className="text-3xl font-black text-white">
            {analytics.activeEncodes} <span className="text-sm text-zinc-400 font-normal">encoding jobs</span>
          </div>
          <p className="text-[11px] text-brand font-semibold">240p to 4K HLS Master Renditions</p>
        </div>
      </div>

      {/* Active Transcoding Pipeline Progress */}
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand" /> Transcoding Cluster Jobs
          </h3>
          <Link href="/admin/upload" className="text-xs font-bold text-brand hover:underline">
            + New Video Upload
          </Link>
        </div>

        <div className="space-y-3">
          {transcodes.map(job => (
            <div key={job.id} className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{job.mediaTitle}</h4>
                  <p className="text-xs text-zinc-400">{job.originalFileName} ({(job.fileSizeBytes / 1073741824).toFixed(1)} GB)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand/20 text-brand animate-pulse'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{job.progress}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand to-red-500 red-glow transition-all duration-500" style={{ width: `${job.progress}%` }} />
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>Current Step: {job.currentStep}</span>
                <span>Renditions: {job.resolutionsCompleted.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & Geographic Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Breakdown */}
        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base">Viewer Quality Distribution</h3>
          <div className="space-y-3">
            {analytics.resolutionBreakdown.map((res) => (
              <div key={res.resolution} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{res.resolution} Quality</span>
                  <span className="font-mono text-zinc-400">{res.percentage}% of streams</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${res.resolution === '4K' ? 'bg-amber-400' : res.resolution === '1080p' ? 'bg-brand' : 'bg-zinc-600'}`}
                    style={{ width: `${res.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geo Distribution */}
        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" /> Top Viewer Geographic Regions
          </h3>
          <div className="space-y-3">
            {analytics.topGeoLocations.map((geo) => (
              <div key={geo.country} className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">{geo.flag}</span>
                  <span className="font-medium text-white">{geo.country}</span>
                </div>
                <span className="font-mono font-semibold text-sky-400">{geo.count.toLocaleString()} active streams</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin active navigation indicator styling

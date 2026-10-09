'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, Cpu, HardDrive, ShieldCheck, Zap, Server, RefreshCw } from 'lucide-react';
import { getStoredHealth } from '../../../lib/db';
import { SystemHealth } from '../../../types';

export default function AdminHealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    setHealth(getStoredHealth());
  }, []);

  if (!health) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-brand" /> System Health & Diagnostics Telemetry
            </h1>
            <p className="text-xs text-zinc-400">Real-time health monitoring of API latency, memory, CDN edges, and security block rates.</p>
          </div>
        </div>

        <button
          onClick={() => setHealth(getStoredHealth())}
          className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-zinc-700"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Status
        </button>
      </div>

      {/* Main Health Banner */}
      <div className="p-6 bg-[#121215] border border-zinc-800 rounded-3xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white capitalize">System Status: {health.status}</h2>
            <p className="text-xs text-zinc-400">All 14 global CDN edge clusters and API routes are running within normal parameters.</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-extrabold uppercase tracking-wider">
          100% Operational
        </span>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>CPU Load</span>
            <Cpu className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-black text-white">{health.cpuUsagePercent}%</div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand red-glow" style={{ width: `${health.cpuUsagePercent}%` }} />
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>RAM Allocation</span>
            <HardDrive className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white">{health.memoryUsedMB} MB</div>
          <p className="text-[11px] text-zinc-400">Of {health.memoryTotalMB} MB total memory</p>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Avg API Response</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{health.apiResponseAvgMs} ms</div>
          <p className="text-[11px] text-emerald-400 font-semibold">Sub-50ms latency target</p>
        </div>

        <div className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Security Blocks</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{health.securityThreatsBlocked}</div>
          <p className="text-[11px] text-zinc-400">XSS, CSRF & SQLi attempts neutralised</p>
        </div>
      </div>
    </div>
  );
}

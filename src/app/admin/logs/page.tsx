'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, FileText, Filter, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';
import { getStoredAuditLogs } from '../../../lib/db';
import { AuditLogEntry } from '../../../types';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    setLogs(getStoredAuditLogs());
  }, []);

  const filteredLogs = logs.filter(log => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.adminUsername.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.targetResource.toLowerCase().includes(q) ||
        log.ipAddress.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-brand" /> Security & Activity Audit Logs
            </h1>
            <p className="text-xs text-zinc-400">Complete audit trail of content modifications, uploads, section reorders, and logins.</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3" />
            <input
              type="text"
              placeholder="Search user, action, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="denied">Denied / Lockout</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#121215] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 text-zinc-400 font-semibold border-b border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin User & Role</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-4 text-zinc-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="font-sans">
                      <span className="font-bold text-white block">{log.adminUsername}</span>
                      <span className="text-[10px] text-brand uppercase font-bold bg-brand/10 px-1.5 py-0.2 rounded">
                        {log.role}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-zinc-200">
                    {log.action}
                  </td>
                  <td className="p-4 text-zinc-300 font-sans">
                    {log.targetResource}
                    {log.details && <p className="text-[10px] text-zinc-500">{log.details}</p>}
                  </td>
                  <td className="p-4 text-sky-400">
                    {log.ipAddress}
                  </td>
                  <td className="p-4 font-sans">
                    {log.status === 'success' ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Success
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px]">
                        <XCircle className="w-3 h-3" /> Denied
                      </span>
                    )}
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

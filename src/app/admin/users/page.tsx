'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Shield, ArrowLeft, UserCheck, Key, UserX } from 'lucide-react';
import { getStoredUser, saveStoredUser } from '../../../lib/db';
import { User } from '../../../types';

export default function AdminUsersPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-brand" /> User Access & Permissions
            </h1>
            <p className="text-xs text-zinc-400">Control active viewer subscriptions, roles, and profile security.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#121215] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Registered Account Overview</h3>
          <span className="bg-brand/10 text-brand border border-brand/30 px-3 py-1 rounded-full text-xs font-bold">
            Total Users: 1
          </span>
        </div>

        <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profiles[0]?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand"
            />
            <div>
              <h4 className="font-bold text-white text-base">{user.name}</h4>
              <p className="text-xs text-zinc-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                  Email Verified
                </span>
                <span className="bg-brand/20 text-brand text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Profiles: {user.profiles.length} (Adult, Kids)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

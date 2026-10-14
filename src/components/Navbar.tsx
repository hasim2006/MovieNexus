'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, Film, Shield, User as UserIcon, LogOut, ChevronDown, CheckCircle, Download, Layers, FileText, Activity } from 'lucide-react';
import { getStoredUser, getAdminSession, saveAdminSession } from '../lib/db';
import { User, UserProfile } from '../types';
import AuthModal from './auth/AuthModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [adminSession, setAdminSession] = useState<any>(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadedUser = getStoredUser();
    setUser(loadedUser);
    const prof = loadedUser.profiles.find(p => p.id === loadedUser.activeProfileId) || loadedUser.profiles[0];
    setActiveProfile(prof);
    setAdminSession(getAdminSession());

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSwitchProfile = (profileId: string) => {
    if (!user) return;
    const target = user.profiles.find(p => p.id === profileId);
    if (target) {
      const updatedUser = { ...user, activeProfileId: profileId };
      setUser(updatedUser);
      setActiveProfile(target);
      setIsProfileMenuOpen(false);
    }
  };

  const handleAdminSignOut = () => {
    saveAdminSession(null);
    setAdminSession(null);
    router.push('/');
  };

  // Hide navbar in fullscreen video player view
  if (pathname.startsWith('/watch/')) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-[#09090b]/90 backdrop-blur-md shadow-2xl py-3 border-b border-white/5' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Brand & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-red-700 flex items-center justify-center red-glow group-hover:scale-105 transition-transform duration-300">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-zinc-200 to-red-500 bg-clip-text text-transparent">
                STREAM<span className="text-brand">VAULT</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className={`transition-colors duration-200 ${pathname === '/' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Home
              </Link>
              <Link
                href="/browse?category=series"
                className={`transition-colors duration-200 ${pathname.includes('series') ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                TV Series
              </Link>
              <Link
                href="/browse?category=movies"
                className={`transition-colors duration-200 ${pathname.includes('movies') ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Movies
              </Link>
              <Link
                href="/browse?category=originals"
                className={`flex items-center gap-1.5 transition-colors duration-200 ${pathname.includes('originals') ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-brand text-white">Originals</span>
              </Link>
              <Link
                href="/downloads"
                className={`flex items-center gap-1 transition-colors duration-200 ${pathname === '/downloads' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                <Download className="w-4 h-4 text-sky-400" />
                <span>Downloads</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-4">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              {isSearchOpen ? (
                <div className="relative flex items-center animate-fade-in">
                  <input
                    type="text"
                    placeholder="Titles, actors, genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-48 sm:w-64 bg-zinc-900/90 border border-zinc-700/80 text-white text-xs sm:text-sm rounded-full pl-9 pr-8 py-1.5 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  />
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2.5 text-zinc-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-zinc-800/60"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </form>

            {/* Admin Link */}
            {adminSession ? (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-brand/20 text-brand border border-brand/40 transition-all hover:scale-105 red-glow"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Studio</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                className="p-2 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-zinc-800/60 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand animate-pulse" />
              </button>

              {isNotifMenuOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-dropdown p-4 shadow-2xl z-50 text-xs animate-slide-up">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                    <span className="font-bold text-white text-sm">Notifications</span>
                    <span className="text-[10px] text-brand uppercase font-bold bg-brand/10 px-2 py-0.5 rounded">New Releases</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-zinc-800/40 transition-colors cursor-pointer">
                      <img
                        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=120"
                        alt="Cyber Genesis"
                        className="w-12 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-semibold text-white leading-tight">Cyber Genesis 2099</p>
                        <p className="text-zinc-400 text-[11px] mt-1">Now available in 4K HDR & Dolby Atmos!</p>
                        <span className="text-[10px] text-zinc-500 mt-1 block">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth Toggle */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-800/60 transition-colors"
                >
                  <img
                    src={activeProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                    alt={activeProfile?.name || 'User Profile'}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand/60"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-dropdown p-2 shadow-2xl z-50 animate-slide-up text-xs">
                    <div className="p-3 border-b border-zinc-800/80 mb-1">
                      <p className="font-semibold text-white text-sm">{activeProfile?.name}</p>
                      <p className="text-zinc-400 text-[11px] truncate">{user.email}</p>
                    </div>

                    <div className="py-1 space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase">Switch Profile</div>
                      {user.profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSwitchProfile(p.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                            p.id === activeProfile?.id ? 'bg-zinc-800/80 text-white font-medium' : 'text-zinc-300 hover:bg-zinc-800/40'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover" />
                            <span>{p.name}</span>
                          </div>
                          {p.id === activeProfile?.id && <CheckCircle className="w-3.5 h-3.5 text-brand" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                      <Link
                        href="/downloads"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4 text-sky-400" />
                        <span>Offline Downloads</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Account & History</span>
                      </Link>

                      {adminSession && (
                        <>
                          <div className="px-3 py-1 text-[10px] font-bold text-brand uppercase border-t border-zinc-800/80 mt-1 pt-2">
                            Admin Controls ({adminSession.role})
                          </div>
                          <Link
                            href="/admin/sections"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl"
                          >
                            <Layers className="w-4 h-4 text-amber-400" />
                            <span>Section Controller</span>
                          </Link>
                          <Link
                            href="/admin/logs"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl"
                          >
                            <FileText className="w-4 h-4 text-sky-400" />
                            <span>Security Logs</span>
                          </Link>
                          <Link
                            href="/admin/health"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800/40 rounded-xl"
                          >
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span>Health Diagnostics</span>
                          </Link>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsAuthOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand hover:bg-brand-hover text-white transition-all shadow-lg red-glow"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}
    </>
  );
}

// ARIA role navigation and accessible labels

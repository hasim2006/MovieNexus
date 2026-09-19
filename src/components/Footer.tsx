import React from 'react';
import Link from 'next/link';
import { Film, Globe, ShieldCheck, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/60 bg-[#060608] text-zinc-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center red-glow">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-wider text-white">
                STREAM<span className="text-brand">VAULT</span>
              </span>
            </Link>
            <p className="text-zinc-400 max-w-sm text-xs leading-relaxed">
              StreamVault is a high-performance 4K Ultra HD video streaming engine featuring adaptive HLS bitrate playback, CDN edge distribution, and multi-track audio engineering.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Global CDN Operational
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-300 text-[11px] font-medium">
                <Zap className="w-3 h-3 text-amber-400" /> HLS v7.0
              </span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Home Billboard</Link></li>
              <li><Link href="/browse?category=movies" className="hover:text-white transition-colors">4K Movies</Link></li>
              <li><Link href="/browse?category=series" className="hover:text-white transition-colors">TV Series</Link></li>
              <li><Link href="/browse?category=originals" className="hover:text-white transition-colors">StreamVault Originals</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">My Watchlist</Link></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Engine & Security</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer transition-colors">Adaptive Bitrate HLS</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Anti-Hotlink Tokens</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">DDoS & Rate Limiting</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Signed Video Credentials</span></li>
              <li><Link href="/admin" className="hover:text-brand transition-colors font-medium">Admin Upload Studio</Link></li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Legal & Help</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Cookie Preferences</span></li>
              <li><span className="hover:text-white cursor-pointer transition-colors">Help Center</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 py-1 focus:outline-none text-[11px]">
              <option>English (US)</option>
              <option>Español</option>
              <option>Français</option>
              <option>Deutsch</option>
              <option>日本語</option>
            </select>
          </div>

          <p>© {new Date().getFullYear()} StreamVault Engine. All rights reserved. Built with Next.js 15, TypeScript & HLS Video.</p>
        </div>
      </div>
    </footer>
  );
}

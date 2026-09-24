'use client';

import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Code2, Share2, Twitter, Facebook, Send } from 'lucide-react';
import { MediaItem } from '../../types';
import QRCodeDisplay from './QRCodeDisplay';

interface ShareModalProps {
  movie: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ movie, isOpen, onClose }: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'qr'>('link');

  if (!isOpen || !movie) return null;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/watch/${movie.id}` : `https://streamvault.app/watch/${movie.id}`;
  const embedCode = `<iframe src="${shareUrl}?embed=true" width="100%" height="450" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;

  const copyToClipboard = (text: string, type: 'link' | 'embed') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Watch ${movie.title} in 4K HDR on StreamVault!`)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-zinc-800 text-white hover:bg-zinc-700',
    },
    {
      name: 'WhatsApp',
      icon: Send,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Stream ${movie.title} in 4K: ${shareUrl}`)}`,
      color: 'bg-emerald-600 text-white hover:bg-emerald-500',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 text-white hover:bg-blue-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121215] border border-zinc-700/80 rounded-3xl p-6 shadow-2xl space-y-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand" />
            <h3 className="font-bold text-lg text-white">Share "{movie.title}"</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'link' ? 'bg-brand text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Direct Link
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'embed' ? 'bg-brand text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1" /> Embed Video
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'qr' ? 'bg-brand text-white shadow-md font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 inline mr-1" /> QR Code
          </button>
        </div>

        {/* Content by Active Tab */}
        {activeTab === 'link' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Stream Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(shareUrl, 'link')}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors border border-zinc-700"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-zinc-400">Share to Social</label>
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all ${s.color}`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span>{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'embed' && (
          <div className="space-y-3">
            <label className="text-xs font-medium text-zinc-400">Embed Video HTML Snippet</label>
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none leading-relaxed"
            />
            <button
              onClick={() => copyToClipboard(embedCode, 'embed')}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-md red-glow"
            >
              {copiedEmbed ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Embed Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Embed Snippet</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <QRCodeDisplay url={shareUrl} size={180} />
            <p className="text-xs text-zinc-400 text-center max-w-xs">
              Point your smartphone camera to instantly open and watch on mobile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

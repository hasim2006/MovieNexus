'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Hls from 'hls.js';
import {
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize,
  Minimize, Settings, Subtitles, Disc, ArrowLeft, Share2, PictureInPicture,
  Sparkles, Check, Zap, AlertCircle
} from 'lucide-react';
import { MediaItem, Resolution } from '../../types';

interface StreamPlayerProps {
  movie: MediaItem;
  initialTimestamp?: number;
  onOpenShare?: () => void;
}

export default function StreamPlayer({ movie, initialTimestamp = 0, onOpenShare }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(initialTimestamp);
  const [duration, setDuration] = useState(movie.durationSeconds || 100);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState<Resolution | 'Auto'>('Auto');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>('Off');
  const [selectedAudio, setSelectedAudio] = useState<string>(movie.audioLanguages[0] || 'Original');
  const [activeMenu, setActiveMenu] = useState<'none' | 'quality' | 'speed' | 'subtitles' | 'audio'>('none');
  const [isBuffering, setIsBuffering] = useState(false);
  const [networkSpeedMbps, setNetworkSpeedMbps] = useState<number>(14.5);
  const [resumeNotice, setResumeNotice] = useState<string | null>(
    initialTimestamp > 10 ? `Resuming from ${Math.floor(initialTimestamp / 60)}:${(initialTimestamp % 60).toString().padStart(2, '0')}` : null
  );

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize HLS.js or native HTML5 video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = movie.hlsMasterUrl || movie.videoUrl;

    if (Hls.isSupported() && streamUrl.endsWith('.m3u8')) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (initialTimestamp > 0) {
          video.currentTime = initialTimestamp;
        }
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        // Measure real network throughput
        if (data.frag.stats.bwEstimate) {
          setNetworkSpeedMbps(parseFloat((data.frag.stats.bwEstimate / 1000000).toFixed(1)));
        }
      });

      hls.on(Hls.Events.ERROR, () => {
        // Fallback to MP4 progressive stream if HLS fails
        video.src = movie.videoUrl;
      });
    } else {
      video.src = movie.videoUrl;
      if (initialTimestamp > 0) {
        video.currentTime = initialTimestamp;
      }
      video.play().catch(() => setIsPlaying(false));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [movie]);

  // Handle controls auto-hide on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setActiveMenu('none');
      }
    }, 3500);
  };

  // Synchronize play state
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'KeyK'].includes(e.code)) {
        e.preventDefault();
        togglePlay();
      } else if (['ArrowRight'].includes(e.code)) {
        seekRelative(10);
      } else if (['ArrowLeft'].includes(e.code)) {
        seekRelative(-10);
      } else if (['KeyF'].includes(e.code)) {
        toggleFullscreen();
      } else if (['KeyM'].includes(e.code)) {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      setDuration(videoRef.current.duration || 100);

      // Save continue watching timestamp locally
      if (Math.floor(cur) % 5 === 0) {
        try {
          const userRaw = localStorage.getItem('streamvault_user');
          if (userRaw) {
            const user = JSON.parse(userRaw);
            const activeProfile = user.profiles.find((p: any) => p.id === user.activeProfileId);
            if (activeProfile) {
              const existingIdx = activeProfile.continueWatching.findIndex((c: any) => c.mediaId === movie.id);
              const entry = {
                mediaId: movie.id,
                timestamp: Math.floor(cur),
                durationSeconds: Math.floor(videoRef.current.duration || 100),
                updatedAt: new Date().toISOString(),
              };
              if (existingIdx >= 0) {
                activeProfile.continueWatching[existingIdx] = entry;
              } else {
                activeProfile.continueWatching.push(entry);
              }
              localStorage.setItem('streamvault_user', JSON.stringify(user));
            }
          }
        } catch (e) {}
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setActiveMenu('none');
  };

  const handleQualityChange = (res: Resolution | 'Auto') => {
    setSelectedQuality(res);
    if (hlsRef.current) {
      if (res === 'Auto') {
        hlsRef.current.currentLevel = -1; // Auto ABR
      } else {
        const levels = hlsRef.current.levels;
        const matchingIdx = levels.findIndex(l => l.height && `${l.height}p` === res);
        if (matchingIdx >= 0) {
          hlsRef.current.currentLevel = matchingIdx;
        }
      }
    }
    setActiveMenu('none');
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {}
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-black overflow-hidden select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Subtitles Overlay */}
      {selectedSubtitle !== 'Off' && (
        <div className="absolute bottom-24 inset-x-0 text-center pointer-events-none z-30 px-4">
          <span className="inline-block bg-black/85 text-amber-300 px-4 py-1.5 rounded-lg text-sm sm:text-base font-semibold tracking-wide border border-amber-400/20 backdrop-blur-sm shadow-xl">
            [Subtitle: {selectedSubtitle}] Cybernetic system core operational.
          </span>
        </div>
      )}

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin red-glow" />
        </div>
      )}

      {/* Resume Banner Notification */}
      {resumeNotice && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/90 text-white text-xs font-bold px-4 py-2 rounded-2xl border border-brand/40 shadow-2xl flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4 text-brand" />
          <span>{resumeNotice}</span>
          <button onClick={() => setResumeNotice(null)} className="ml-2 text-zinc-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 inset-x-0 z-30 p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full transition-all border border-zinc-700/60"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-base sm:text-lg">{movie.title}</h1>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="text-emerald-400 font-semibold">{selectedQuality}</span>
              <span>•</span>
              <span>Network: {networkSpeedMbps} Mbps</span>
              {movie.is4K && <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-1.5 rounded">4K</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full backdrop-blur-md border border-zinc-700/60 transition-all"
              title="Share Stream"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Seek Bar */}
        <div className="relative flex items-center group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              if (videoRef.current) videoRef.current.currentTime = val;
            }}
            className="w-full h-1.5 bg-zinc-700/80 rounded-lg appearance-none cursor-pointer accent-brand focus:outline-none"
          />
          <div
            className="absolute left-0 h-1.5 bg-brand rounded-lg pointer-events-none red-glow"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-2 bg-white hover:bg-zinc-200 text-black rounded-full transition-transform hover:scale-110 shadow-lg"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button onClick={() => seekRelative(-10)} className="text-zinc-300 hover:text-white transition-colors" title="Skip -10s">
              <RotateCcw className="w-5 h-5" />
            </button>

            <button onClick={() => seekRelative(10)} className="text-zinc-300 hover:text-white transition-colors" title="Skip +10s">
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="text-zinc-300 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-zinc-700 rounded appearance-none cursor-pointer accent-brand"
              />
            </div>

            {/* Timestamp Display */}
            <div className="font-mono text-zinc-300 text-xs tracking-wider">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 relative">
            {/* Speed Selector Toggle */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'speed' ? 'none' : 'speed')}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                  selectedSpeed !== 1.0 ? 'bg-brand text-white border-brand' : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
              >
                {selectedSpeed}x
              </button>

              {activeMenu === 'speed' && (
                <div className="absolute bottom-10 right-0 w-36 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400">Playback Speed</div>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedChange(spd)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left ${
                        selectedSpeed === spd ? 'bg-brand text-white font-bold' : 'hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <span>{spd}x {spd === 1.0 ? '(Normal)' : ''}</span>
                      {selectedSpeed === spd && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles Menu */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'subtitles' ? 'none' : 'subtitles')}
                className={`p-2 rounded-lg transition-colors ${
                  selectedSubtitle !== 'Off' ? 'bg-brand text-white' : 'text-zinc-300 hover:text-white'
                }`}
                title="Subtitles"
              >
                <Subtitles className="w-5 h-5" />
              </button>

              {activeMenu === 'subtitles' && (
                <div className="absolute bottom-10 right-0 w-44 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400">Subtitles</div>
                  {['Off', 'English [CC]', 'Spanish', 'French', 'German'].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setSelectedSubtitle(sub);
                        setActiveMenu('none');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left ${
                        selectedSubtitle === sub ? 'bg-brand text-white font-bold' : 'hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <span>{sub}</span>
                      {selectedSubtitle === sub && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Track Menu */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'audio' ? 'none' : 'audio')}
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Audio Tracks"
              >
                <Disc className="w-5 h-5" />
              </button>

              {activeMenu === 'audio' && (
                <div className="absolute bottom-10 right-0 w-52 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400">Audio Stream</div>
                  {movie.audioLanguages.map((aud) => (
                    <button
                      key={aud}
                      onClick={() => {
                        setSelectedAudio(aud);
                        setActiveMenu('none');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left text-xs ${
                        selectedAudio === aud ? 'bg-brand text-white font-bold' : 'hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <span className="truncate">{aud}</span>
                      {selectedAudio === aud && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Resolution Menu */}
            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === 'quality' ? 'none' : 'quality')}
                className="p-2 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 font-bold text-xs"
                title="Resolution Quality"
              >
                <Settings className="w-5 h-5" />
              </button>

              {activeMenu === 'quality' && (
                <div className="absolute bottom-10 right-0 w-44 glass-dropdown rounded-2xl p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400">Resolution</div>
                  {(['Auto', '4K', '1440p', '1080p', '720p', '480p', '360p'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQualityChange(q)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left ${
                        selectedQuality === q ? 'bg-brand text-white font-bold' : 'hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <span>{q} {q === '4K' ? '(UHD)' : q === '1080p' ? '(FHD)' : ''}</span>
                      {selectedQuality === q && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture-in-Picture */}
            <button onClick={togglePiP} className="p-2 text-zinc-300 hover:text-white transition-colors" title="Picture in Picture">
              <PictureInPicture className="w-5 h-5" />
            </button>

            {/* Fullscreen Toggle */}
            <button onClick={toggleFullscreen} className="p-2 text-zinc-300 hover:text-white transition-colors" title="Fullscreen (F)">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

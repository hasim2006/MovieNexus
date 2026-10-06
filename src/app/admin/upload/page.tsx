'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, Film, ArrowLeft, CheckCircle2, RefreshCw, Calendar, Tag, Shield, Sparkles, Layers } from 'lucide-react';
import { getStoredMovies, saveStoredMovies, getStoredTranscodes, saveStoredTranscodes } from '../../../lib/db';
import { MediaItem, Resolution, ContentRating, TranscodeJob } from '../../../types';

export default function AdminUploadPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [rating, setRating] = useState<ContentRating>('TV-MA');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [genres, setGenres] = useState('Sci-Fi, Action, Cyberpunk');
  const [backdropUrl, setBackdropUrl] = useState('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000');
  const [posterUrl, setPosterUrl] = useState('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800');
  const [trailerUrl, setTrailerUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [is4K, setIs4K] = useState(true);
  const [isOriginal, setIsOriginal] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');

  const [selectedResolutions, setSelectedResolutions] = useState<Resolution[]>(['240p', '360p', '480p', '720p', '1080p', '1440p', '4K']);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [transcodeStep, setTranscodeStep] = useState<string>('');

  const handleResolutionToggle = (res: Resolution) => {
    if (selectedResolutions.includes(res)) {
      setSelectedResolutions(selectedResolutions.filter(r => r !== res));
    } else {
      setSelectedResolutions([...selectedResolutions, res]);
    }
  };

  const handleStartUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setUploadProgress(0);
    setTranscodeStep('Uploading file chunks (1/6)...');

    // Simulate multi-step HLS chunked transcode pipeline
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      setUploadProgress(Math.min(100, current));

      if (current === 30) {
        setTranscodeStep('Extracting keyframes & generating VTT subtitles (2/6)...');
      } else if (current === 60) {
        setTranscodeStep('Encoding multi-bitrate HLS renditions (240p -> 4K) (3/6)...');
      } else if (current === 90) {
        setTranscodeStep('Publishing master HLS playlist to CDN Edge (4/6)...');
      } else if (current >= 100) {
        clearInterval(interval);
        setTranscodeStep('Transcoding complete! Video published.');

        const newMovie: MediaItem = {
          id: `vid-${Date.now()}`,
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description,
          backdropUrl,
          posterUrl,
          trailerUrl,
          videoUrl,
          hlsMasterUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
          duration: '2h 05m',
          durationSeconds: 7500,
          releaseYear: 2026,
          rating,
          matchPercentage: 98,
          is4K,
          isHDR: true,
          isDolbyAtmos: true,
          isOriginal,
          isTrending: true,
          type,
          genres: genres.split(',').map(g => g.trim()),
          tags: ['4K Ultra HD', 'New Release'],
          director: director || 'StreamVault Studios',
          cast: cast ? cast.split(',').map(c => c.trim()) : ['Marcus Vance'],
          audioLanguages: ['English (Dolby Atmos)', 'Spanish'],
          subtitleLanguages: ['English [CC]', 'Spanish', 'French'],
          availableResolutions: selectedResolutions,
          status: scheduledDate ? 'scheduled' : 'published',
          scheduledPublishDate: scheduledDate || undefined,
          allowDownloads: true,
          priorityRank: 99,
          assignedSection: 'trending',
          createdAt: new Date().toISOString(),
          viewsCount: 1,
        };

        const existingMovies = getStoredMovies();
        saveStoredMovies([newMovie, ...existingMovies]);

        const newJob: TranscodeJob = {
          id: `job-${Date.now()}`,
          mediaTitle: title,
          originalFileName: `${title.toLowerCase().replace(/\s+/g, '_')}_master.mp4`,
          fileSizeBytes: 24500000000,
          status: 'completed',
          progress: 100,
          currentStep: 'CDN Master Playlist Published',
          resolutionsCompleted: selectedResolutions,
          resolutionsTotal: selectedResolutions,
          createdAt: new Date().toISOString(),
        };

        const existingJobs = getStoredTranscodes();
        saveStoredTranscodes([newJob, ...existingJobs]);

        setTimeout(() => {
          router.push('/admin/videos');
        }, 1200);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Upload className="w-6 h-6 text-brand" />
              4K HLS Video Upload Studio
            </h1>
            <p className="text-xs text-zinc-400">Chunked upload engine with automatic multi-bitrate HLS transcoding.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleStartUpload} className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2 flex items-center gap-2">
            <Film className="w-4 h-4 text-brand" /> Metadata & Classification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Genesis 2099"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Description</label>
              <textarea
                rows={3}
                required
                placeholder="Synopsis of the movie or series..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
              >
                <option value="movie">Feature Movie</option>
                <option value="series">TV Series</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
              >
                <option value="G">G (General Audiences)</option>
                <option value="PG">PG (Parental Guidance)</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R (Restricted)</option>
                <option value="TV-14">TV-14</option>
                <option value="TV-MA">TV-MA (Mature Audience)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Director</label>
              <input
                type="text"
                placeholder="e.g. Christopher Nolan"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Cast (comma separated)</label>
              <input
                type="text"
                placeholder="Marcus Vance, Aria Thorne"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300">Genres (comma separated)</label>
              <input
                type="text"
                placeholder="Sci-Fi, Action, Cyberpunk"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        {/* Media URLs & Transcode Options */}
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-zinc-800 pb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand" /> Resolution Renditions & Output Settings
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300">Target HLS Transcoding Resolutions</label>
            <div className="flex flex-wrap gap-2">
              {(['240p', '360p', '480p', '720p', '1080p', '1440p', '4K'] as Resolution[]).map((res) => (
                <button
                  type="button"
                  key={res}
                  onClick={() => handleResolutionToggle(res)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedResolutions.includes(res)
                      ? 'bg-brand text-white border-brand shadow-md red-glow'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <input
                type="checkbox"
                id="is4k-check"
                checked={is4K}
                onChange={(e) => setIs4K(e.target.checked)}
                className="w-4 h-4 accent-brand rounded cursor-pointer"
              />
              <label htmlFor="is4k-check" className="text-xs font-medium text-white cursor-pointer">
                Enable 4K Ultra HD Master Bitrate
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <input
                type="checkbox"
                id="original-check"
                checked={isOriginal}
                onChange={(e) => setIsOriginal(e.target.checked)}
                className="w-4 h-4 accent-brand rounded cursor-pointer"
              />
              <label htmlFor="original-check" className="text-xs font-medium text-white cursor-pointer">
                Mark as StreamVault Original
              </label>
            </div>
          </div>

          {/* Scheduled Publishing */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand" /> Scheduled Publish Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Progress Visualizer */}
        {uploadProgress !== null && (
          <div className="p-4 bg-zinc-900 border border-brand/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{transcodeStep}</span>
              <span className="font-mono text-brand font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand red-glow transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploadProgress !== null}
          className="w-full py-3.5 bg-brand hover:bg-brand-hover text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-xl red-glow flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Start Chunked Upload & HLS Transcode</span>
        </button>
      </form>
    </div>
  );
}

// Transcoding queue visualizer: 1080p, 720p, 480p

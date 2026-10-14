import { DownloadItem, MediaItem, Resolution } from '../types';

const DOWNLOADS_KEY = 'streamvault_offline_downloads';

export function getStoredDownloads(): DownloadItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DOWNLOADS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveStoredDownloads(downloads: DownloadItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  } catch (e) {
    console.error('Failed to update offline downloads', e);
  }
}

export function startOfflineDownload(movie: MediaItem, quality: Resolution = '1080p'): DownloadItem {
  const existing = getStoredDownloads();
  const found = existing.find(d => d.mediaId === movie.id && d.quality === quality);
  if (found) return found;

  const estimatedBytes = quality === '4K' ? 3800000000 : quality === '1080p' ? 1400000000 : 700000000;

  const newItem: DownloadItem = {
    id: `dl-${Date.now()}`,
    mediaId: movie.id,
    title: movie.title,
    posterUrl: movie.posterUrl,
    quality,
    fileSizeBytes: estimatedBytes,
    downloadedBytes: 0,
    progressPercent: 0,
    status: 'downloading',
    downloadSpeedMbps: 28.5,
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...existing];
  saveStoredDownloads(updated);
  return newItem;
}

export function updateDownloadProgress(downloadId: string, progress: number, status?: DownloadItem['status']) {
  const existing = getStoredDownloads();
  const updated = existing.map(item => {
    if (item.id === downloadId) {
      const p = Math.min(100, Math.max(0, progress));
      const downloaded = Math.floor((p / 100) * item.fileSizeBytes);
      return {
        ...item,
        progressPercent: p,
        downloadedBytes: downloaded,
        status: status || (p === 100 ? 'completed' : 'downloading'),
      };
    }
    return item;
  });
  saveStoredDownloads(updated);
}

export function removeOfflineDownload(downloadId: string) {
  const existing = getStoredDownloads();
  const updated = existing.filter(item => item.id !== downloadId);
  saveStoredDownloads(updated);
}

export function calculateTotalStorageUsed(downloads: DownloadItem[]): { usedMB: number; totalQuotaMB: number } {
  const totalBytes = downloads.reduce((acc, curr) => acc + curr.downloadedBytes, 0);
  return {
    usedMB: parseFloat((totalBytes / 1048576).toFixed(1)),
    totalQuotaMB: 50000, // 50 GB simulated browser quota
  };
}

// AES stream chunk decryptor for offline playback

// Chunk stream reader optimization for 4K video files

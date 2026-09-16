export type Resolution = '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '4K';

export type ContentRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'TV-14' | 'TV-MA';

export type AdminRole = 'super_admin' | 'admin' | 'moderator';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  hlsMasterUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  trailerUrl: string;
  videoUrl: string; // Progressive fallback MP4
  hlsMasterUrl: string; // Adaptive HLS manifest .m3u8
  duration: string;
  durationSeconds: number;
  releaseYear: number;
  rating: ContentRating;
  matchPercentage: number;
  is4K: boolean;
  isHDR: boolean;
  isDolbyAtmos: boolean;
  isOriginal: boolean;
  isTrending: boolean;
  isTop10?: number;
  type: 'movie' | 'series';
  genres: string[];
  tags: string[];
  director: string;
  cast: string[];
  audioLanguages: string[];
  subtitleLanguages: string[];
  availableResolutions: Resolution[];
  status: 'published' | 'transcoding' | 'scheduled' | 'draft';
  scheduledPublishDate?: string;
  allowDownloads: boolean; // Download toggle per video
  priorityRank: number; // Numerical ordering (1 = highest priority)
  assignedSection?: string; // e.g. 'hero' | 'trending' | 'top_rated' | 'action' | 'drama'
  createdAt: string;
  viewsCount: number;
  seasons?: Season[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  pinProtected: boolean;
  continueWatching: {
    mediaId: string;
    timestamp: number;
    durationSeconds: number;
    updatedAt: string;
  }[];
  watchlist: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'subscriber';
  profiles: UserProfile[];
  activeProfileId: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  passwordHash: string;
  lastLogin?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminUsername: string;
  role: AdminRole;
  action: string; // e.g. 'UPLOAD_VIDEO' | 'REORDER_SECTION' | 'DELETE_VIDEO' | 'ADMIN_LOGIN'
  targetResource: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'denied';
  details?: string;
}

export interface SectionConfig {
  id: string;
  title: string;
  badge?: string;
  category: string;
  pinnedMediaIds: string[];
  displayOrder: number;
}

export interface DownloadItem {
  id: string;
  mediaId: string;
  title: string;
  posterUrl: string;
  quality: Resolution;
  fileSizeBytes: number;
  downloadedBytes: number;
  progressPercent: number;
  status: 'downloading' | 'paused' | 'completed' | 'failed';
  downloadSpeedMbps: number;
  localBlobUrl?: string;
  createdAt: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptimeSeconds: number;
  cpuUsagePercent: number;
  memoryUsedMB: number;
  memoryTotalMB: number;
  apiResponseAvgMs: number;
  cdnStatus: 'Operational' | 'Degraded';
  dbStatus: 'Connected' | 'Error';
  securityThreatsBlocked: number;
}

export interface TranscodeJob {
  id: string;
  mediaTitle: string;
  originalFileName: string;
  fileSizeBytes: number;
  status: 'uploading' | 'extracting' | 'transcoding' | 'manifest_generating' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  resolutionsCompleted: Resolution[];
  resolutionsTotal: Resolution[];
  createdAt: string;
}

export interface StreamingAnalytics {
  totalViewersNow: number;
  peakViewersToday: number;
  storageUsedTB: number;
  storageLimitTB: number;
  bandwidthUsedTB: number;
  avgBitrateMbps: number;
  activeEncodes: number;
  concurrencyTimeline: { time: string; viewers: number }[];
  resolutionBreakdown: { resolution: Resolution; percentage: number }[];
  topGeoLocations: { country: string; flag: string; count: number }[];
}

import { MediaItem, User, UserProfile, TranscodeJob, StreamingAnalytics, AdminUser, AuditLogEntry, SectionConfig, SystemHealth } from '../types';
import { SAMPLE_MOVIES, INITIAL_USER, INITIAL_ANALYTICS, INITIAL_TRANSCODE_JOBS, INITIAL_ADMIN_USERS, INITIAL_AUDIT_LOGS, INITIAL_SECTION_CONFIGS, INITIAL_HEALTH } from './sample-data';

const STORAGE_KEYS = {
  MOVIES: 'streamvault_movies',
  USER: 'streamvault_user',
  ADMIN_SESSION: 'streamvault_admin_session',
  ADMIN_USERS: 'streamvault_admin_users',
  AUDIT_LOGS: 'streamvault_audit_logs',
  SECTIONS: 'streamvault_sections',
  TRANSCODES: 'streamvault_transcodes',
  ANALYTICS: 'streamvault_analytics',
  HEALTH: 'streamvault_health',
};

export function getStoredMovies(): MediaItem[] {
  if (typeof window === 'undefined') return SAMPLE_MOVIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOVIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(SAMPLE_MOVIES));
      return SAMPLE_MOVIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SAMPLE_MOVIES;
  }
}

export function saveStoredMovies(movies: MediaItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  } catch (e) {
    console.error('Failed to save movies', e);
  }
}

export function getStoredUser(): User {
  if (typeof window === 'undefined') return INITIAL_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_USER;
  }
}

export function saveStoredUser(user: User) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {}
}

export function getAdminSession(): { username: string; name: string; role: 'super_admin' | 'admin' | 'moderator'; token: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveAdminSession(session: { username: string; name: string; role: 'super_admin' | 'admin' | 'moderator'; token: string } | null) {
  if (typeof window === 'undefined') return;
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  } else {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
  }
}

export function getStoredAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_AUDIT_LOGS;
  }
}

export function addAuditLogEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  const logs = getStoredAuditLogs();
  const updated = [newEntry, ...logs];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  }
  return newEntry;
}

export function getStoredSectionConfigs(): SectionConfig[] {
  if (typeof window === 'undefined') return INITIAL_SECTION_CONFIGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SECTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(INITIAL_SECTION_CONFIGS));
      return INITIAL_SECTION_CONFIGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SECTION_CONFIGS;
  }
}

export function saveStoredSectionConfigs(sections: SectionConfig[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  } catch (e) {}
}

export function getStoredTranscodes(): TranscodeJob[] {
  if (typeof window === 'undefined') return INITIAL_TRANSCODE_JOBS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSCODES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSCODES, JSON.stringify(INITIAL_TRANSCODE_JOBS));
      return INITIAL_TRANSCODE_JOBS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_TRANSCODE_JOBS;
  }
}

export function saveStoredTranscodes(jobs: TranscodeJob[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSCODES, JSON.stringify(jobs));
  } catch (e) {}
}

export function getStoredAnalytics(): StreamingAnalytics {
  if (typeof window === 'undefined') return INITIAL_ANALYTICS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(INITIAL_ANALYTICS));
      return INITIAL_ANALYTICS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ANALYTICS;
  }
}

export function getStoredHealth(): SystemHealth {
  if (typeof window === 'undefined') return INITIAL_HEALTH;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HEALTH, JSON.stringify(INITIAL_HEALTH));
      return INITIAL_HEALTH;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_HEALTH;
  }
}

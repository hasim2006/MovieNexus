import { AdminRole, AdminUser } from '../types';
import { INITIAL_ADMIN_USERS } from './sample-data';

const LOCKOUT_KEY = 'streamvault_login_attempts';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface LoginAttemptState {
  failedAttempts: number;
  lockedUntil?: string;
}

export function checkLoginLockout(username: string): { isLocked: boolean; remainingSeconds?: number } {
  if (typeof window === 'undefined') return { isLocked: false };
  try {
    const raw = localStorage.getItem(`${LOCKOUT_KEY}_${username}`);
    if (!raw) return { isLocked: false };
    const state: LoginAttemptState = JSON.parse(raw);
    if (state.lockedUntil) {
      const lockEnd = new Date(state.lockedUntil).getTime();
      const now = Date.now();
      if (now < lockEnd) {
        return {
          isLocked: true,
          remainingSeconds: Math.ceil((lockEnd - now) / 1000),
        };
      }
    }
  } catch (e) {}
  return { isLocked: false };
}

export function recordFailedLogin(username: string) {
  if (typeof window === 'undefined') return;
  try {
    const key = `${LOCKOUT_KEY}_${username}`;
    const raw = localStorage.getItem(key);
    let state: LoginAttemptState = raw ? JSON.parse(raw) : { failedAttempts: 0 };
    state.failedAttempts += 1;
    if (state.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      state.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
    }
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {}
}

export function clearFailedLogin(username: string) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${LOCKOUT_KEY}_${username}`);
}

export function verifyAdminCredentials(username: string, pass: string): AdminUser | null {
  const found = INITIAL_ADMIN_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!found) return null;
  // Demo password validation: accepts 'admin123' or 'superadmin123' or 'mod123'
  const validPasswords = ['admin123', 'superadmin123', 'mod123', 'streamvault2026'];
  if (validPasswords.includes(pass)) {
    return found;
  }
  return null;
}

// RBAC Role checks
export function hasPermission(role: AdminRole, requiredPermission: 'manage_sections' | 'upload_video' | 'delete_video' | 'view_logs' | 'system_health'): boolean {
  if (role === 'super_admin') return true;
  if (role === 'admin') {
    return requiredPermission !== 'system_health';
  }
  if (role === 'moderator') {
    return requiredPermission === 'view_logs' || requiredPermission === 'upload_video';
  }
  return false;
}

/**
 * StreamVault Security Library
 * Token-based video URL protection, rate limiting simulation & anti-hotlinking
 */

export function generateSecureVideoToken(mediaId: string, profileId: string, ttlSeconds: number = 3600): string {
  const timestamp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${mediaId}:${profileId}:${timestamp}`;
  // Simulating token generation (in production using HMAC-SHA256)
  const token = btoa(payload).replace(/=/g, '');
  return `${token}.${timestamp}`;
}

export function verifySecureVideoToken(token: string): { valid: boolean; mediaId?: string } {
  try {
    const [encodedPayload, timestampStr] = token.split('.');
    const timestamp = parseInt(timestampStr, 10);
    if (Date.now() / 1000 > timestamp) {
      return { valid: false };
    }
    const decoded = atob(encodedPayload + '==');
    const [mediaId] = decoded.split(':');
    return { valid: true, mediaId };
  } catch (e) {
    return { valid: false };
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatBitrate(bps: number): string {
  if (bps >= 1000000) {
    return `${(bps / 1000000).toFixed(1)} Mbps`;
  }
  return `${Math.round(bps / 1000)} Kbps`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

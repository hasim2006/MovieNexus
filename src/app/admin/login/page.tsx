'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User as UserIcon, AlertTriangle, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { checkLoginLockout, recordFailedLogin, clearFailedLogin, verifyAdminCredentials } from '../../../lib/auth';
import { saveAdminSession, addAuditLogEntry } from '../../../lib/db';

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (username.trim()) {
      const lockStatus = checkLoginLockout(username.trim());
      if (lockStatus.isLocked && lockStatus.remainingSeconds) {
        setLockoutSecs(lockStatus.remainingSeconds);
      } else {
        setLockoutSecs(null);
      }
    }
  }, [username]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSecs && lockoutSecs > 0) return;

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const userObj = verifyAdminCredentials(username.trim(), password);

      if (!userObj) {
        recordFailedLogin(username.trim());
        const lockStatus = checkLoginLockout(username.trim());
        if (lockStatus.isLocked) {
          setLockoutSecs(lockStatus.remainingSeconds || 900);
          setErrorMsg('Too many failed login attempts. Account temporarily locked for 15 minutes.');
        } else {
          setErrorMsg('Invalid admin credentials. (Hint: Try username "admin" & password "admin123")');
        }

        addAuditLogEntry({
          adminUsername: username || 'unknown',
          role: 'moderator',
          action: 'ADMIN_LOGIN_FAILED',
          targetResource: 'Admin Portal',
          ipAddress: '192.168.1.55',
          status: 'denied',
          details: 'Failed password verification',
        });

      } else {
        clearFailedLogin(username.trim());
        const sessionPayload = {
          username: userObj.username,
          name: userObj.name,
          role: userObj.role,
          token: `jwt_header.${btoa(JSON.stringify(userObj))}.signature_sha256`,
        };
        saveAdminSession(sessionPayload);

        addAuditLogEntry({
          adminUsername: userObj.username,
          role: userObj.role,
          action: 'ADMIN_LOGIN',
          targetResource: 'Admin Portal',
          ipAddress: '192.168.1.55',
          status: 'success',
          details: `Authenticated as ${userObj.role.toUpperCase()}`,
        });

        router.push('/admin');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-brand items-center justify-center red-glow mb-1">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">StreamVault Admin Access</h1>
          <p className="text-xs text-zinc-400">Protected management portal for Super Admins & Moderators.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {lockoutSecs !== null && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Account locked for {lockoutSecs}s due to security rate limit.</span>
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Username</label>
            <div className="relative flex items-center">
              <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="text"
                required
                placeholder="admin, content_mgr, mod_alex"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Master Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-zinc-200 block">Default Credentials:</span>
            <p>• Super Admin: <code className="text-brand font-mono">admin</code> / <code className="text-brand font-mono">admin123</code></p>
            <p>• Content Admin: <code className="text-amber-400 font-mono">content_mgr</code> / <code className="text-amber-400 font-mono">admin123</code></p>
          </div>

          <button
            type="submit"
            disabled={isLoading || (lockoutSecs !== null && lockoutSecs > 0)}
            className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xl red-glow flex items-center justify-center gap-2"
          >
            {isLoading ? 'Verifying Session...' : 'Authenticate Admin Session'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white underline">
            ← Return to StreamVault Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

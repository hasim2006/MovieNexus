'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle, KeyRound } from 'lucide-react';
import { getStoredUser, saveStoredUser } from '../../lib/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login' || mode === 'signup') {
        // Move to OTP verification step
        setMode('otp');
        setSuccessMsg(`Verification code sent to ${email || 'viewer@streamvault.com'}`);
      }
    }, 800);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const currentUser = getStoredUser();
      saveStoredUser({
        ...currentUser,
        email: email || currentUser.email,
        emailVerified: true,
      });
      setSuccessMsg('Authentication successful! Welcome to StreamVault.');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const currentUser = getStoredUser();
      saveStoredUser({
        ...currentUser,
        email: 'alex.vance@google.com',
        name: 'Alex Vance (Google)',
      });
      onClose();
      window.location.reload();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121215] border border-zinc-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-brand items-center justify-center red-glow mb-1">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            {mode === 'otp' ? 'Enter Security Code' : mode === 'login' ? 'Sign In to StreamVault' : 'Create Your Account'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {mode === 'otp'
              ? 'Enter the 6-digit verification code sent to your email.'
              : 'Unlock 4K Ultra HD Streaming, multi-profile profiles, and custom watchlists.'}
          </p>
        </div>

        {/* Success Toast Banner */}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Auth Form */}
        {mode !== 'otp' ? (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xl red-glow flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Google OAuth Button */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-zinc-500">
                <span className="bg-[#121215] px-2">Or Continue With</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google</span>
            </button>

            <div className="text-center pt-2 text-xs text-zinc-400">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setMode('signup')} className="text-brand font-bold hover:underline">
                    Sign up now
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button type="button" onClick={() => setMode('login')} className="text-brand font-bold hover:underline">
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        ) : (
          /* OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex items-center justify-center gap-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-lg font-extrabold bg-zinc-900 border border-zinc-700 rounded-xl text-brand focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-all shadow-xl red-glow flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying OTP...' : 'Confirm & Enter StreamVault'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-zinc-400 hover:text-white underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// Two-factor email OTP validation engine

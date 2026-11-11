'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { AlertCircle, BookOpen, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/utils/auth-context.tsx';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error || 'Invalid login credentials.');
      return;
    }

    router.push('/me');
    router.refresh();
  };

  const fillDemoAccount = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
    setSubmitting(true);
    const res = await login(demoEmail, demoPassword);
    setSubmitting(false);
    if (res.ok) {
      router.push('/me');
      router.refresh();
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl items-center justify-center px-6 py-12">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 lg:col-span-7"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/60 text-purple-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
                Sign In to The Brainstorming
              </h1>
              <p className="text-xs text-slate-400">
                Persistent cookie session · Stay logged in across refreshes
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-xs text-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kishore.yadav@mpdeled.edu.in"
                className="mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-4 pr-11 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(147,51,234,0.4)] transition-colors hover:bg-purple-500 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{submitting ? 'Signing In...' : 'Sign In to My Account'}</span>
            </button>
          </form>
        </motion.div>

        {/* Right: Quick 1-Click Test Accounts from src/data/users.json */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 lg:col-span-5">
          <div>
            <p className="text-xs font-medium text-purple-400">
              Pre-Configured Demo Accounts
            </p>
            <h2 className="mt-1 font-display text-lg font-bold text-white">
              1-Click Role &amp; Folder Testing
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Click any account below to immediately sign in and test role-based navigation, unlocked folders, and the Owner Users Dashboard.
            </p>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() =>
                  fillDemoAccount('gg.gyaniguru@gmail.com', 'owner@brainstorm2026')
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left transition-colors hover:border-purple-500/50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300">
                    Gyani Guru (Owner)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    role: &quot;owner&quot;
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-300">
                  gg.gyaniguru@gmail.com
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Reveals hidden &quot;Users&quot; tab in Navbar + unlocks 1st &amp; 2nd Year notes.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount('kishore.yadav@mpdeled.edu.in', 'kishore@123')
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left transition-colors hover:border-purple-500/50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">
                    Kishore Yadav (Student)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    role: &quot;user&quot;
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-300">
                  kishore.yadav@mpdeled.edu.in
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Purchased: [&quot;mp-deled-1st-year&quot;] (1st Year unlocked, 2nd Year locked).
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  fillDemoAccount('ananya.sharma@mpdeled.edu.in', 'ananya@123')
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left transition-colors hover:border-purple-500/50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    Ananya Sharma (New Student)
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    role: &quot;user&quot;
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-slate-300">
                  ananya.sharma@mpdeled.edu.in
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Purchased: [] (Test locked folders &amp; UPI QR Purchase Modal).
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

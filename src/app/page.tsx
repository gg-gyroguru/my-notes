'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  FolderKanban,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { NotePackage } from '@/utils/types.ts';
import NoteCard from '@/components/NoteCard.tsx';
import { useAuth } from '@/utils/auth-context.tsx';

export default function HomePage() {
  const [notes, setNotes] = useState<NotePackage[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const { user, login } = useAuth();
  const [switchingRole, setSwitchingRole] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.notes) {
          setNotes(data.notes);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingNotes(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleQuickDemoLogin = async (email: string, password: string, label: string) => {
    setSwitchingRole(label);
    await login(email, password);
    setSwitchingRole(null);
  };

  return (
    <main className="relative overflow-hidden">
      {/* Subtle Ambient Purple Backdrop Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[480px] w-[960px] -translate-x-1/2 rounded-full bg-purple-600/12 blur-[140px]" />

      {/* 1. Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
          {/* Left Column: Typography & Primary Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between lg:col-span-7"
          >
            <div>
              <p className="text-xs font-medium tracking-wide text-purple-400">
                MPBSE D.El.Ed Official Curriculum · Session 2025–2026
              </p>

              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:leading-[1.12]">
                The Brainstorming — MP D.El.Ed Smart Notes Hub
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
                Master your First Year &amp; Second Year MP D.El.Ed board examinations with structured unit-wise bilingual notes, pedagogical diagrams, and 5-year solved Previous Year Question Papers (PYQs) organized in instant digital folders.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(147,51,234,0.45)] transition-colors hover:bg-purple-500 whitespace-nowrap"
                >
                  <span>Explore Complete Notes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={user ? '/me' : '/login'}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:border-purple-500/40 hover:text-white whitespace-nowrap"
                >
                  <span>{user ? 'Open My Profile & Folders' : 'Student Portal Login'}</span>
                </Link>
              </div>
            </div>

            {/* Interactive Demo Account Switcher for Instant Role Testing */}
            <div className="mt-10 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  Instant Role Switcher (Persistent Cookie Auth)
                </span>
                <span className="text-xs text-slate-400">
                  Active: {user ? `${user.name} (${user.role.toUpperCase()})` : 'Guest Visitor'}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'gg.gyaniguru@gmail.com',
                      'owner@brainstorm2026',
                      'owner'
                    )
                  }
                  className={`flex flex-col items-start rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                    user?.role === 'owner'
                      ? 'border-purple-500 bg-purple-950/50 text-white'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold text-purple-300">
                    {switchingRole === 'owner' ? 'Switching...' : '1. Owner Account'}
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-400">
                    Unlocks All Notes + /users Tab
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'kishore.yadav@mpdeled.edu.in',
                      'kishore@123',
                      'kishore'
                    )
                  }
                  className={`flex flex-col items-start rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                    user?.email === 'kishore.yadav@mpdeled.edu.in'
                      ? 'border-purple-500 bg-purple-950/50 text-white'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold text-emerald-300">
                    {switchingRole === 'kishore' ? 'Switching...' : '2. Kishore Yadav'}
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-400">
                    1st Year Unlocked · 2nd Year Locked
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemoLogin(
                      'ananya.sharma@mpdeled.edu.in',
                      'ananya@123',
                      'ananya'
                    )
                  }
                  className={`flex flex-col items-start rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                    user?.email === 'ananya.sharma@mpdeled.edu.in'
                      ? 'border-purple-500 bg-purple-950/50 text-white'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-semibold text-amber-300">
                    {switchingRole === 'ananya' ? 'Switching...' : '3. Ananya Sharma'}
                  </span>
                  <span className="mt-0.5 text-[11px] text-slate-400">
                    No Purchases (Test UPI Modal)
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 lg:col-span-5"
          >
            <div className="relative h-72 w-full flex-1 overflow-hidden lg:h-full">
              {!heroImgFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/hero-study-hub.jpg"
                  alt="MP D.El.Ed Academic Study Hub"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/60 to-slate-950 p-8 text-center">
                  <BookOpen className="h-12 w-12 text-purple-400" />
                  <p className="mt-3 font-display text-lg font-bold text-white">
                    MP D.El.Ed Smart Digital Repository
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <p className="text-xs font-medium text-purple-300">
                  Curated by Top MP D.El.Ed Educators
                </p>
                <p className="font-display text-lg font-bold text-white">
                  Structured Folder Hierarchy for Paper Codes 801–810 &amp; 901–908
                </p>
                <p className="text-xs text-slate-300">
                  Every subject includes unit-wise theory, thinker comparison matrices, and 2020–2025 solved board papers.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Key Academic Metrics Bar Below Hero Split */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-800/90 bg-slate-900/50 p-6 sm:grid-cols-4">
          <div>
            <p className="font-mono text-2xl font-bold text-white tabular-nums">
              100%
            </p>
            <p className="mt-1 text-xs text-slate-400">
              MPBSE Syllabus Coverage (1st &amp; 2nd Year)
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-purple-400 tabular-nums">
              45+ Units
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Bilingual Hindi &amp; English Detailed Notes
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-white tabular-nums">
              2020–2025
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Solved Previous Year Question Papers
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
              55% OFF
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Automatic Student Scholarship Pricing
            </p>
          </div>
        </div>
      </section>

      {/* 2. Featured Notes Packages Section */}
      <section className="border-t border-slate-900 bg-slate-950/60 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium text-purple-400">
                Complete Year-Wise Packages
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                MP D.El.Ed Smart Notes Packages
              </h2>
            </div>
            <Link
              href="/notes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              <span>View Full Notes Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loadingNotes ? (
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Platform Architecture & Feature Highlights */}
      <section className="border-t border-slate-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-purple-400">
              Built for High-Scoring Board Answers
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              Why MP D.El.Ed Trainees Choose The Brainstorming
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/50 text-purple-400">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                01. Unit-Wise Folder Hierarchy
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Every subject (from Paper 801 Balyavastha evam Bal Vikas to Paper 901 Sangyan evam Adhigam) is neatly organized into unit folders for zero-clutter exam revision.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/50 text-purple-400">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                02. Solved PYQs (2020–2025)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Includes solved Previous Year Question Papers formatted according to the official MPBSE word-limit and point-wise marking scheme.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/50 text-purple-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-white">
                03. Instant Protected PDF Reader
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Read your purchased notes anytime across mobile, tablet, or desktop with persistent login and distraction-free watermarked viewing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  FolderOpen,
  Mail,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/utils/auth-context.tsx';
import { getAvatarColor, getInitials } from '@/utils/avatar.ts';
import { NotePackage } from '@/utils/types.ts';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [allNotes, setAllNotes] = useState<NotePackage[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    let active = true;
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.notes) {
          setAllNotes(data.notes);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (isLoading || !user) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-8" />
      </main>
    );
  }

  const initials = getInitials(user.name);
  const avatarColorClass = getAvatarColor(user.name);

  const unlockedNotes = allNotes.filter(
    (note) =>
      user.role === 'owner' ||
      (Array.isArray(user.purchasedNotes) &&
        user.purchasedNotes.includes(note.id))
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
      <div className="border-b border-slate-800/80 pb-6">
        <p className="text-xs font-medium text-purple-400">
          Student &amp; Educator Account Portal
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-white">
          My Profile &amp; Purchased Notes
        </h1>
      </div>

      {/* 1. User Details Card with Deterministic Letter Avatar & Eye Password Toggle */}
      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/85 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {/* Letter Profile Avatar */}
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border text-2xl font-bold tracking-tight shadow-lg ${avatarColorClass}`}
            aria-label={`Avatar for ${user.name}`}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Account Role:</span>
              <span className="font-mono font-semibold text-purple-300 uppercase">
                {user.role}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">ID: {user.id}</span>
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {user.name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">{user.email}</p>
          </div>

          {user.role === 'owner' && (
            <Link
              href="/users"
              className="inline-flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-600/20 px-4 py-2.5 text-xs font-semibold text-purple-200 hover:bg-purple-600/35 hover:text-white whitespace-nowrap"
            >
              <Shield className="h-4 w-4 text-purple-400" />
              <span>Open Owner Users Dashboard</span>
            </Link>
          )}
        </div>

        {/* Account Credentials Breakdown */}
        <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-800 pt-6 sm:grid-cols-3">
          {/* Full Name Field */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <UserIcon className="h-3.5 w-3.5 text-purple-400" />
              <span>Full Name</span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-white">
              {user.name}
            </p>
          </div>

          {/* Email Address Field */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="h-3.5 w-3.5 text-purple-400" />
              <span>Registered Email</span>
            </div>
            <p className="mt-1.5 truncate text-sm font-semibold text-white">
              {user.email}
            </p>
          </div>

          {/* Password Field with Eye Icon Toggle */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Account Password</span>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-1.5 font-mono text-sm font-semibold text-white">
              {showPassword ? user.password : '••••••••'}
            </p>
          </div>
        </div>
      </section>

      {/* 2. My Purchased Notes Section */}
      <section className="mt-12">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium text-purple-400">
              {user.role === 'owner'
                ? 'Owner Master Repository Access'
                : 'Unlocked Digital Study Packages'}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              My Purchased Notes ({unlockedNotes.length})
            </h2>
          </div>
          <Link
            href="/notes"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300"
          >
            Browse All Packages →
          </Link>
        </div>

        {unlockedNotes.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-purple-400" />
            <h3 className="mt-3 font-display text-lg font-bold text-white">
              No Purchased Notes Yet
            </h3>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-400">
              You have not unlocked any MP D.El.Ed note bundles yet. Explore the 1st Year and 2nd Year complete packages to get instant access.
            </p>
            <Link
              href="/notes"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-semibold text-white hover:bg-purple-500"
            >
              <span>Explore MP D.El.Ed Notes</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {unlockedNotes.map((note) => (
              <div
                key={note.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-colors hover:border-purple-500/40"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-purple-400">{note.code}</span>
                    <span className="text-emerald-400 font-semibold">
                      UNLOCKED
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold text-white">
                    {note.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {note.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {note.subjectsCount} Subjects · {note.totalUnitsCount} Units
                  </span>

                  <Link
                    href={`/notes/${note.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-colors hover:bg-purple-500 whitespace-nowrap"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>Open Notes Folder</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

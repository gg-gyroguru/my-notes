'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';
import { NotePackage, SubjectFolder, SubjectUnit } from '@/utils/types.ts';
import { useAuth } from '@/utils/auth-context.tsx';
import ProtectedPdfViewer from '@/components/ProtectedPdfViewer.tsx';

export default function ProtectedSubjectPage({
  params,
}: {
  params: Promise<{ noteId: string; subjectId: string }>;
}) {
  const { noteId, subjectId } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading, hasAccess } = useAuth();

  const [note, setNote] = useState<NotePackage | null>(null);
  const [subject, setSubject] = useState<SubjectFolder | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<SubjectUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    // Client-side guard in addition to Middleware
    if (!hasAccess(noteId)) {
      router.replace(`/notes/${noteId}`);
      return;
    }

    let active = true;
    fetch(`/api/subjects/${noteId}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (!data.unlocked && user?.role !== 'owner') {
          router.replace(`/notes/${noteId}`);
          return;
        }
        setNote(data.note);
        const foundSubject = (data.subjects || []).find(
          (s: SubjectFolder) => s.id === subjectId
        );
        if (foundSubject) {
          setSubject(foundSubject);
          if (foundSubject.units?.length > 0) {
            setSelectedUnit(foundSubject.units[0]);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [noteId, subjectId, authLoading, hasAccess, router, user]);

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-8" />
      </main>
    );
  }

  if (!subject || !note) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-white">
          Subject Folder Not Found
        </h1>
        <Link
          href={`/notes/${noteId}`}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Note Folder</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Top Breadcrumb & Back Link */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/notes" className="hover:text-white transition-colors">
            Notes
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/notes/${note.id}`}
            className="hover:text-white transition-colors"
          >
            {note.shortTitle}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-purple-300 font-medium">{subject.title}</span>
        </div>

        <Link
          href={`/notes/${note.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:border-purple-500/40 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All {note.shortTitle} Subjects</span>
        </Link>
      </div>

      {/* Subject Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-mono">
              <FolderOpen className="h-4 w-4" />
              <span>{subject.code}</span>
              <span aria-hidden="true">·</span>
              <span>{subject.units.length} Units &amp; Solved PYQs</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              {subject.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{subject.englishTitle}</p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-2 text-xs text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Protected Folder Unlocked ({user?.name})</span>
          </div>
        </div>
      </div>

      {/* Subject Units Sidebar + Protected PDF Viewer */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Units Selector Sidebar */}
        <aside className="space-y-2.5 lg:col-span-4">
          <h2 className="px-1 text-xs font-semibold text-slate-400">
            Select Chapter / Unit PDF
          </h2>
          {subject.units.map((u) => {
            const active = selectedUnit?.id === u.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedUnit(u)}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-purple-500 bg-purple-950/40 text-white'
                    : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] text-purple-300">
                      {u.unitNumber} · {u.type}
                    </span>
                    <p className="mt-0.5 font-display text-sm font-bold text-white">
                      {u.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {u.hindiTitle}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-400 tabular-nums shrink-0">
                  {u.pages}p
                </span>
              </button>
            );
          })}
        </aside>

        {/* Protected PDF Reader Canvas */}
        <div className="lg:col-span-8">
          {selectedUnit ? (
            <ProtectedPdfViewer
              subject={subject}
              unit={selectedUnit}
              user={user}
            />
          ) : (
            <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
              <BookOpen className="h-8 w-8 text-purple-400" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Lock,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { NotePackage, SubjectFolder, SubjectUnit } from '@/utils/types.ts';
import { useAuth } from '@/utils/auth-context.tsx';
import PurchaseModal from '@/components/PurchaseModal.tsx';
import ProtectedPdfViewer from '@/components/ProtectedPdfViewer.tsx';

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = use(params);
  const { user, hasAccess } = useAuth();

  const [note, setNote] = useState<NotePackage | null>(null);
  const [subjects, setSubjects] = useState<SubjectFolder[]>([]);
  const [serverUnlocked, setServerUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  // Interactive Folder State when unlocked
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeUnit, setActiveUnit] = useState<{
    subject: SubjectFolder;
    unit: SubjectUnit;
  } | null>(null);

  const isUnlocked = serverUnlocked || hasAccess(noteId);

  useEffect(() => {
    let active = true;
    fetch(`/api/subjects/${noteId}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setNote(data.note);
        setSubjects(data.subjects || []);
        setServerUnlocked(Boolean(data.unlocked));
        if (data.subjects?.length > 0) {
          const firstSubject = data.subjects[0];
          setActiveSubjectId(firstSubject.id);
          if (firstSubject.units?.length > 0) {
            setActiveUnit({
              subject: firstSubject,
              unit: firstSubject.units[0],
            });
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
  }, [noteId, user]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-8" />
      </main>
    );
  }

  if (!note) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-white">
          Notes Package Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          The requested MP D.El.Ed notes bundle could not be located.
        </p>
        <Link
          href="/notes"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes Catalog</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
        <Link href="/notes" className="hover:text-white transition-colors">
          Notes Catalog
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-200 font-medium">{note.title}</span>
      </div>

      {/* Contiguous Top Detail & Purchase Module */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/85 p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left: Details & Features */}
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300 font-mono tabular-nums">
              <span>{note.code}</span>
              <span aria-hidden="true">·</span>
              <span>{note.subjectsCount} Subjects</span>
              <span aria-hidden="true">·</span>
              <span>{note.pyqYearsCovered}</span>
            </div>

            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-4xl">
              {note.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {note.description}
            </p>

            {/* Key Package Features */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {note.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-xs text-slate-200"
                >
                  <Check className="h-4 w-4 shrink-0 text-purple-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contiguous Pricing / Access Status Module */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950 p-6 lg:col-span-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {isUnlocked ? 'Access Status' : 'Special Student Price'}
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                {isUnlocked
                  ? user?.role === 'owner'
                    ? 'OWNER ACCESS'
                    : 'PURCHASED'
                  : `${note.discountPercentage}% OFF`}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-3 font-mono tabular-nums">
              <span className="text-3xl font-bold text-white">
                ₹{note.discountedPrice}
              </span>
              <span className="text-sm text-slate-500 line-through">
                ₹{note.originalPrice}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {isUnlocked
                ? 'All subject folders, unit PDFs, and solved PYQs are unlocked for your account.'
                : 'One-time UPI payment unlocks all subject folders, unit notes, and solved PYQs.'}
            </p>

            <div className="mt-6">
              {isUnlocked ? (
                <a
                  href="#subject-folders"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-600/20 px-5 py-3 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-600/30 whitespace-nowrap"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Browse Unlocked Subject Folders</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setPurchaseModalOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(147,51,234,0.45)] transition-colors hover:bg-purple-500 whitespace-nowrap cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Purchase Now — ₹{note.discountedPrice}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Conditional Section: Unlocked Interactive Folder Explorer OR Locked Syllabus Preview */}
      <section id="subject-folders" className="mt-12">
        {isUnlocked ? (
          <div>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-medium text-emerald-400">
                  Unlocked Smart Repository · {subjects.length} Subject Folders Available
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">
                  Interactive Subject Folders &amp; Protected PDF Reader
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Select any unit below to read in-place, or open a dedicated subject route.
              </p>
            </div>

            {/* 2-Column Interactive Folder + Protected PDF Reader Workspace */}
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Subject Folders Tree */}
              <div className="space-y-3 lg:col-span-4">
                {subjects.map((subj, idx) => {
                  const isOpen = activeSubjectId === subj.id;
                  return (
                    <div
                      key={subj.id}
                      className={`overflow-hidden rounded-2xl border transition-colors ${
                        isOpen
                          ? 'border-purple-500/50 bg-slate-900'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      {/* Folder Header */}
                      <div className="flex items-center justify-between gap-2 p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveSubjectId(isOpen ? null : subj.id)
                          }
                          className="flex flex-1 items-start gap-3 text-left cursor-pointer"
                        >
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/50 text-purple-400">
                            {isOpen ? (
                              <FolderOpen className="h-4 w-4" />
                            ) : (
                              <Folder className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-[11px] text-purple-400">
                              Subject {idx + 1} · {subj.code}
                            </span>
                            <h3 className="font-display text-sm font-bold text-white">
                              {subj.title}
                            </h3>
                            <p className="text-xs text-slate-400 truncate">
                              {subj.englishTitle}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/notes/${note.id}/${subj.id}`}
                            title="Open dedicated Subject Route"
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 px-2.5 text-[11px] font-medium text-slate-300 hover:border-purple-500/40 hover:text-white whitespace-nowrap"
                          >
                            <span>Open</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveSubjectId(isOpen ? null : subj.id)
                            }
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            aria-label="Toggle folder units"
                          >
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Units inside Subject Folder */}
                      {isOpen && (
                        <div className="border-t border-slate-800/80 bg-slate-950/60 p-3 space-y-1.5">
                          {subj.units.map((unit) => {
                            const isSelected = activeUnit?.unit.id === unit.id;
                            return (
                              <button
                                key={unit.id}
                                type="button"
                                onClick={() =>
                                  setActiveUnit({ subject: subj, unit })
                                }
                                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-purple-600/25 text-white border border-purple-500/40'
                                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <FileText className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                                  <div className="min-w-0">
                                    <p className="font-semibold truncate">
                                      {unit.unitNumber}: {unit.title}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                      {unit.hindiTitle}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                                  {unit.pages}p
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Custom Protected PDF Viewer */}
              <div className="lg:col-span-8">
                {activeUnit ? (
                  <ProtectedPdfViewer
                    subject={activeUnit.subject}
                    unit={activeUnit.unit}
                    user={user}
                  />
                ) : (
                  <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                    <BookOpen className="h-10 w-10 text-purple-400" />
                    <p className="mt-3 font-display text-base font-semibold text-white">
                      Select a Subject Folder &amp; Unit to Start Reading
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Locked Preview for Unpurchased Users */
          <div>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-medium text-amber-400">
                  Locked Folder Preview · Purchase Required to Stream PDFs
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">
                  Subject-Wise Syllabus &amp; PYQ Folder Structure
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPurchaseModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 whitespace-nowrap cursor-pointer"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Unlock All {subjects.length} Subject Folders</span>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {subjects.map((subj, idx) => (
                <motion.div
                  key={subj.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setPurchaseModalOpen(true)}
                  className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/75 p-6 transition-colors hover:border-purple-500/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-purple-400">
                        Subject {idx + 1} · {subj.code}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-bold text-white group-hover:text-purple-300">
                        {subj.title}
                      </h3>
                      <p className="text-xs text-slate-400">{subj.englishTitle}</p>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 group-hover:border-purple-500/40 group-hover:text-purple-300">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-300">
                    {subj.description}
                  </p>

                  {/* Locked Units List */}
                  <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-4">
                    {subj.units.map((unit) => (
                      <div
                        key={unit.id}
                        className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2 text-xs text-slate-400"
                      >
                        <span className="truncate pr-3">
                          {unit.unitNumber}: {unit.title}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 shrink-0 tabular-nums">
                          <Lock className="h-3 w-3" />
                          {unit.pages}p PDF
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Callout Banner */}
            <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-purple-400" />
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Ready to Unlock {note.title}?
                  </h3>
                  <p className="mt-1 text-xs text-slate-300">
                    Pay ₹{note.discountedPrice} via UPI QR and share your payment slip on WhatsApp or Telegram for instant account activation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPurchaseModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-xs font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:bg-purple-500 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Purchase Now (₹{note.discountedPrice})</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Animated Purchase Modal */}
      <PurchaseModal
        isOpen={purchaseModalOpen}
        onClose={() => setPurchaseModalOpen(false)}
        note={note}
        user={user}
      />
    </main>
  );
}

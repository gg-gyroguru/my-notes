'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Check, FolderOpen, Lock } from 'lucide-react';
import { NotePackage } from '@/utils/types.ts';
import { useAuth } from '@/utils/auth-context.tsx';

interface NoteCardProps {
  note: NotePackage;
}

export default function NoteCard({ note }: NoteCardProps) {
  const { hasAccess } = useAuth();
  const unlocked = hasAccess(note.id);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 transition-colors hover:border-purple-500/50"
    >
      {/* Image Header (4:3 ratio) */}
      <Link
        href={`/notes/${note.id}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950"
      >
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={note.thumbnail}
            alt={note.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950/50 to-slate-950 p-6 text-center">
            <BookOpen className="h-10 w-10 text-purple-400" />
            <span className="mt-2 font-display text-sm font-semibold text-white">
              {note.shortTitle}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-xs text-slate-300">
          <span className="font-medium text-purple-300">{note.code}</span>
          <span className="font-mono font-semibold text-emerald-400 tabular-nums">
            {note.discountPercentage}% OFF
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
            <span>{note.subjectsCount} Subjects</span>
            <span aria-hidden="true">·</span>
            <span>{note.totalUnitsCount} Units</span>
            <span aria-hidden="true">·</span>
            <span>{note.pyqYearsCovered}</span>
          </div>

          <Link href={`/notes/${note.id}`} className="mt-2 block">
            <h3 className="font-display text-xl font-bold text-white transition-colors group-hover:text-purple-300">
              {note.title}
            </h3>
          </Link>

          <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
            {note.description}
          </p>

          {/* Features */}
          <ul className="mt-5 space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
            {note.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <Check className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & Action Footer */}
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-800 pt-5">
          <div>
            <span className="block text-[11px] text-slate-400">
              Complete Year Bundle
            </span>
            <div className="mt-0.5 flex items-baseline gap-2.5 font-mono tabular-nums">
              <span className="text-2xl font-bold text-white">
                ₹{note.discountedPrice}
              </span>
              <span className="text-sm text-slate-500 line-through">
                ₹{note.originalPrice}
              </span>
            </div>
          </div>

          <Link
            href={`/notes/${note.id}`}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              unlocked
                ? 'border border-emerald-500/40 bg-emerald-600/20 text-emerald-200 hover:bg-emerald-600/30'
                : 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] hover:bg-purple-500'
            }`}
          >
            {unlocked ? (
              <>
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Open Folder</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>Explore &amp; Unlock</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

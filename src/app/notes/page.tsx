'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { NotePackage } from '@/utils/types.ts';
import NoteCard from '@/components/NoteCard.tsx';

export default function NotesCatalogPage() {
  const [notes, setNotes] = useState<NotePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYearFilter, setSelectedYearFilter] = useState<'all' | '1st' | '2nd'>('all');

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
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredNotes = notes.filter((n) => {
    if (selectedYearFilter === '1st') return n.id === 'mp-deled-1st-year';
    if (selectedYearFilter === '2nd') return n.id === 'mp-deled-2nd-year';
    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      {/* Header & Interactive Year Filter */}
      <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-800/80 pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium text-purple-400">
            MPBSE D.El.Ed Complete Curriculum Bundles
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
            MP D.El.Ed 1st &amp; 2nd Year Smart Notes
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Select your academic year package below to inspect the subject-wise syllabus, preview units, or open your unlocked study folders.
          </p>
        </div>

        {/* Interactive Segmented Control */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => setSelectedYearFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedYearFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Years (2)
          </button>
          <button
            type="button"
            onClick={() => setSelectedYearFilter('1st')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedYearFilter === '1st'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1st Year (801–805)
          </button>
          <button
            type="button"
            onClick={() => setSelectedYearFilter('2nd')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedYearFilter === '2nd'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2nd Year (901–904)
          </button>
        </div>
      </div>

      {/* Notes Cards Grid */}
      {loading ? (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {[0, 1].map((idx) => (
            <div
              key={idx}
              className="h-96 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </motion.div>
      )}

      {/* What's Inside Comparison Strip */}
      <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <h2 className="font-display text-lg font-bold text-white">
          Included in Every MP D.El.Ed Complete Year Package
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Every Unit Detailed Notes
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Clear Hindi &amp; English definitions, educational thinkers, psychological stages, and classroom applications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Solved Previous Year Question Papers (PYQs)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                2020–2025 MPBSE board examination papers solved step-by-step with examiner blueprint headings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">
                Exam-Oriented Short Notes
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Last-minute 1-page revision tables, constitutional articles list, and NCF/RTE memory triggers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

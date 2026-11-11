'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Lock,
  Maximize2,
  Minimize2,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { SubjectFolder, SubjectUnit, UserRecord } from '@/utils/types.ts';

interface ProtectedPdfViewerProps {
  subject: SubjectFolder;
  unit: SubjectUnit;
  user: UserRecord | null;
}

export default function ProtectedPdfViewer({
  subject,
  unit,
  user,
}: ProtectedPdfViewerProps) {
  const [viewMode, setViewMode] = useState<'interactive' | 'stream'>('interactive');
  const [zoom, setZoom] = useState<number>(100);
  const [expandedFullscreen, setExpandedFullscreen] = useState(false);
  const [contextWarning, setContextWarning] = useState(false);

  const watermarkText = `${user?.email || 'protected@mpdeled.edu.in'} · ${
    user?.name || 'Authorized Student'
  }`;

  const pdfStreamUrl = unit.pdfFile
    ? `/api/pdf/${unit.pdfFile}#toolbar=0&navpanes=0&scrollbar=1`
    : null;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextWarning(true);
    setTimeout(() => setContextWarning(false), 2200);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 select-none ${
        expandedFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl'
          : 'min-h-[640px]'
      }`}
    >
      {/* Top Protected Reader Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-5 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-purple-400">{subject.code}</span>
            <span aria-hidden="true">·</span>
            <span>{unit.unitNumber}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{unit.pages} Pages</span>
          </div>
          <h3 className="truncate font-display text-sm font-bold text-white sm:text-base">
            {unit.title}
          </h3>
        </div>

        {/* Reader Mode & Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('interactive')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Smart Notes Reader</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('stream')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === 'stream'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Raw PDF Stream</span>
            </button>
          </div>

          {viewMode === 'interactive' && (
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(85, z - 10))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="px-1.5 font-mono text-xs tabular-nums text-slate-300">
                {zoom}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(125, z + 10))}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setExpandedFullscreen((prev) => !prev)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white cursor-pointer"
            aria-label={expandedFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {expandedFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Right-click / Copy Protection Toast */}
      {contextWarning && (
        <div className="absolute top-16 right-5 z-30 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-slate-950/95 px-3.5 py-2 text-xs text-amber-300 shadow-lg">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>Right-click &amp; downloading are disabled on protected study notes.</span>
        </div>
      )}

      {/* Main Protected Document Canvas */}
      <div className="relative flex-1 overflow-y-auto bg-slate-950/60 p-5 sm:p-8">
        {/* Diagonal Repeating Watermark Overlay (Non-interactive pointer-events-none) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-[0.07]"
        >
          <div className="grid h-full w-full grid-cols-2 gap-16 p-8 sm:grid-cols-3">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center -rotate-24 font-mono text-xs font-semibold tracking-wider text-purple-200 whitespace-nowrap"
              >
                {watermarkText}
              </div>
            ))}
          </div>
        </div>

        {viewMode === 'interactive' ? (
          <div
            style={{ fontSize: `${zoom}%` }}
            className="relative z-10 mx-auto max-w-3xl space-y-8 rounded-xl border border-slate-800/90 bg-slate-900/90 p-6 shadow-xl sm:p-10"
          >
            {/* Document Header */}
            <div className="border-b border-slate-800 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>The Brainstorming · MPBSE D.El.Ed Official Curriculum</span>
                <span className="font-mono text-purple-400">
                  Licensed to: {user?.email}
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                {unit.unitNumber}: {unit.title}
              </h2>
              <p className="mt-1 text-base font-medium text-purple-300">
                {unit.hindiTitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {unit.summary}
              </p>
            </div>

            {/* Core Syllabus Topics Breakdown */}
            {unit.keyTopics && unit.keyTopics.length > 0 && (
              <div>
                <h4 className="font-display text-sm font-semibold text-white">
                  01. Key Syllabus Topics Covered in This Unit
                </h4>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
                  {unit.keyTopics.map((topic, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-slate-800/70 bg-slate-950/60 px-4 py-2.5"
                    >
                      <span className="font-mono text-xs font-semibold text-purple-400 tabular-nums">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* High-Scoring Exam Questions & Model Answers */}
            {unit.examQuestions && unit.examQuestions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-display text-sm font-semibold text-white">
                  02. Exam-Oriented Solved Questions &amp; Model Answers
                </h4>
                {unit.examQuestions.map((qa, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-3"
                  >
                    <p className="text-sm font-semibold text-purple-200">
                      प्रश्न {idx + 1}: {qa.q}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-300">
                      <span className="font-semibold text-emerald-400">उत्तर: </span>
                      {qa.a}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Document Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-purple-400" />
                Protected Stream Path: /src/storage/pdfs/{unit.pdfFile}
              </span>
              <span>Watermarked for {user?.name}</span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex h-[560px] w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {pdfStreamUrl ? (
              <iframe
                src={pdfStreamUrl}
                title={unit.title}
                className="h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-sm text-slate-400">
                Protected PDF stream is locked for this account.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

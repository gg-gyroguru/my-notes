'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function ConnectFloatingBtn() {
  return (
    <a
      href="https://gg-gyaniguru.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-14 right-4 md:bottom-5 md:right-5 z-40 inline-flex items-center gap-2 rounded-xl border border-purple-400/40 bg-slate-950/90 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_25px_rgba(147,51,234,0.45)] backdrop-blur-md transition-all duration-150 hover:-translate-y-0.5 hover:border-purple-400 hover:bg-purple-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 whitespace-nowrap"
      aria-label="Connect With Us on Gyani Guru"
    >
      <span>Connect With Us</span>
      <ExternalLink className="h-3.5 w-3.5 text-purple-400" />
    </a>
  );
}

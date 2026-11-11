'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, MessageCircle, QrCode, Send, ShieldCheck, X } from 'lucide-react';
import { NotePackage, UserRecord } from '@/utils/types.ts';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NotePackage;
  user: UserRecord | null;
}

export default function PurchaseModal({
  isOpen,
  onClose,
  note,
  user,
}: PurchaseModalProps) {
  const [qrImgFailed, setQrImgFailed] = useState(false);

  const prefilledText = encodeURIComponent(
    `Hello The Brainstorming Team! I have completed the UPI payment of ₹${note.discountedPrice} for "${note.title}".\n\nName: ${
      user?.name || '[Your Full Name]'
    }\nEmail: ${
      user?.email || '[Your Registered Email]'
    }\nPackage ID: ${note.id}\n\nPlease find my payment slip attached and unlock my notes folder.`
  );

  const whatsappUrl = `https://wa.me/+918076358992?text=${prefilledText}`;
  const telegramUrl = `https://t.me/gg_gyaniguru`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="purchase-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950/70 text-slate-400 transition-colors hover:border-slate-700 hover:text-white cursor-pointer"
              aria-label="Close purchase modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pr-10">
              <p className="text-xs font-medium text-purple-400">
                Instant UPI Verification · Lifetime Folder Access
              </p>
              <h2
                id="purchase-modal-title"
                className="mt-1 font-display text-xl font-bold text-white sm:text-2xl"
              >
                Unlock {note.shortTitle} Notes
              </h2>
              <p className="mt-1 text-xs text-slate-400">{note.title}</p>
            </div>

            {/* Price & QR Code Showcase */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-12 sm:items-center">
              {/* UPI QR Container */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-4 sm:col-span-5">
                <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-lg bg-white p-2 shadow-inner">
                  {!qrImgFailed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/images/upi-qr.png"
                      alt="Scan UPI QR Code to Pay"
                      referrerPolicy="no-referrer"
                      onError={() => setQrImgFailed(true)}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center text-slate-900 p-2">
                      <QrCode className="h-16 w-16 text-purple-700" />
                      <span className="mt-1 text-[10px] font-semibold">
                        UPI QR Placeholder
                      </span>
                    </div>
                  )}
                </div>
                <span className="mt-2.5 text-[11px] font-medium text-slate-400">
                  Scan with any UPI App
                </span>
                <span className="text-[10px] text-slate-500">
                  (Replace at /public/images/upi-qr.png)
                </span>
              </div>

              {/* Payment Summary & Instructions */}
              <div className="flex flex-col justify-between sm:col-span-7">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Payable Amount</span>
                    <div className="flex items-baseline gap-2 font-mono tabular-nums">
                      <span className="text-xs text-slate-500 line-through">
                        ₹{note.originalPrice}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        ₹{note.discountedPrice}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-purple-400 font-mono tabular-nums">
                    Includes {note.discountPercentage}% Off · All {note.subjectsCount} Subjects &amp; Solved PYQs
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-xs leading-relaxed text-slate-300">
                  <p className="font-medium text-white">
                    After payment, send your Payment Slip, Name, and Email on WhatsApp or Telegram to unlock your notes.
                  </p>
                  {user ? (
                    <p className="text-[11px] text-slate-400">
                      Logged in as <span className="text-slate-200 font-medium">{user.name}</span> ({user.email}) — auto-filled in your WhatsApp message.
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Tip: Mention your registered email so the owner can immediately enable your folder access.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Action Buttons */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Slip on WhatsApp</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/40 bg-purple-600/20 px-4 py-3 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-600/35 hover:text-white whitespace-nowrap"
              >
                <Send className="h-4 w-4" />
                <span>Send Slip on Telegram</span>
              </a>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                Verified by The Brainstorming Admin
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Instant Activation
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

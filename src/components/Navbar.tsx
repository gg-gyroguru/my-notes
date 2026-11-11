'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/utils/auth-context.tsx';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: 'Home', visible: true },
    { href: '/notes', label: 'Notes', visible: true },
    { href: '/me', label: 'Me (Profile)', visible: Boolean(user) },
    { href: '/users', label: 'Users', visible: user?.role === 'owner' },
  ].filter((link) => link.visible);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          {/* Zone 1: Brand Title (Single text element wordmark) */}
          <Link
            href="/"
            className="font-display text-base font-bold tracking-tight text-white transition-colors hover:text-purple-300 sm:text-lg whitespace-nowrap shrink-0"
          >
            The Brainstorming
          </Link>

          {/* Zone 2: Primary Navigation Links (Desktop) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
          >
            {navLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-600/15 px-3 py-1.5 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-600/30 hover:text-white sm:px-4 sm:py-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout ({user.name.split(' ')[0]})</span>
                <span className="sm:hidden">Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-colors hover:bg-purple-500 sm:px-4 sm:py-2 whitespace-nowrap shrink-0"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white md:hidden cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with User Info & All Accessible Tabs */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800/80 bg-slate-950/98 px-5 py-4 md:hidden shadow-2xl">
            {user && (
              <div className="mb-3.5 border-b border-slate-800/80 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="font-mono text-[11px] text-slate-400">{user.email}</p>
                  </div>
                  <span className="font-mono text-[11px] font-semibold uppercase text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-md">
                    {user.role}
                  </span>
                </div>
              </div>
            )}
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/40'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.href === '/users' && (
                      <span className="font-mono text-[10px] uppercase text-purple-400 bg-purple-950 px-1.5 py-0.5 rounded border border-purple-500/30">
                        Owner Only
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Mobile Bottom Quick Navigation Bar so tabs are always instantly visible on mobile */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-800/90 bg-slate-950/95 px-2 py-2 backdrop-blur-xl md:hidden"
      >
        {navLinks.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-2 py-1 text-center transition-colors min-w-[56px] ${
                isActive
                  ? 'text-purple-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs tracking-tight">{item.label.split(' ')[0]}</span>
              {isActive && (
                <span className="mt-0.5 h-1 w-4 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

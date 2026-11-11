'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '@/utils/auth-context.tsx';
import { getAvatarColor, getInitials } from '@/utils/avatar.ts';
import { SafeUser } from '@/utils/types.ts';

export default function OwnerUsersDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [usersList, setUsersList] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'user'>('all');

  useEffect(() => {
    if (authLoading) return;

    // Strict client-side guard: wait until auth finishes loading
    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.role !== 'owner') {
      router.replace('/');
      return;
    }

    let active = true;
    fetch('/api/users', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403 || res.status === 401) {
            router.replace('/');
          }
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (active && data?.users) {
          setUsersList(data.users);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="mt-3 text-xs text-slate-400">Verifying owner credentials...</p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== 'owner') {
    return null;
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/50 p-8" />
      </main>
    );
  }

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.purchasedNotes.some((n) =>
        n.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeBuyerCount = usersList.filter(
    (u) => u.role === 'user' && u.purchasedNotes.length > 0
  ).length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-800/80 pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-purple-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Owner Administration Console · Protected Route</span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">
            Registered Users &amp; Note Access Directory
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Inspect student accounts, roles, and unlocked MP D.El.Ed note packages from <code className="font-mono text-purple-300">src/data/users.json</code>.
          </p>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total Registered Users
            </span>
            <UsersIcon className="h-4 w-4 text-purple-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-white tabular-nums">
            {usersList.length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Verified accounts in local JSON database
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-6">
          <span className="text-xs font-medium text-slate-400">
            Students With Unlocked Notes
          </span>
          <p className="mt-3 font-mono text-3xl font-bold text-emerald-400 tabular-nums">
            {activeBuyerCount}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Active MP D.El.Ed 1st &amp; 2nd Year learners
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-6">
          <span className="text-xs font-medium text-slate-400">
            Platform Owners
          </span>
          <p className="mt-3 font-mono text-3xl font-bold text-purple-400 tabular-nums">
            {usersList.filter((u) => u.role === 'owner').length}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Full administrative &amp; PDF streaming privileges
          </p>
        </div>
      </div>

      {/* Search & Role Filter Toolbar */}
      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, email, or note ID..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
          {(['all', 'owner', 'user'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors cursor-pointer ${
                roleFilter === r
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === 'all' ? `All (${usersList.length})` : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/85">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400">
                <th className="py-4 pl-6 pr-4">User</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Role</th>
                <th className="py-4 pl-4 pr-6">Purchased Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {filteredUsers.map((u) => {
                const initials = getInitials(u.name);
                const colorClass = getAvatarColor(u.name);
                return (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-slate-950/40"
                  >
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${colorClass}`}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="font-mono text-[11px] text-slate-500">
                            {u.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-xs text-slate-300">
                      {u.email}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`font-mono text-xs font-semibold uppercase ${
                          u.role === 'owner'
                            ? 'text-purple-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4 pl-4 pr-6">
                      {u.role === 'owner' ? (
                        <span className="text-xs font-medium text-purple-300">
                          All Notes Unlocked (Owner)
                        </span>
                      ) : u.purchasedNotes.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-mono">
                          {u.purchasedNotes.map((noteId, idx) => (
                            <React.Fragment key={noteId}>
                              {idx > 0 && (
                                <span
                                  aria-hidden="true"
                                  className="text-slate-600"
                                >
                                  ·
                                </span>
                              )}
                              <span>{noteId}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">
                          None purchased yet
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-xs text-slate-400"
                  >
                    No registered users match your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

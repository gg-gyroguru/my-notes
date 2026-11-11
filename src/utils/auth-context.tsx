'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserRecord } from './types.ts';

const COOKIE_NAME = 'tb_session_user';

interface AuthContextValue {
  user: UserRecord | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: UserRecord }>;
  logout: () => Promise<void>;
  hasAccess: (noteId: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readClientCookie(): UserRecord | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const value = decodeURIComponent(match.split('=').slice(1).join('='));
    return JSON.parse(value) as UserRecord;
  } catch {
    return null;
  }
}

function writeClientCookie(user: UserRecord | null) {
  if (typeof document === 'undefined') return;
  if (!user) {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    return;
  }
  const serialized = encodeURIComponent(JSON.stringify(user));
  // 30 days persistent cookie
  document.cookie = `${COOKIE_NAME}=${serialized}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const initial = readClientCookie();

    fetch('/api/auth', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.user) {
          setUser(data.user);
          writeClientCookie(data.user);
        } else if (initial) {
          setUser(initial);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (active && initial) {
          setUser(initial);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.user) {
        return { ok: false, error: data.error || 'Invalid email or password' };
      }
      setUser(data.user);
      writeClientCookie(data.user);
      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: 'Network error while signing in. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch {
      // Ignore network errors on logout
    }
    writeClientCookie(null);
    setUser(null);
  }, []);

  const hasAccess = useCallback(
    (noteId: string) => {
      if (!user) return false;
      if (user.role === 'owner') return true;
      return Array.isArray(user.purchasedNotes) && user.purchasedNotes.includes(noteId);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

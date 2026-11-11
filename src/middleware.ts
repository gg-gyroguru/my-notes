import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'tb_session_user';

interface CookieUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'user';
  purchasedNotes: string[];
}

function parseSessionCookie(req: NextRequest): CookieUser | null {
  const raw = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!raw) return null;

  const tryParse = (str: string): CookieUser | null => {
    try {
      const clean = str.trim().replace(/^"|"$/g, '');
      return JSON.parse(clean) as CookieUser;
    } catch {
      return null;
    }
  };

  try {
    const fromDecoded = tryParse(decodeURIComponent(raw));
    if (fromDecoded && fromDecoded.role) return fromDecoded;
  } catch {
    // Ignore decode error
  }

  const fromRaw = tryParse(raw);
  if (fromRaw && fromRaw.role) return fromRaw;

  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const user = parseSessionCookie(req);

  // 1. Protect /users route strictly for role === "owner"
  if (pathname === '/users' || pathname.startsWith('/users/')) {
    if (!user || user.role !== 'owner') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 2. Protect /notes/[noteId]/[subjectId] direct routes
  const subjectRouteMatch = pathname.match(/^\/notes\/([^/]+)\/([^/]+)\/?$/);
  if (subjectRouteMatch) {
    const noteId = subjectRouteMatch[1];
    const isOwner = user?.role === 'owner';
    const hasPurchased =
      Array.isArray(user?.purchasedNotes) &&
      user.purchasedNotes.includes(noteId);

    if (!isOwner && !hasPurchased) {
      return NextResponse.redirect(new URL(`/notes/${noteId}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/users/:path*', '/notes/:noteId/:subjectId*'],
};

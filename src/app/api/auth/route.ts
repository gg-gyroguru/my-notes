import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  findUserByEmail,
  getServerSessionUser,
} from '@/utils/auth-server.ts';

export async function GET() {
  const user = await getServerSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email || '').trim();
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    const foundUser = findUserByEmail(email);
    if (!foundUser || foundUser.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ user: foundUser }, { status: 200 });
    response.cookies.set(AUTH_COOKIE_NAME, JSON.stringify(foundUser), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      httpOnly: false, // readable by client cookie helper & server
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to process authentication request.' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  });
  return response;
}

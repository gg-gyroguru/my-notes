import { NextResponse } from 'next/server';
import { getAllUsers, getServerSessionUser } from '@/utils/auth-server.ts';

export async function GET() {
  const sessionUser = await getServerSessionUser();

  if (!sessionUser || sessionUser.role !== 'owner') {
    return NextResponse.json(
      { error: '403 Forbidden: Only the platform owner can access registered user records.' },
      { status: 403 }
    );
  }

  const users = getAllUsers().map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    purchasedNotes: u.purchasedNotes,
  }));

  return NextResponse.json({
    totalUsers: users.length,
    users,
  });
}

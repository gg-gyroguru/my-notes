import { NextResponse } from 'next/server';
import { getComputedNotes } from '@/utils/auth-server.ts';

export async function GET() {
  const notes = getComputedNotes();
  return NextResponse.json({ notes });
}

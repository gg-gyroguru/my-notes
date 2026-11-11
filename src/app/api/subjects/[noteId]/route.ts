import { NextRequest, NextResponse } from 'next/server';
import {
  getComputedNoteById,
  getServerSessionUser,
  getSubjectsForNote,
  hasNoteAccess,
} from '@/utils/auth-server.ts';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await context.params;
  const note = getComputedNoteById(noteId);

  if (!note) {
    return NextResponse.json(
      { error: `Note package '${noteId}' not found.` },
      { status: 404 }
    );
  }

  const user = await getServerSessionUser();
  const unlocked = hasNoteAccess(user, noteId);
  const subjects = getSubjectsForNote(noteId, unlocked);

  return NextResponse.json({
    note,
    unlocked,
    subjects,
  });
}

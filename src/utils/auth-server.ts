import { cookies } from 'next/headers';
import usersData from '@/data/users.json';
import discountData from '@/data/discount.json';
import notesData from '@/data/notes.json';
import subjectsData from '@/data/subjects.json';
import { NotePackage, SubjectFolder, UserRecord } from './types.ts';

export const AUTH_COOKIE_NAME = 'tb_session_user';

export function getAllUsers(): UserRecord[] {
  return usersData as UserRecord[];
}

export function findUserById(id: string): UserRecord | undefined {
  return getAllUsers().find((u) => u.id === id);
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return getAllUsers().find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export async function getServerSessionUser(): Promise<UserRecord | null> {
  try {
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!rawCookie) return null;

    const tryParse = (str: string): { id?: string; email?: string } | null => {
      try {
        const clean = str.trim().replace(/^"|"$/g, '');
        return JSON.parse(clean);
      } catch {
        return null;
      }
    };

    let parsed: { id?: string; email?: string } | null = null;
    try {
      parsed = tryParse(decodeURIComponent(rawCookie));
    } catch {
      // Ignore
    }

    if (!parsed) {
      parsed = tryParse(rawCookie);
    }

    if (parsed?.id) {
      const found = findUserById(parsed.id);
      if (found) return found;
    }
    if (parsed?.email) {
      const found = findUserByEmail(parsed.email);
      if (found) return found;
    }

    // Direct fallback if rawCookie was just user id or email string
    const cleanRaw = rawCookie.trim().replace(/^"|"$/g, '');
    const byId = findUserById(cleanRaw);
    if (byId) return byId;
    const byEmail = findUserByEmail(cleanRaw);
    if (byEmail) return byEmail;

    return null;
  } catch {
    return null;
  }
}

export function hasNoteAccess(user: UserRecord | null, noteId: string): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;
  return Array.isArray(user.purchasedNotes) && user.purchasedNotes.includes(noteId);
}

export function getComputedNotes(): NotePackage[] {
  const discountPercentage = discountData.discountPercentage ?? 55;
  return notesData.map((note) => {
    const discountedPrice = Math.round(
      note.originalPrice * (1 - discountPercentage / 100)
    );
    return {
      ...note,
      discountPercentage,
      discountedPrice,
    };
  });
}

export function getComputedNoteById(noteId: string): NotePackage | undefined {
  return getComputedNotes().find((n) => n.id === noteId);
}

export function getSubjectsForNote(
  noteId: string,
  unlocked: boolean
): SubjectFolder[] {
  const allSubjects = (subjectsData as Record<string, SubjectFolder[]>)[noteId] || [];
  return allSubjects.map((subj) => ({
    ...subj,
    units: subj.units.map((u) => ({
      ...u,
      pdfFile: unlocked ? u.pdfFile : null,
      examQuestions: unlocked ? u.examQuestions : undefined,
    })),
  }));
}

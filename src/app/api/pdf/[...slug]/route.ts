import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSessionUser, hasNoteAccess } from '@/utils/auth-server.ts';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;

  if (!slug || slug.length < 2) {
    return NextResponse.json(
      { error: 'Invalid PDF path requested.' },
      { status: 400 }
    );
  }

  const noteId = slug[0];
  const user = await getServerSessionUser();

  if (!hasNoteAccess(user, noteId)) {
    return NextResponse.json(
      {
        error:
          '403 Unauthorized: You must purchase this MP D.El.Ed notes package to stream protected PDF files.',
      },
      { status: 403 }
    );
  }

  // Prevent directory traversal
  const sanitizedParts = slug.map((part) => path.basename(part));
  const pdfFilePath = path.join(
    process.cwd(),
    'src',
    'storage',
    'pdfs',
    ...sanitizedParts
  );

  if (!fs.existsSync(pdfFilePath)) {
    return NextResponse.json(
      { error: 'Requested PDF file not found in protected storage.' },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(pdfFilePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${sanitizedParts[sanitizedParts.length - 1]}"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

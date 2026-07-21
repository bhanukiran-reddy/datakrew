/**
 * Draft Mode entry point.
 * Enable draft mode and redirect to the requested path.
 *
 * Usage (e.g. from WordPress preview link):
 *   GET /api/draft?secret=DRAFT_SECRET&slug=/fr/about
 *
 * Note: fetchGraphQL does not auto-read draftMode (that would force every page dynamic).
 * Preview routes must pass `{ preview: true }` into fetchGraphQL after awaiting draftMode().
 *
 * Set DRAFT_SECRET in .env (or use the same token as your CMS preview auth).
 */

import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug = request.nextUrl.searchParams.get('slug') ?? '/';

  if (secret !== process.env.DRAFT_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  const safeSlug = slug.startsWith('/') ? slug : `/${slug}`;
  return NextResponse.redirect(new URL(safeSlug, request.url));
}

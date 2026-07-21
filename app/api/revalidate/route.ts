/**
 * On-demand revalidation (ISR).
 * Call with POST and secret token to revalidate cache by tag or path.
 *
 * Example (from CMS webhook or deploy hook):
 *   POST /api/revalidate?secret=YOUR_TOKEN
 *   Body: { tag: "page-en-about" } or { path: "/en/about" }
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const tag = body.tag as string | undefined;
    const path = body.path as string | undefined;

    if (tag) {
      revalidateTag(tag, 'max');
      return NextResponse.json({ revalidated: true, tag });
    }
    if (path) {
      revalidatePath(path, 'page');
      return NextResponse.json({ revalidated: true, path });
    }

    return NextResponse.json({ error: 'Provide tag or path' }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Revalidation failed' },
      { status: 500 },
    );
  }
}

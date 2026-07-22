import { NextResponse } from "next/server";
import { getBookaDemoPage } from "@/lib/graphql/queries/getBookADemoPage";

/**
 * GET /api/book-a-demo?locale=en
 * Returns Book a Demo page data from CMS for client-side consumption.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") ?? "en";
  try {
    const pageData = await getBookaDemoPage(locale);
    return NextResponse.json(pageData ?? null);
  } catch (err) {
    console.error("[api/book-a-demo]", err);
    return NextResponse.json(null, { status: 200 });
  }
}

import {
  isValidLocale,
  getSupportedLocalesSync,
  getDefaultLocaleSync,
} from "@/lib/config/locales";
import { Suspense } from "react";
import { HeaderSkeleton } from "@/components/layout/Header/Header";
import Footer, { FooterSkeleton } from "@/components/layout/Footer/Footer";
import PageWrapper from "@/components/layout/PageWrapper/PageWrapper";
import {
  LocaleHeaderStream,
  LocaleFooterStream,
} from "./LocaleLayoutStreams";

/** Allow any locale at runtime (rewrites send / → /en; generateStaticParams prebuilds known locales). */
export const dynamicParams = true;
export const revalidate = 60;

/** All locales (including default). Default locale has no prefix: /, /tech-stack. Others: /fr, /fr/tech-stack. Proxy rewrites / → /en internally and redirects /en → /. */
export async function generateStaticParams() {
  try {
    const { getLocales } = await import("@/lib/graphql/queries/getLocales");
    const list = await getLocales();
    return list.map((l) => ({ locale: l.code }));
  } catch {
    return getSupportedLocalesSync().map((locale) => ({ locale }));
  }
}

/**
 * Locale layout — fetches site config, nav, languages from CMS and passes to layout.
 * WebPage JSON-LD lives on each page via RouteWebPageSchema({ path }) so this layout stays ISR-safe.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  // fall back to the default locale instead of 404-ing.
  // The page component uses resolveLocaleAndPath to treat the segment as a page slug.
  const locale = isValidLocale(rawLocale) ? rawLocale : getDefaultLocaleSync();

  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <LocaleHeaderStream locale={locale} />
      </Suspense>
      <PageWrapper>{children}</PageWrapper>
      <Suspense fallback={<FooterSkeleton />}>
        <LocaleFooterStream locale={locale} />
      </Suspense>
    </>
  );
}

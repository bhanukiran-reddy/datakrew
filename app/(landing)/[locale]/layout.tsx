import { isValidLocale, getDefaultLocaleSync, getSupportedLocalesSync } from "@/lib/config/locales";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { getLocales } = await import("@/lib/graphql/queries/getLocales");
    const list = await getLocales();
    return list.map((l) => ({ locale: l.code }));
  } catch {
    return getSupportedLocalesSync().map((locale) => ({ locale }));
  }
}

export default async function LandingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : getDefaultLocaleSync();

  return (
    <div className="landing-page-container" data-locale={locale}>
      {children}
    </div>
  );
}

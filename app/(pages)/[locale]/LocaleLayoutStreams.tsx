import { getSiteConfig } from "@/lib/config/site";
import { getLanguages } from "@/lib/i18n/getLanguages";
import { getNavigation } from "@/lib/graphql/queries/getNavigation";
import { getFooterMegaMenu } from "@/lib/graphql/queries/getFooterMegaMenu";
import { getHeaderMegaMenu } from "@/lib/graphql/queries/getHeaderMegaMenu";
import Header from "@/components/layout/Header/Header";
import Footer, { FooterSkeleton } from "@/components/layout/Footer/Footer";

export async function LocaleHeaderStream({ locale }: { locale: string }) {
  const [siteConfig, languages, navigation, headerData] = await Promise.all([
    getSiteConfig(),
    getLanguages(),
    getNavigation(locale).catch(() => ({ header: [], footer: [] })),
    getHeaderMegaMenu().catch(() => null),
  ]);

  return (
    <Header
      locale={locale}
      siteName={siteConfig.name}
      items={navigation.header}
      languages={languages}
      headerData={headerData}
    />
  );
}

export async function LocaleFooterStream({ locale }: { locale: string }) {
  const [siteConfig, navigation, footerData] = await Promise.all([
    getSiteConfig(),
    getNavigation(locale).catch(() => ({ header: [], footer: [] })),
    getFooterMegaMenu().catch(() => null),
  ]);

  return (
    <Footer
      locale={locale}
      siteName={siteConfig.name}
      tagline={siteConfig.defaultDescription}
      items={navigation.footer}
      footerData={footerData}
    />
  );
}

import { getSiteConfig } from "@/lib/config/site";
import { getLanguages } from "@/lib/i18n/getLanguages";
import { getFooterMegaMenu } from "@/lib/graphql/queries/getFooterMegaMenu";
import { getHeaderMegaMenu } from "@/lib/graphql/queries/getHeaderMegaMenu";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

export async function LocaleHeaderStream({ locale }: { locale: string }) {
  const [siteConfig, languages, headerData] = await Promise.all([
    getSiteConfig(),
    getLanguages(),
    getHeaderMegaMenu().catch((err) => {
      console.error(
        "[LocaleHeaderStream] headerMegaMenu",
        err instanceof Error ? err.message : err,
      );
      return null;
    }),
  ]);

  return (
    <Header
      locale={locale}
      siteName={siteConfig.name}
      languages={languages}
      headerData={headerData}
    />
  );
}

export async function LocaleFooterStream({ locale }: { locale: string }) {
  const [siteConfig, footerData] = await Promise.all([
    getSiteConfig(),
    getFooterMegaMenu().catch((err) => {
      console.error(
        "[LocaleFooterStream] footerMegaMenu",
        err instanceof Error ? err.message : err,
      );
      return null;
    }),
  ]);

  return (
    <Footer
      locale={locale}
      siteName={siteConfig.name}
      tagline={siteConfig.defaultDescription}
      footerData={footerData}
    />
  );
}

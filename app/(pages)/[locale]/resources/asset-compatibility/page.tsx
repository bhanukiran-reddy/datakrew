import styles from './AssetCompatibility.module.css';
import AssetClass from '@/components/ui/AssetClass/AssetClass';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import FAQSection from '@/components/sections/reusable/FAQSection/FAQSection';
import FaqPageSchema from '@/components/seo/FaqPageSchema';
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import Stats from "@/components/ui/Stats/Stats";
import { getAssetCompatibilityPage } from "@/lib/graphql/queries/getAssetCompatibilityPage";
import { Metadata } from 'next';
import { buildMetadata } from "@/lib/utils/metadata";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const data = await getAssetCompatibilityPage(locale).catch(() => null);
  
  return buildMetadata(data?.page?.seo || { title: "Asset Compatibility" }, locale, { path: 'resources/asset-compatibility' });
}

export const revalidate = 60;

export default async function AssetCompatibility({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const data = await getAssetCompatibilityPage(locale);
  const { page, assetCompatibilityItems } = data;

  const getFilteredAssets = (slug: string): any[] => {
    if (!assetCompatibilityItems) return [];
    return assetCompatibilityItems.filter((item: any) =>
      item.assetCategories?.nodes?.some((category: any) => category.slug === slug)
    );
  };

  const assetsSupported = getFilteredAssets("assets-supported");
  const powertrainsSupported = getFilteredAssets("powertrains-supported");

  const bannerData = {
    title: page?.innerPageStatsBanner?.innerpageStatsHeroHeading,
    description: page?.innerPageStatsBanner?.innerpageStatsHeroDescription,
    backgroundImage: {
      url: page?.innerPageStatsBanner?.innerpageStatsHeroImage?.node?.mediaItemUrl,
      alt: page?.innerPageStatsBanner?.innerpageStatsHeroHeading || "Banner",
    },
    mobileImage: {
      url: page?.innerPageStatsBanner?.innerpageStatsHeroMobileImage?.node?.mediaItemUrl,
      alt: page?.innerPageStatsBanner?.innerpageStatsHeroHeading || "Mobile Banner",
    }
  };

  const bannerBreadcrumbs = [
    { label: "Home", href: `/${locale}` },
    { label: "Resources" },
    { label: "Asset Compatibility" }
  ];

  const bannerStats = page?.innerPageStatsBanner?.bannerStats?.map((stat: any) => ({
    statsValue: stat.bannerStatsValue,
    statsDescription: stat.bannerStatsDescription,
  })) || [];

  const contactStripData = {
    prefooterCtaBannerHeading: page?.prefooterCtaBannerSection?.prefooterCtaBannerHeading,
    prefooterCtaBannerDescription: page?.prefooterCtaBannerSection?.prefooterCtaBannerDescription,
    prefooterCtaBackgroundImage: page?.prefooterCtaBannerSection?.prefooterCtaBackgroundImage,
    prefooterBannerCtaButtons: page?.prefooterCtaBannerSection?.prefooterBannerCtaButtons,
  };

  const faqData = page?.faqSection?.faqItems?.map((item: any, index: number) => ({
    id: `faq-${index}`,
    question: item.question,
    answer: item.answer,
  })) || [];

  return (
    <>
      <FaqPageSchema items={faqData} />
      <InnerPageBanner {...bannerData as any} breadcrumbItems={bannerBreadcrumbs} className={styles.assetBanner}>
        <div className={styles.banner}>
          {bannerStats.length > 0 && <Stats stats={bannerStats} />}
        </div>
      </InnerPageBanner>

      <section className={styles.statsWrapper}>
        <div className='container'>
          {bannerStats.length > 0 && <Stats stats={bannerStats} />}
        </div>
      </section>
      <section className={styles.section}>
        <div className="container">
          <div className={styles.titleDesc}>
            {page?.assetCompatibilitySection?.assetSectionHeading && (
              <h2 className='sectionTitle' dangerouslySetInnerHTML={{ __html: page.assetCompatibilitySection.assetSectionHeading }}></h2>
            )}
            {page?.assetCompatibilitySection?.assetSectionDescription && (
              <p dangerouslySetInnerHTML={{ __html: page.assetCompatibilitySection.assetSectionDescription }}></p>
            )}
          </div>
          <AssetClass
            title={page?.assetCompatibilitySection?.assetSection?.assetsSectionTitle || "Assets supported"}
            items={assetsSupported}
          />
          <AssetClass
            title={page?.assetCompatibilitySection?.assetSection?.powertrainsSectionTitle || "Powertrains supported"}
            items={powertrainsSupported}
          />
        </div>
      </section>
      {faqData.length > 0 && (
        <FAQSection
          title={page?.faqSection?.faqSectionHeading || "Frequently Asked <span>Questions</span>"}
          items={faqData}
        />
      )}
      <ContactStripSection {...contactStripData as any} />

    </>
  );
}
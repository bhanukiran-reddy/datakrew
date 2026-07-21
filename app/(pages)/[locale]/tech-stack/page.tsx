import type { Metadata } from 'next';
import type { CMSPage, CMSSection } from '@/lib/types/cms';
import { getIntelligenceInfrastructurePage } from '@/lib/graphql/queries/getIntelligenceInfrastructurePage';
import { buildMetadata } from '@/lib/utils/metadata';
import Image from '@/components/ui/Image/Image';
import InnerPageBanner from '@/components/sections/reusable/InnerPageBanner/InnerPageBanner';
import ProductStackSection from '@/components/sections/reusable/ProductStackSection/ProductStackSection';
import OperationalCertaintySection from '@/components/sections/reusable/OperationalCertaintySection/OperationalCertaintySection';
import PartnersSection from '@/components/sections/reusable/PartnersSection/PartnersSection';
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import FAQSection from '@/components/sections/reusable/FAQSection/FAQSection';
import FaqPageSchema from '@/components/seo/FaqPageSchema';
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import BgTitleDescriptionSection from '@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection';
import Link from '@/components/ui/Link/Link';
import bannerStyles from '@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css';
import styles from './intelligenceInfrastructure.module.css';
import AnimatedVehicleInsight from './AnimatedVehicleInsight';
import FleetAgentsSection from '@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection';
import FleetGapsSection from '@/components/sections/reusable/FleetGapsSection/FleetGapsSection';



type Props = { params: Promise<{ locale: string }> };

export const revalidate = 60;

/** Get one section's data from CMS page by type (for passing as props). */
function getSectionData(page: CMSPage, type: string): Record<string, unknown> | undefined {
  const section = page.sections?.find((s: CMSSection) => s.type === type);
  return section?.data as Record<string, unknown> | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getIntelligenceInfrastructurePage(locale).catch(() => null);

  return buildMetadata(page?.seo || { title: 'Tech Stack' }, locale, { path: 'tech-stack' });
}

/** Intelligence Infrastructure: sections in same order as mock data. Mock when USE_MOCK_PAGE_DATA=true; else CMS only. */
export default async function IntelligenceInfrastructurePage({ params }: Props) {
  const { locale } = await params;

  const page = await getIntelligenceInfrastructurePage(locale).catch(() => null);

  const bannerData = (page ? getSectionData(page, 'hero') : undefined) || {};
  const productStackData = (page ? getSectionData(page, 'productStack') : undefined) || {};
  const vehicleInsightData = (page ? getSectionData(page, 'vehicleInsight') : undefined) || {};
  const operationalCertaintyData = (page ? getSectionData(page, 'operationalCertainty') : undefined) || {};
  const partnersData = (page ? getSectionData(page, 'partners') : undefined) || {};
  const testimonialData = (page ? getSectionData(page, 'testimonial') : undefined) || {};
  const quantifiedImpactData = (page ? getSectionData(page, 'quantifiedImpact') : undefined) || {};
  const callToActionBannerData = (page ? getSectionData(page, 'callToActionBanner') : undefined) || {};
  const faqData = (page ? getSectionData(page, 'faq') : undefined) || {};
  const faqSchemaItems =
    (faqData.items as Array<{ question: string; answer: string }>) || [];
  const contactStripData = (page ? getSectionData(page, 'contactStrip') : undefined) || {};
  const fleetAgentsData = (page ? getSectionData(page, 'fleetAgents') : undefined) || {};

  const ctaButtons = (bannerData.ctaButtons as Array<{ url: string; label: string; variant?: string }>) || [];

  return (
    <>
      <FaqPageSchema items={faqSchemaItems} />
      <InnerPageBanner
        title={bannerData.title as string}
        description={(bannerData.subtitle as string) || (bannerData.description as string)}
        titleHighlight="intelligence"
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Tech Stack' }
        ]}
        backgroundImage={bannerData.backgroundImage as { url: string; alt: string; width: number; height: number }}
        mobileImage={bannerData.mobileImage as { url: string; alt: string; width: number; height: number }}
      >
        {ctaButtons.length > 0 ? (
          <div className={bannerStyles.innerPageBannerCtaGroup}>
            {ctaButtons.map((btn, index: number) => (
              <Link key={index} className={index === 1 ? 'secondaryCta' : 'primaryCta'} href={btn.url}>
                {btn.label}
                <i className={`icon fa-kit fa-right-arrow`}></i>
              </Link>
            ))}
          </div>
        ) : (
          (bannerData.ctaText as string) && (bannerData.ctaUrl as string) && (
            <Link className="primaryCta" href="/">
              {bannerData.ctaText as string}
              <i className={`${bannerStyles.innerPageBannerArrowIcon} ${styles.bannerArrowIcon} fa-kit fa-right-arrow`}></i>
            </Link>
          )
        )}
      </InnerPageBanner>
      <ProductStackSection {...productStackData} />
      <AnimatedVehicleInsight vehicleInsightData={vehicleInsightData} />
      <OperationalCertaintySection {...operationalCertaintyData} />
      <FleetAgentsSection
        {...fleetAgentsData}
        title={(page as any)?.featureTabsSection?.featureTabsSectionHeading || (fleetAgentsData.title as string)}
      />
      <PartnersSection {...partnersData} className={styles.partnersSectionGradient} />
      {(callToActionBannerData.title || callToActionBannerData.description) && (
        <BgTitleDescriptionSection
          title={(callToActionBannerData.title as string) ?? ''}
          description={(callToActionBannerData.description as string) ?? ''}
          titleHighlight={callToActionBannerData.titleHighlight as string | undefined}
          backgroundImage={callToActionBannerData.backgroundImage as { url: string; alt: string; width: number; height: number } | undefined}
          button={(callToActionBannerData.button as { label: string; url: string; variant?: 'primary' | 'secondary' | 'ghost' }) ?? { label: '', url: '#' }}
        />
      )}
      {/* <TestimonialSection {...testimonialData} /> */}
      {(quantifiedImpactData as any)?.csCarouselItems?.nodes?.length > 0 && (
        <QuantifiedImpactSection {...quantifiedImpactData} />
      )}
      <FAQSection {...faqData} />
      <ContactStripSection {...contactStripData} />

    </>
  );
}

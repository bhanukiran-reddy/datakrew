import type { Metadata } from "next";
import type { CMSPage, CMSSection } from "@/lib/types/cms";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import styles from "./about-us.module.css";
import FleetAgentsSection from "@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import OneDevice from "@/components/sections/reusable/OneDevice/OneDevice";
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import { getAboutUsPage } from "@/lib/graphql/queries/getAboutUsPage";
import { buildMetadata } from "@/lib/utils/metadata";
import { getSiteConfigFallback } from "@/lib/config/site";
import BgTitleDescriptionSection from "@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection";
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import WebGLOrganicFlow from "@/components/sections/reusable/WebGLOrganicFlow/WebGLOrganicFlow";
import FleetGapsSection from "@/components/sections/reusable/FleetGapsSection/FleetGapsSection";
import RecognisedGlobally from "@/components/sections/Pages/AboutUs/RecognisedGlobally/RecognisedGlobally";
import StackFitSection from "@/components/sections/reusable/StackFitSection/StackFitSection";
import JourneySection from "@/components/sections/Pages/AboutUs/JourneySection/JourneySection";
import AboutUsTeamSection from "@/components/sections/Pages/AboutUs/AboutUsTeamSection/AboutUsTeamSection";
import OemLogo from "@/components/ui/OemLogo/OemLogo";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

/** Get one section's data from CMS page by type (for passing as props). */
function getSectionData(
  page: CMSPage | null,
  type: string,
): Record<string, unknown> | undefined {
  if (!page) return undefined;
  const section = page.sections?.find((s: CMSSection) => s.type === type);
  return section?.data as Record<string, unknown> | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getAboutUsPage(locale).catch(() => null);
  if (!page) {
    const fallback = getSiteConfigFallback();
    return buildMetadata(null, locale, { title: "About Us", description: fallback.defaultDescription, path: 'about-us' });
  }

  return buildMetadata(page.seo, locale, {
    title: page.title || "About Us",
    description: page.seo?.description,
    path: 'about-us',
  });
}

export const revalidate = 60;

export default async function ItusMaxPage({ params }: Props) {
  const { locale } = await params;

  const page = await getAboutUsPage(locale).catch(() => null);

  const bannerData =
    (page ? getSectionData(page, "innerPageBanner") : undefined) || {};
  const fleetAgentsData =
    (page ? getSectionData(page, "fleetAgents") : undefined) || {};
  const faqRaw =
    (page as any)?.infrastructure?.faqSection ||
    (page ? getSectionData(page, "faq") : undefined) ||
    {};
  const faqData = {
    title: faqRaw.faqSectionHeading || faqRaw.title,
    items: Array.isArray(faqRaw.faqItems)
      ? faqRaw.faqItems
      : faqRaw.faqItems?.nodes?.map((n: any) => ({
        question: n.title,
        answer: n.content,
      })) ||
      faqRaw.items ||
      [],
    ...faqRaw,
  };
  const contactStripData =
    (page as any)?.infrastructure?.prefooterCtaBannerSection ||
    (page ? getSectionData(page, "contactStrip") : undefined) ||
    {};
  const textImageData =
    (page ? getSectionData(page, "textImage") : undefined) || {};
  const installItusData =
    (page ? getSectionData(page, "installItus") : undefined) || {};
  const compatibilityData =
    (page ? getSectionData(page, "compatibility") : undefined) || {};
  const completeYourIntelligenceData =
    (page as any)?.infrastructure?.intelligenceStackSection ||
    (page ? getSectionData(page, "completeYourIntelligence") : undefined) ||
    {};
  const protectedByDesignData =
    (page ? getSectionData(page, "protectedByDesign") : undefined) || {};
  const ultraSecureDesignData =
    (page ? getSectionData(page, "ultraSecureDesign") : undefined) || {};
  const partnersData =
    (page ? getSectionData(page, "partners") : undefined) || {};
  const bgTitleDescriptionData =
    (page ? getSectionData(page, "bgTitleDescription") : undefined) || {};
  const testimonialData =
    (page ? getSectionData(page, "testimonial") : undefined) || {};
  const quantifiedImpactData =
    (page as any)?.infrastructure?.caseStudyCarouselSection ||
    (page as any)?.caseStudyCarouselSection ||
    (page ? getSectionData(page, "quantifiedImpact") : undefined) ||
    {};
  const journeyData =
    (page ? getSectionData(page, "journey") : undefined) || {};
  const fleetGapsData =
    (page ? getSectionData(page, "fleetGaps") : undefined) || {};
  const stackFitData =
    (page ? getSectionData(page, "stackFit") : undefined) || {};
  const teamData =
    (page ? getSectionData(page, "team") : undefined) || {};
  const investorsData =
    (page ? getSectionData(page, "investors") : undefined) || {};
  const navData = page ? getSectionData(page, "secondaryNav") : undefined;

  const ctaButtons =
    (bannerData.ctaButtons as Array<{ url: string; label: string }>) || [];

  let navItems: Array<{ label: string; id: string }> = [];
  if (
    navData &&
    Array.isArray(navData.navItems) &&
    navData.navItems.length > 0
  ) {
    navItems = navData.navItems.map(
      (n: { label?: string; anchor?: string }) => ({
        label: n.label || "",
        id: (n.anchor || "").replace("#", ""),
      }),
    );
  }

  return (
    <>
      <InnerPageBanner
        title={bannerData.title as string}
        description={bannerData.description as string}
        titleHighlight={bannerData.titleHighlight as string}
        breadcrumbItems={
          bannerData.breadcrumbItems as Array<{ label: string; href?: string }>
        }
        backgroundImage={
          bannerData.backgroundImage as {
            url: string;
            alt: string;
            width: number;
            height: number;
          }
        }
        mobileImage={
          bannerData.mobileImage as {
            url: string;
            alt: string;
            width: number;
            height: number;
          }
        }
        className={`${styles.itusmaxBanner} ${styles.aboutUsSection}`}
        backgroundColor="#111216"
      >
      </InnerPageBanner>
      <OneDevice
        title={textImageData.sectionHeading as string}
        description={textImageData.sectionDescription as string}
        image={textImageData.image as { url: string; alt?: string }}
        stats={
          textImageData.stats as
          | Array<{ statsDescription?: string; statsValue?: string }>
          | undefined
        }
        statsWidth="narrow"
        className={`${styles.aboutUsSection} ${styles.oneDeviceSection}`}
      />
      <JourneySection
        title={journeyData.title as string}
        description={journeyData.description as string}
        items={journeyData.items as any[]}
        className={styles.aboutUsSection}
      />
      <UltraSecureDesignSection
        {...ultraSecureDesignData}
        id={navItems[2]?.id || "ultraSecureDesign"}
        background={<WebGLOrganicFlow />}
        columns={3}
        className={styles.aboutUsSection}
      />
      <BgTitleDescriptionSection
        {...bgTitleDescriptionData}
        id="bgTitleDescription"
        className={styles.aboutUsSection}
      />
      <FleetAgentsSection
        {...fleetAgentsData}
        title={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionHeading || (fleetAgentsData.title as string)}
        subheading={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionDescription || (fleetAgentsData.subheading as string)}
        id={navItems[0]?.id || "fleetAgents"}
        headerAlign="left"
        className={styles.aboutUsSection}
      />
      <FleetGapsSection
        {...fleetGapsData}
        id="fleetGaps"
        isByOEM={true}
        className={styles.aboutUsSection}
      />
      <AboutUsTeamSection
        title={teamData.title as string}
        button={teamData.button as { label: string; url: string }}
        members={teamData.members as any[]}
        className={styles.aboutUsSection}
      />
      <OemLogo title={investorsData.title as string} logos={investorsData.logos as any[]} className={styles.aboutUsSection} />
      <OemLogo title={partnersData.title as string} logos={partnersData.logos as any[]} className={styles.aboutUsSection} />
      <StackFitSection {...stackFitData} id="stackFit" textAlign="center" className={styles.aboutUsSection} />
      <ContactStripSection {...contactStripData} id="contactStrip" className={styles.aboutUsSection} />
    </>
  );
}

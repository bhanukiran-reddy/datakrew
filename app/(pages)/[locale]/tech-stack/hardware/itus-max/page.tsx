import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import type { CMSPage, CMSSection } from "@/lib/types/cms";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import ProductPageSchema from "@/components/seo/ProductPageSchema";
import styles from "./itusmax.module.css";
import FleetAgentsSection from "@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection";
import InstallItus from "@/components/sections/Pages/ITUSMaxPage/InstallItus/InstallItus";
import CompleteYourIntelligence from "@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence";
import Compatibility from "@/components/sections/Pages/ITUSMaxPage/Compatibility/Compatibility";
import FAQSection from "@/components/sections/reusable/FAQSection/FAQSection";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import OneDevice from "@/components/sections/reusable/OneDevice/OneDevice";
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import ProtectedByDesignSection from "@/components/sections/reusable/ProtectedByDesignSection/ProtectedByDesignSection";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import { getInfrastructureItusMaxPage } from "@/lib/graphql/queries/getItusMaxPage";
import BgTitleDescriptionSection from "@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection";
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import WebGLOrganicFlow from "@/components/sections/reusable/WebGLOrganicFlow/WebGLOrganicFlow";


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
  const page = await getInfrastructureItusMaxPage(
    locale,
    "/infrastructure/itus-max",
  ).catch(() => null);
  
  return buildMetadata(page?.seo || { title: "ITUSMax" }, locale, { path: 'tech-stack/hardware/itus-max' });
}

export const revalidate = 60;

export default async function ItusMaxPage({ params }: Props) {
  const { locale } = await params;

  const page = await getInfrastructureItusMaxPage(
    locale,
    "/infrastructure/itus-max",
  ).catch(() => null);

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
      <ProductPageSchema
        path="tech-stack/hardware/itus-max"
        description={
          (page as { seo?: { metaDesc?: string } })?.seo?.metaDesc ||
          (bannerData.description as string)
        }
        image={
          (bannerData.backgroundImage as { url?: string } | undefined)?.url
        }
        faqItems={faqData.items as Array<{ question: string; answer: string }>}
      />
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
        className={styles.itusmaxBanner}
        backgroundColor="#111216"
      >
        {ctaButtons.length > 0 && (
          <div className={bannerStyles.innerPageBannerCtaGroup}>
            {ctaButtons.map((btn, index: number) => (
              <Link
                key={index}
                href={btn.url}
                className={index === 1 ? "secondaryCta" : "primaryCta"}
              >
                {btn.label}
                <i className={`icon fa-kit fa-right-arrow`}></i>
              </Link>
            ))}
          </div>
        )}
      </InnerPageBanner>
      <StickyNavSection offset={150} items={navItems} />
      <OneDevice
        title={textImageData.sectionHeading as string}
        description={textImageData.sectionDescription as string}
        image={textImageData.image as { url: string; alt?: string }}
        stats={
          textImageData.stats as
          | Array<{ statsDescription?: string; statsValue?: string }>
          | undefined
        }
        className={styles.oneDeviceSection}
        id={navItems[0]?.id || "oneDeviceSection"}
      />
      <FleetAgentsSection
        {...fleetAgentsData}
        title={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionHeading || (fleetAgentsData.title as string)}
        subheading={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionDescription || (fleetAgentsData.subheading as string)}
        id={navItems[1]?.id || "fleetAgents"}

      />
      <InstallItus {...installItusData} id={navItems[2]?.id || "installItus"} />
      <UltraSecureDesignSection
        {...ultraSecureDesignData}
        id={navItems[3]?.id || "ultraSecureDesign"}
        background={<WebGLOrganicFlow />}
        columns={3}
      />
      <ProtectedByDesignSection
        {...protectedByDesignData}
        id={navItems[4]?.id || "protectedByDesign"}
      />
      <Compatibility
        {...compatibilityData}
        id={navItems[5]?.id || "compatibility"}
        partners={
          ((partnersData as any).partners ||
            (compatibilityData as any).partners) as Array<{
              name?: string;
              image?: string;
            }>
        }
        partnersDescription={
          ((partnersData as any).description ||
            (compatibilityData as any).description) as string
        }
      />
      <BgTitleDescriptionSection
        {...bgTitleDescriptionData}
        id="bgTitleDescription"
      />
      {/* <TestimonialSection {...testimonialData} id="testimonial" /> */}
      <QuantifiedImpactSection
        {...quantifiedImpactData}
        id="quantifiedImpact"
      />
      <CompleteYourIntelligence
        {...(completeYourIntelligenceData as any)}
        // id={navItems[6]?.id || "completeyourintelligence"}
        isItusMaxAutoscan
      />
      <FAQSection id={navItems[6]?.id || "faq"} {...faqData} />
      <ContactStripSection {...contactStripData} id="contactStrip" />

    </>
  );
}

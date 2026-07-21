import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/metadata';
import type { CMSPage, CMSSection } from "@/lib/types/cms";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import { getByCustomerByFleetPage } from "@/lib/graphql/queries/getByCustomerByFleetPage";

import Link from "@/components/ui/Link/Link";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import styles from "./fleet-management.module.css";

import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import FleetGapsSection from "@/components/sections/reusable/FleetGapsSection/FleetGapsSection";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import VehicleInsightSection from '@/components/sections/reusable/VehicleInsightSection/VehicleInsightSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import BgTitleDescriptionSection from "@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection";
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import CompleteYourIntelligence from "@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence";
import FAQSection from "@/components/sections/reusable/FAQSection/FAQSection";
import ServicePageSchema from "@/components/seo/ServicePageSchema";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import { OperationalCertaintySection } from "@/components/sections/reusable/OperationalCertaintySection";

import PartnersSection from "@/components/sections/reusable/PartnersSection/PartnersSection";

import FleetAgentsSection from '@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection';
import OutcomesSection from "@/components/sections/Pages/Home/OutcomesSection/OutcomesSection";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

/** Helper: get section data by type */
function getSectionData(
  page: CMSPage | null,
  type: string,
): Record<string, unknown> | undefined {
  if (!page) return undefined;
  const section = page.sections?.find((s: CMSSection) => s.type === type);
  return section?.data as Record<string, unknown> | undefined;
}

/* =========================
   METADATA
========================= */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const page = await getByCustomerByFleetPage(
    locale,
    "/tech-stack/byfleet",
  ).catch(() => null);

  return buildMetadata(page?.seo || { title: "Byfleet" }, locale, { path: 'customer/fleet-management' });
}

/* =========================
  PAGE
========================= */
export const revalidate = 60;

export default async function ByfleetPage({ params }: Props) {
  const { locale } = await params;

  const page = await getByCustomerByFleetPage(
    locale,
    "/tech-stack/byfleet",
  ).catch(() => null);

  /* section data */
  const bannerData =
    (page ? getSectionData(page, "innerPageBanner") : undefined) || {};
  const navData = page ? getSectionData(page, "secondaryNav") : undefined;
  const textImageData =
    (page ? getSectionData(page, "textImage") : undefined) || {};
  const fleetGapsData =
    (page ? getSectionData(page, "fleetGaps") : undefined) || {};
  const ultraSecureData =
    (page ? getSectionData(page, "ultraSecureDesign") : undefined) || {};
  const vehicleInsightData =
    (page ? getSectionData(page, "vehicleInsight") : undefined) || {};
  const quantifiedImpactData =
    (page ? getSectionData(page, "quantifiedImpact") : undefined) || {};
  const bgTitleDescriptionData =
    (page ? getSectionData(page, "bgTitleDescription") : undefined) || {};
  const bgTitleDescriptionData2 =
    (page ? getSectionData(page, "bgTitleDescription2") : undefined) || {};
  const testimonialData =
    (page ? getSectionData(page, "testimonial") : undefined) || {};
  const stackData =
    (page ? getSectionData(page, "completeYourIntelligence") : undefined) || {};
  const faqData = (page ? getSectionData(page, "faq") : undefined) || {};
  const contactStripData =
    (page ? getSectionData(page, "contactStrip") : undefined) || {};
  const operationalCertaintyData =
    (page ? getSectionData(page, "operationalCertainty") : undefined) || {};
  const fleetAgentsData =
    (page ? getSectionData(page, "fleetAgents") : undefined) || {};
  const outcomesData =
    (page ? getSectionData(page, "outcomes") : undefined) || {};
  const partnersData =
    (page ? getSectionData(page, "partners") : undefined) || {};

  /*  CTA buttons */
  const ctaButtons =
    (bannerData.ctaButtons as Array<{
      url: string;
      label: string;
      variant?: string;
    }>) || [];

  /* nav items */
  let navItems: Array<{ label: string; id: string }> = [];
  if (navData && Array.isArray(navData.navItems)) {
    navItems = navData.navItems.map((n: any) => ({
      label: n.label || "",
      id: (n.anchor || "").replace("#", ""),
    }));
  }

  return (
    <>
      <ServicePageSchema
        path="customer/fleet-management"
        name={page?.title as string}
        description={
          (page as { seo?: { description?: string } })?.seo?.description ||
          (bannerData.description as string)
        }
        faqItems={(faqData.items as Array<{ question: string; answer: string }>) || []}
      />
      <div>
        {/* ================= Banner ================= */}
        <InnerPageBanner
          title={bannerData.title as string}
          description={bannerData.description as string}
          titleHighlight={bannerData.titleHighlight as string}
          breadcrumbItems={
            bannerData.breadcrumbItems as Array<{
              label: string;
              href?: string;
            }>
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
        >
          {ctaButtons.length > 0 && (
            <div className={bannerStyles.innerPageBannerCtaGroup}>
              {ctaButtons.map((btn, index: number) => (
                <Link
                  key={index}
                  href={btn.url}
                  locale={locale}
                  className={index === 0 ? "primaryCta" : "secondaryCta"}
                >
                  {btn.label}
                  <i
                    className={`icon fa-kit fa-right-arrow`}
                  />
                </Link>
              ))}
            </div>
          )}
        </InnerPageBanner>

        {/* ================= Sticky Nav ================= */}
        {/* <StickyNavSection items={navItems} offset={150} /> */}

        {/* ================= Sections ================= */}
        <OperationalCertaintySection
          align="center"
          showTint={false}
          {...operationalCertaintyData}
        />

        <FleetAgentsSection
          {...fleetAgentsData}
          title={(page as any)?.byCustomer?.featureTabsSection?.featureTabsSectionHeading || (fleetAgentsData.title as string)}
          headerAlign="left"
        />
        {(page as any)?.byCustomer?.centeredCtaBanner && (
          <BgTitleDescriptionSection
            contentAlign="center"
            title={(page as any).byCustomer.centeredCtaBanner.centeredBannerHeading}
            description={(page as any).byCustomer.centeredCtaBanner.centeredBannerDescription}
            backgroundImage={(page as any).byCustomer.centeredCtaBanner.centeredBackgroundImage?.node?.mediaItemUrl ? {
              url: (page as any).byCustomer.centeredCtaBanner.centeredBackgroundImage.node.mediaItemUrl,
              alt: "",
              width: 1920,
              height: 600
            } : undefined}
            button={(page as any).byCustomer.centeredCtaBanner.centeredCtaButton?.centeredButtonText ? {
              label: (page as any).byCustomer.centeredCtaBanner.centeredCtaButton.centeredButtonText,
              url: (page as any).byCustomer.centeredCtaBanner.centeredCtaButton.centeredButtonLink?.url || "#"
            } : undefined}
            titleWidth="max-content"
          />
        )}

        <CompleteYourIntelligence {...stackData} id="completeYourIntelligence" isOxRedLens />
        <OutcomesSection {...outcomesData} />
        <PartnersSection {...(partnersData as any)} />
        <UltraSecureDesignSection {...ultraSecureData} />
        <QuantifiedImpactSection
          {...quantifiedImpactData}
          id="quantifiedImpact"
        />

        {/* <TestimonialSection {...testimonialData} /> */}
        {(page as any)?.byCustomer?.ctaBannerSection && (
          <BgTitleDescriptionSection
            title={(page as any).byCustomer.ctaBannerSection.ctaBannerHeading}
            description={(page as any).byCustomer.ctaBannerSection.ctaBannerDescription}
            backgroundImage={(page as any).byCustomer.ctaBannerSection.ctaBannerBackgroundImage?.node?.mediaItemUrl ? {
              url: (page as any).byCustomer.ctaBannerSection.ctaBannerBackgroundImage.node.mediaItemUrl,
              alt: (page as any).byCustomer.ctaBannerSection.ctaBannerBackgroundImage.node.altText || "",
              width: 1920,
              height: 600
            } : undefined}
            button={(page as any).byCustomer.ctaBannerSection.bannerCtaButtons?.[0] ? {
              label: (page as any).byCustomer.ctaBannerSection.bannerCtaButtons[0].buttonText,
              url: (page as any).byCustomer.ctaBannerSection.bannerCtaButtons[0].buttonUrl?.url || "#"
            } : undefined}
          />
        )}

        <FAQSection
          id="faq"
          title={faqData.title as string}
          items={faqData.items as any}
        />
        <ContactStripSection {...contactStripData} id="contactStrip" />
      </div>
      
    </>
  )
}

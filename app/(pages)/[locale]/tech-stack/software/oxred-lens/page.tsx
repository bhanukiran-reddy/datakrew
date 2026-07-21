import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import type { CMSPage, CMSSection } from "@/lib/types/cms";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import { getInfrastructureOXRedLensPage } from "@/lib/graphql/queries/getOxredLensPage";
import OneDevice from "@/components/sections/reusable/OneDevice/OneDevice";
import VehicleInsightSection from '@/components/sections/reusable/VehicleInsightSection/VehicleInsightSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import BgTitleDescriptionSection from "@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection";
import CompleteYourIntelligence from "@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence";
import FAQSection from "@/components/sections/reusable/FAQSection/FAQSection";
import SoftwareApplicationPageSchema from "@/components/seo/SoftwareApplicationPageSchema";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import FleetAgentsSection from "@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection";
import FleetGapsSection from "@/components/sections/reusable/FleetGapsSection/FleetGapsSection";
import ImageCtaSection from "@/components/sections/reusable/ImageCtaSection/ImageCtaSection";
import SingleMediaSection from "@/components/sections/reusable/SingleMediaSection/SingleMediaSection";

type Props = { params: Promise<{ locale: string }> };

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
  let page: CMSPage | null = await getInfrastructureOXRedLensPage(
    locale,
    "/infrastructure/oxred-lens",
  ).catch(() => null);
  
  return buildMetadata(page?.seo || { title: "OxRed Lens" }, locale, { path: 'tech-stack/software/oxred-lens' });
}

export const revalidate = 60;

export default async function OxRedLensPage({ params }: Props) {
  const { locale } = await params;

  const page = await getInfrastructureOXRedLensPage(
    locale,
    "/infrastructure/oxred-lens",
  ).catch((err) => {
    console.error("OXRED LENS FETCH ERROR:", err);
    return null;
  });

  if (!page) return null;

  const hero = (page as any)?.innerPageHeroSection;
  const bannerData = hero
    ? {
        title: hero.innerpageHeroHeading,
        description: hero.innerpageHeroDescription,
        backgroundImage: {
          url: hero.innerpageHeroImage?.node?.mediaItemUrl,
          alt: "",
        },
        mobileImage: hero.innerpageHeroMobileImage?.node?.mediaItemUrl
          ? {
              url: hero.innerpageHeroMobileImage.node.mediaItemUrl,
              alt: "",
            }
          : undefined,
        breadcrumbItems: [
          { label: "Home", href: "/" },
          { label: "Tech Stack", href: "/tech-stack" },
          { label: "Software"},
          { label: page?.title || "OXRED Lens" },
        ],
        ctaButtons:
          hero.innerpageHeroCTAButtons?.map((btn: any) => ({
            label: btn.buttonText,
            url: btn.buttonUrl?.url || "#",
          })) || [],
      }
    : getSectionData(page, "innerPageBanner") || {};

  const textImageRaw = (page as any)?.textImageStatsSection;
  const textImageData = textImageRaw
    ? {
        title: textImageRaw.textImageStatsHeading,
        description: textImageRaw.textImageStatsDescription,
        image: {
          url: textImageRaw.textImageStatsMedia?.node?.mediaItemUrl || "",
          alt: "",
        },
        stats: textImageRaw.stats || [],
      }
    : getSectionData(page, "textImage") || {};

  const fleetGapsRaw = (page as any)?.featuresCardSection;
  const fleetGapsData = fleetGapsRaw
    ? {
        title: fleetGapsRaw.featuresCardHeading?.split("<span>")[0]?.trim(),
        titleHighlight:
          fleetGapsRaw.featuresCardHeading?.match(/<span>(.*?)<\/span>/)?.[1],
        subtitle: fleetGapsRaw.featuresCardDescription,
        items:
          fleetGapsRaw.featureCards?.map((c: any) => ({
            title: c.featureCardTitle,
            desc: c.featureCardDescription,
            iconClass: c.featureCardIconClass,
            icon: {
              url: c.featureCardIconImage?.node?.mediaItemUrl || "",
              alt: c.featureCardIconImage?.node?.altText || c.featureCardTitle,
            },
          })) || [],
      }
    : getSectionData(page, "fleetGaps") || {};

  const imageCtaRaw = (page as any)?.processWithMediaSection;
  const imageCtaData = imageCtaRaw
    ? {
        image: {
          url: imageCtaRaw.processCenteredImage?.node?.mediaItemUrl || "",
          alt: imageCtaRaw.processCenteredImage?.node?.altText || "",
        },
        primaryCta: imageCtaRaw.processMediaCtaButtons?.[0]?.processButtonText
          ? {
              text: imageCtaRaw.processMediaCtaButtons[0].processButtonText,
              link:
                imageCtaRaw.processMediaCtaButtons[0].processButtonUrl?.url ||
                "#",
              show: true,
            }
          : { show: false },
        secondaryCta: imageCtaRaw.processMediaCtaButtons?.[1]?.processButtonText
          ? {
              text: imageCtaRaw.processMediaCtaButtons[1].processButtonText,
              link:
                imageCtaRaw.processMediaCtaButtons[1].processButtonUrl?.url ||
                "#",
              show: true,
            }
          : { show: false },
      }
    : getSectionData(page, "imageCta");

  const vehicleInsightRaw = (page as any)?.imagePlusTextSection;
  const vehicleInsightData = vehicleInsightRaw
    ? {
        title: vehicleInsightRaw.imageTextHeading,
        description: vehicleInsightRaw.imageTextDescription,
        image: {
          url: vehicleInsightRaw.imageTextMedia?.node?.mediaItemUrl || "",
          alt: vehicleInsightRaw.imageTextMedia?.node?.altText || "",
        },
        button: vehicleInsightRaw.imageTextCtaButton
          ? {
              label: vehicleInsightRaw.imageTextCtaButton.imageTextButtonText,
              url:
                vehicleInsightRaw.imageTextCtaButton.imageTextButtonUrl?.url ||
                "#",
            }
          : undefined,
      }
    : getSectionData(page, "vehicleInsight") || {};

  const quantifiedImpactData = (page as any)?.caseStudyCarouselSection
    ? {
        csCarouselHeading: (page as any).caseStudyCarouselSection
          .csCarouselHeading,
        csCarouselDescription: (page as any).caseStudyCarouselSection
          .csCarouselDescription,
        csCarouselItems: (page as any).caseStudyCarouselSection.csCarouselItems,
      }
    : getSectionData(page, "quantifiedImpact") || {};

  const ctaBannerRaw = (page as any)?.ctaBannerSection;
  const bgTitleDescriptionData = ctaBannerRaw
    ? {
        title: ctaBannerRaw.ctaBannerHeading?.replaceAll("sapn", "span"),
        description: ctaBannerRaw.ctaBannerDescription,
        backgroundImage: {
          url: ctaBannerRaw.ctaBannerBackgroundImage?.node?.mediaItemUrl || "",
          alt: ctaBannerRaw.ctaBannerBackgroundImage?.node?.altText || "",
          width: 1440,
          height: 443,
        },
        button: ctaBannerRaw.bannerCtaButtons?.[0]
          ? {
              label: ctaBannerRaw.bannerCtaButtons[0].buttonText,
              url: ctaBannerRaw.bannerCtaButtons[0].buttonUrl?.url || "#",
              variant: "primary" as const,
            }
          : undefined,
      }
    : getSectionData(page, "bgTitleDescription") || {};

  const completeYourIntelligenceData = (page as any)?.intelligenceStackSection
    ? {
        stackSectionHeader: (page as any).intelligenceStackSection
          .stackSectionHeader,
        stackSectionDescription: (page as any).intelligenceStackSection
          .stackSectionDescription,
        stackDetails: (page as any).intelligenceStackSection.stackDetails,
        stackCtaButton: (page as any).intelligenceStackSection.stackCtaButton,
      }
    : getSectionData(page, "completeYourIntelligence") || {};

  const faqData = (page as any)?.faqSection
    ? {
        title: (page as any).faqSection.faqSectionHeading,
        items: (page as any).faqSection.faqItems?.map((item: any) => ({
          question: item.question,
          answer: item.answer,
        })),
      }
    : {};

  const contactStripData = (page as any)?.prefooterCtaBannerSection
    ? {
        prefooterCtaBannerHeading: (page as any).prefooterCtaBannerSection
          .prefooterCtaBannerHeading,
        prefooterCtaBannerDescription: (page as any).prefooterCtaBannerSection
          .prefooterCtaBannerDescription,
        prefooterCtaBackgroundImage: (page as any).prefooterCtaBannerSection
          .prefooterCtaBackgroundImage,
        prefooterBannerCtaButtons: (page as any).prefooterCtaBannerSection
          .prefooterBannerCtaButtons,
      }
    : getSectionData(page, "contactStrip") || {};

  const singleMediaDataDynamic = (page as any)?.singleMediaSection
    ? {
        title: (page as any).singleMediaSection.singleMediaSectionHeading || "",
        description:
          (page as any).singleMediaSection.singleMediaSectionDescription || "",
        centerImage:
          (page as any).singleMediaSection.singleMedia?.node?.mediaItemUrl ||
          "",
        buttons:
          (page as any).singleMediaSection.singleMediaCtaButtons?.map(
            (btn: any) => ({
              label: btn.singleMediaButtonText || "",
              url: btn.singleMediaButtonUrl?.url || "#",
            }),
          ) || [],
      }
    : undefined;

  const ultraSecureRaw = (page as any)?.processWithMediaSection;
  const ultraSecureDesignData = ultraSecureRaw
    ? {
      title: ultraSecureRaw.processMediaSectionHeading,
      subtitle: ultraSecureRaw.processMediaSectionDescription,
      columns: 5,
      cells: (() => {
        const allSteps = ultraSecureRaw.processSteps || [];
        const steps = Array(10).fill(null).map((_, i) => allSteps[i] || { processStepType: 'empty' });
        const sequence = [0, 1, 4, 5, 8, 9, 2, 3, 6, 7];

        return sequence.map(idx => {
          const step = steps[idx];
          if (step?.processStepType === 'text_only') {
            return {
              type: "content" as const,
              number: step.processStepNumber as string,
              title: step.processStepTitle as string,
              description: step.processStepDescription as string,
            };
          }
          if (step?.processStepType === 'image_only') {
            return {
              type: "image" as const,
              image: (step.processMedia?.node?.mediaItemUrl as string) || "",
              imageAlt: (step.processStepTitle as string) || "Process step image",
            };
          }
          return { type: 'empty' as const };
        });
      })(),
    }
    : (getSectionData(page, "ultraSecureDesign") || {});

  const staggeredGridRaw = (page as any)?.staggeredGridSection;
  const ultraSecureDesignData2 = staggeredGridRaw
    ? {
        title: staggeredGridRaw.gridSectionHeading?.replaceAll("sapn", "span"),
        subtitle: staggeredGridRaw.gridSectionDescription,
        columns: 4,
        cells: (() => {
          const items = (staggeredGridRaw.gridItems || []).filter(
            (item: any) => !item.gridCellType?.includes("empty"),
          );
          const sequence = [
            { itemIdx: 0, cellType: "content" },
            { cellType: "empty" },
            { itemIdx: 1, cellType: "content" },
            { cellType: "empty" },
            { cellType: "empty" },
            { itemIdx: 2, cellType: "content" },
            { cellType: "empty" },
            { itemIdx: 3, cellType: "content" },
          ];

          return sequence.map((cfg) => {
            if (cfg.cellType === "empty") {
              return { type: "empty" as const };
            } else if (cfg.itemIdx !== undefined && items[cfg.itemIdx]) {
              const item = items[cfg.itemIdx];
              return {
                type: "content" as const,
                iconClass: item.gridIconClass as string,
                icon: item.gridItemIconImage?.node?.mediaItemUrl as string,
                title: item.gridItemTitle as string,
                description: item.gridItemDescription as string,
              };
            } else {
              return { type: "empty" as const };
            }
          });
        })(),
      }
    : getSectionData(page, "ultraSecureDesign2") || {};

  const fleetAgentsData = getSectionData(page, "fleetAgents") || {};

  const navRaw =
    (page as any)?.secondaryNavSection || getSectionData(page, "secondaryNav");
  let navItems: Array<{ label: string; id: string }> = [];

  if (navRaw && Array.isArray(navRaw.navItems) && navRaw.navItems.length > 0) {
    navItems = navRaw.navItems.map((n: any) => ({
      label: n.navLabel || n.label || "",
      id: (n.navAnchor || n.anchor || "").replace("#", ""),
    }));
  }

  return (
    <>
      <SoftwareApplicationPageSchema
        path="tech-stack/software/oxred-lens"
        description={
          (page as { seo?: { metaDesc?: string } })?.seo?.metaDesc ||
          hero?.innerpageHeroDescription
        }
        image={hero?.innerpageHeroImage?.node?.mediaItemUrl}
        faqItems={faqData.items as Array<{ question: string; answer: string }>}
      />
      <InnerPageBanner {...(bannerData as any)}>
        {bannerData.ctaButtons?.length > 0 && (
          <div className={bannerStyles.innerPageBannerCtaGroup}>
            {bannerData.ctaButtons.map((btn: any, index: number) => (
              <Link
                key={index}
                href={btn.url}
                locale={locale}
                className={index === 0 ? "primaryCta" : "secondaryCta"}
              >
                {btn.label}
                <i className={`icon fa-kit fa-right-arrow`}></i>
              </Link>
            ))}
          </div>
        )}
      </InnerPageBanner>
      <StickyNavSection offset={150} items={navItems} />

      <OneDevice {...(textImageData as any)}
        id={navItems[0]?.id || "oneDevice"} />

      {(fleetAgentsData as any).agents?.length > 0 && (
        <FleetAgentsSection
          {...fleetAgentsData}
        // id={navItems[1]?.id || "fleetAgents"}
        />
      )}

      <FleetGapsSection
        {...fleetGapsData}
        id={navItems[1]?.id || "fleetGaps"}
      />

      {(page as any)?.processWithMediaSection?.enableProcessWithMediaSection && (
        <UltraSecureDesignSection
          {...ultraSecureDesignData as any}
          id={navItems[2]?.id || "security"}
          columns={5}
        />
      )}

      {imageCtaData && ((imageCtaData as any).primaryCta?.show || (imageCtaData as any).secondaryCta?.show) && (
        <ImageCtaSection {...(imageCtaData as any)} id="imageCta" />
      )}

      <VehicleInsightSection {...vehicleInsightData} id="vehicleInsight" />

      {singleMediaDataDynamic && (
        <SingleMediaSection
          {...singleMediaDataDynamic}
          id={navItems[2]?.id || "modules"}
        />
      )}

      <UltraSecureDesignSection
        {...ultraSecureDesignData2 as any}

        columns={4}
      />

      {quantifiedImpactData?.csCarouselItems?.nodes?.length > 0 && (
        <QuantifiedImpactSection {...quantifiedImpactData} />
      )}

      <BgTitleDescriptionSection
        {...bgTitleDescriptionData}
        id="bgTitleDescription"
      />

      <CompleteYourIntelligence
        {...completeYourIntelligenceData}
        id={navItems[3]?.id || "completeYourIntelligence"}
        isOxRedLens
      />

      {faqData.title && faqData.items?.length > 0 && (
        <FAQSection
          id={navItems[5]?.id || "faq"}
          title={faqData.title as string}
          items={faqData.items as Array<{ question: string; answer: string }>}
        />
      )}

      <ContactStripSection {...contactStripData} id="contactStrip" />
    </>
  );
}

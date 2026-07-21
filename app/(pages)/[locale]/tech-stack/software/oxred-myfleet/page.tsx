import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import SoftwareApplicationPageSchema from "@/components/seo/SoftwareApplicationPageSchema";
import { getBaseUrl } from "@/lib/env";
import type { CMSPage, CMSSection } from "@/lib/types/cms";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import { getInfrastructureOXREDMyFleetPage } from "@/lib/graphql/queries/getOxredMyFleetPage";
import OneDevice from "@/components/sections/reusable/OneDevice/OneDevice";
import VehicleInsightSection from '@/components/sections/reusable/VehicleInsightSection/VehicleInsightSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import BgTitleDescriptionSection from "@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection";
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import CompleteYourIntelligence from "@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence";
import FAQSection from "@/components/sections/reusable/FAQSection/FAQSection";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import FleetAgentsSection from "@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection";
import FleetGapsSection from "@/components/sections/reusable/FleetGapsSection/FleetGapsSection";

import TwelveModuleSection from "@/components/sections/reusable/TwelveModuleSection/TwelveModuleSection";
import ImageCtaSection from "@/components/sections/reusable/ImageCtaSection/ImageCtaSection";
import SingleMediaSection from "@/components/sections/reusable/SingleMediaSection/SingleMediaSection";

type Props = { params: Promise<{ locale: string }> };

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
  const page = await getInfrastructureOXREDMyFleetPage(
    locale,
    "/infrastructure/oxred-myfleet",
  ).catch((err) => {
    console.error("GRAPHQL FETCH ERROR (Metadata):", err);
    return null;
  });
  
  return buildMetadata(page?.seo || { title: "OxRed" }, locale, { path: 'tech-stack/software/oxred-myfleet' });
}

export const revalidate = 60;

export default async function OxRedPage({ params }: Props) {
  const { locale } = await params;

  const page = await getInfrastructureOXREDMyFleetPage(
    locale,
    "/infrastructure/oxred-myfleet",
  ).catch((err) => {
    console.error("GRAPHQL FETCH ERROR (Page):", err);
    return { isError: true, error: err.message || err.toString() } as any;
  });

  if (page && (page as any).isError) {
    return (
      <div>
          <h1>Error loading data</h1>
        <pre>{(page as any).error}</pre>
      </div>
    );
  }

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
        {
          label: "Tech Stack",
          href: "/tech-stack",
        },
        { label: "Software"},
        { label: page?.title || "OXRED" },
      ],
      ctaButtons:
        hero.innerpageHeroCTAButtons?.map((btn: any) => ({
          label: btn.buttonText,
          url: btn.buttonUrl?.url || "#",
        })) || [],
    }
    : (page ? getSectionData(page, "innerPageBanner") : undefined) || {};
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
    : (page ? getSectionData(page, "textImage") : undefined) || {};
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
    : (page ? getSectionData(page, "fleetGaps") : undefined) || {};

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
          link: imageCtaRaw.processMediaCtaButtons[0].processButtonUrl?.url || "#",
          target: imageCtaRaw.processMediaCtaButtons[0].processButtonUrl?.target || "",
          show: true,
        }
        : { show: false },
      secondaryCta: imageCtaRaw.processMediaCtaButtons?.[1]?.processButtonText
        ? {
          text: imageCtaRaw.processMediaCtaButtons[1].processButtonText,
          link: imageCtaRaw.processMediaCtaButtons[1].processButtonUrl?.url || "#",
          target: imageCtaRaw.processMediaCtaButtons[1].processButtonUrl?.target || "",
          show: true,
        }
        : { show: false },
    }
    : (page ? getSectionData(page, "imageCta") : undefined);

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
          url: vehicleInsightRaw.imageTextCtaButton.imageTextButtonUrl?.url,
        }
        : undefined,
    }
    : (page ? getSectionData(page, "vehicleInsight") : undefined) || {};

  const quantifiedImpactRaw = (page as any)?.caseStudyCarouselSection;
  const quantifiedImpactData = quantifiedImpactRaw
    ? {
      csCarouselHeading: quantifiedImpactRaw.csCarouselHeading,
      csCarouselDescription: quantifiedImpactRaw.csCarouselDescription,
      csCarouselItems: quantifiedImpactRaw.csCarouselItems,
    }
    : (page ? getSectionData(page, "quantifiedImpact") : undefined) || {};
  const ctaBannerRaw = (page as any)?.ctaBannerSection;
  const bgTitleDescriptionData = ctaBannerRaw
    ? {
      title: ctaBannerRaw.ctaBannerHeading?.replaceAll("sapn", "span"),
      description: ctaBannerRaw.ctaBannerDescription,
      backgroundImage: {
        url: ctaBannerRaw.ctaBannerBackgroundImage?.node?.mediaItemUrl || "",
        alt: ctaBannerRaw.ctaBannerBackgroundImage?.node?.altText || "",
        width:
          ctaBannerRaw.ctaBannerBackgroundImage?.node?.mediaDetails?.width ||
          1440,
        height:
          ctaBannerRaw.ctaBannerBackgroundImage?.node?.mediaDetails?.height ||
          443,
      },
      button: ctaBannerRaw.bannerCtaButtons?.[0]
        ? {
          label: ctaBannerRaw.bannerCtaButtons[0].buttonText,
          url: ctaBannerRaw.bannerCtaButtons[0].buttonUrl?.url,
          variant:
            (ctaBannerRaw.bannerCtaButtons[0].buttonStyle?.[0]?.includes(
              "secondary",
            )
              ? "secondary"
              : "primary") as "primary" | "secondary",
        }
        : undefined,
    }
    : (page ? getSectionData(page, "bgTitleDescription") : undefined) || {};
  const testimonialRaw = (page as any)?.testimonialSection;
  const testimonialData = testimonialRaw
    ? {
      title: testimonialRaw.testimonialHeading,
      testimonials:
        testimonialRaw.testimonialsDetails?.nodes?.map((node: any) => ({
          quote: node.testimonialsFields?.testifierDescription || "",
          authorName: node.title || "",
          authorTitle: `${node.testimonialsFields?.testifierDesignation || ""}, ${node.testimonialsFields?.testifierCompanyName || ""}`,
          image: {
            url:
              node.testimonialsFields?.testifierImage?.node?.mediaItemUrl ||
              "",
            alt: node.title || "",
          },
        })) || [],
    }
    : (page ? getSectionData(page, "testimonial") : undefined) || {};
  const relatedInfraRaw = (page as any)?.intelligenceStackSection;
  const completeYourIntelligenceData = relatedInfraRaw
    ? {
      stackSectionHeader: relatedInfraRaw.stackSectionHeader,
      stackSectionDescription: relatedInfraRaw.stackSectionDescription,
      stackDetails: relatedInfraRaw.stackDetails,
      stackCtaButton: relatedInfraRaw.stackCtaButton,
    }
    : (page ? getSectionData(page, "completeYourIntelligence") : undefined) ||
    {};
  const faqRaw = (page as any)?.faqSection;
  const faqData = faqRaw
    ? {
      title: faqRaw.faqSectionHeading,
      items: faqRaw.faqItems?.map((item: any) => ({
        question: item.question,
        answer: item.answer,
      })),
    }
    : {};
  const prefooterRaw = (page as any)?.prefooterCtaBannerSection;
  const contactStripData = prefooterRaw
    ? {
      prefooterCtaBannerHeading: prefooterRaw.prefooterCtaBannerHeading,
      prefooterCtaBannerDescription:
        prefooterRaw.prefooterCtaBannerDescription,
      prefooterCtaBackgroundImage: prefooterRaw.prefooterCtaBackgroundImage,
      prefooterBannerCtaButtons: prefooterRaw.prefooterBannerCtaButtons,
    }
    : (page ? getSectionData(page, "contactStrip") : undefined) || {};

  const productModulesRaw = (page as any)?.productModulesSection;
  const productModulesData = productModulesRaw
    ? {
      title: productModulesRaw.productModulesSectionHeading,
      description: productModulesRaw.productModulesSectionDescription,
    }
    : (page ? getSectionData(page, "productModules") : undefined) || {};

  const singleMediaSectionRaw = (page as any)?.singleMediaSection;
  const singleMediaDataDynamic = singleMediaSectionRaw
    ? {
      title: singleMediaSectionRaw.singleMediaSectionHeading || "",
      description: singleMediaSectionRaw.singleMediaSectionDescription || "",
      centerImage: singleMediaSectionRaw.singleMedia?.node?.mediaItemUrl || "",
      buttons:
        singleMediaSectionRaw.singleMediaCtaButtons?.map((btn: any) => ({
          label: btn.singleMediaButtonText || "",
          url: btn.singleMediaButtonUrl?.url || "#",
        })) || [],
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
        return allSteps.map((step: any) => {
          if (step.processStepType === "text_only") {
            return {
              type: "content",
              number: step.processStepNumber,
              title: step.processStepTitle,
              description: step.processStepDescription,
            };
          }
          if (step.processStepType === "image_only") {
            return {
              type: "image",
              image: step.processMedia?.node?.mediaItemUrl || "",
              imageAlt: step.processStepTitle || "Process step image",
            };
          }
          return { type: "empty" };
        });
      })(),
    }
    : (page ? getSectionData(page, "ultraSecureDesign") : undefined) || {};
  const staggeredGridRaw = (page as any)?.staggeredGridSection;
  const ultraSecureDesignData2 = staggeredGridRaw
    ? {
      title: staggeredGridRaw.gridSectionHeading?.replaceAll("sapn", "span"),
      subtitle: staggeredGridRaw.gridSectionDescription,
      columns: 4,
      cells: (() => {
        const items = staggeredGridRaw.gridItems || [];
        const finalCells: any[] = [];
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

        sequence.forEach((cfg) => {
          if (cfg.cellType === "empty") {
            finalCells.push({ type: "empty" });
          } else if (cfg.itemIdx !== undefined && items[cfg.itemIdx]) {
            const item = items[cfg.itemIdx];
            finalCells.push({
              type: "content",
              iconClass: item.gridIconClass,
              icon: item.gridItemIconImage?.node?.mediaItemUrl,
              title: item.gridItemTitle,
              description: item.gridItemDescription,
            });
          } else {
            finalCells.push({ type: "empty" });
          }
        });

        return finalCells;
      })(),
    }
    : (page ? getSectionData(page, "ultraSecureDesign2") : undefined) || {};

  const fleetAgentsData = (page ? getSectionData(page, "fleetAgents") : undefined) || {};


  const navRaw =
    (page as any)?.secondaryNavSection ||
    (page ? getSectionData(page, "secondaryNav") : undefined);
  const ctaButtons =
    (bannerData.ctaButtons as Array<{ url: string; label: string }>) || [];
  let navItems: Array<{ label: string; id: string }> = [];

  if (navRaw && Array.isArray(navRaw.navItems) && navRaw.navItems.length > 0) {
    navItems = navRaw.navItems.map(
      (n: {
        navLabel?: string;
        navAnchor?: string;
        label?: string;
        anchor?: string;
      }) => ({
        label: n.navLabel || n.label || "",
        id: (n.navAnchor || n.anchor || "").replace("#", ""),
      }),
    );
  }

  const baseUrl = getBaseUrl() || "";
  const productPageUrl = baseUrl ? `${baseUrl}/tech-stack/software/oxred-myfleet` : "";

  return (
    <>
      <SoftwareApplicationPageSchema
        path="tech-stack/software/oxred-myfleet"
        description={
          (page as { seo?: { metaDesc?: string } })?.seo?.metaDesc ||
          (hero?.innerpageHeroDescription as string)
        }
        image={hero?.innerpageHeroImage?.node?.mediaItemUrl}
        faqItems={faqData.items as Array<{ question: string; answer: string }>}
      />
      <InnerPageBanner {...(bannerData as any)} pageUrl={productPageUrl || undefined}>
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
                <i className={`icon fa-kit fa-right-arrow`}></i>
              </Link>
            ))}
          </div>
        )}
      </InnerPageBanner>
      <StickyNavSection offset={150} items={navItems} />
      <OneDevice {...(textImageData as any)} statsWidth="narrow"
        id={navItems[0]?.id || "oneDeviceSection"}
      />
      {(fleetAgentsData as any).agents?.length > 0 && (
        <FleetAgentsSection
          {...fleetAgentsData}
          title={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionHeading || (fleetAgentsData.title as string)}
          subheading={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionDescription || (fleetAgentsData.subheading as string)}
          id={navItems[4]?.id || "fleetAgents"}
        />
      )}
      <FleetGapsSection

        {...fleetGapsData}
        id={navItems[1]?.id || "fleetGaps"}
      />
      {(page as any)?.processWithMediaSection?.enableProcessWithMediaSection && (
        <UltraSecureDesignSection
          {...ultraSecureDesignData}
          id={navItems[2]?.id || "security"}
          columns={5}
        />
      )}
      {imageCtaData && ((imageCtaData as any).primaryCta?.show || (imageCtaData as any).secondaryCta?.show) && (
        <ImageCtaSection {...(imageCtaData as any)} id="imageCta" />
      )}
      <VehicleInsightSection {...vehicleInsightData} id="vehicleInsight" />
      <TwelveModuleSection
        id={navItems[3]?.id || "modules"}
        {...productModulesData}
      />
      {/* {singleMediaDataDynamic && (
        <SingleMediaSection {...singleMediaDataDynamic} id={navItems[2]?.id || "modules"} />
      )} */}
      <UltraSecureDesignSection
        {...ultraSecureDesignData2}
        id={navItems[4]?.id || "securityGrid"}
        columns={4}
      />
      {quantifiedImpactData?.csCarouselItems?.nodes?.length > 0 && (
        <QuantifiedImpactSection
          {...quantifiedImpactData}
          id="quantifiedImpact"
        />
      )}
      <BgTitleDescriptionSection
        {...bgTitleDescriptionData}
        id="bgTitleDescription"
      />
      {/* <TestimonialSection {...testimonialData} id="testimonial" /> */}
      <CompleteYourIntelligence
        {...completeYourIntelligenceData}
        id={navItems[5]?.id || "intelligence"}
      />
      {faqData.title && faqData.items?.length > 0 && (
        <FAQSection
          id={navItems[6]?.id || "faq"}
          title={faqData.title as string}
          items={faqData.items as Array<{ question: string; answer: string }>}
        />
      )}
      <ContactStripSection {...contactStripData} id="contactStrip" />
    </>
  );
}

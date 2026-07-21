import type { Metadata } from 'next';
import { buildMetadata } from "@/lib/utils/metadata";
import type { CMSPage, CMSSection } from '@/lib/types/cms';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import bannerStyles from '@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css';
import styles from './guardianai.module.css';
import { getInfrastructureOXREDGuardianAIPage } from '@/lib/graphql/queries/getOxredGuardianAiPage';
import Link from "@/components/ui/Link/Link";
import InstallItus from "@/components/sections/Pages/ITUSMaxPage/InstallItus/InstallItus";

import VehicleInsightSection from '@/components/sections/reusable/VehicleInsightSection/VehicleInsightSection';
import FleetAgentsSection from '@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection';
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import BgTitleDescriptionSection from "@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection";
import CompleteYourIntelligence from "@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence";
import SoftwareApplicationPageSchema from "@/components/seo/SoftwareApplicationPageSchema";
import FAQSection from "@/components/sections/reusable/FAQSection/FAQSection";
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import ProtectedByDesignSection from '@/components/sections/reusable/ProtectedByDesignSection/ProtectedByDesignSection';
import OutcomesSection from '@/components/sections/Pages/Home/OutcomesSection/OutcomesSection';

type Props = { params: Promise<{ locale: string }> };

function getSectionData(page: CMSPage | null, type: string): Record<string, unknown> | undefined {
  if (!page) return undefined;
  const section = page.sections?.find((s: CMSSection) => s.type === type);
  return section?.data as Record<string, unknown> | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = (await getInfrastructureOXREDGuardianAIPage(locale, '/guardian-ai').catch(() => null));

  return buildMetadata(page?.seo || { title: 'GuardianAI' }, locale, { path: 'tech-stack/ai-solution/guardian-ai' });
}

export const revalidate = 60;

export default async function GuardianAIPage({ params }: Props) {
  const { locale } = await params;

  const page = (await getInfrastructureOXREDGuardianAIPage(locale, '/guardian-ai').catch(() => null));

  const bannerRaw = (page as any)?.innerPageHeroSection;
  const bannerData: any = bannerRaw ? {
    title: (bannerRaw.innerpageHeroHeading || '').replaceAll('sapn', 'span'),
    description: (bannerRaw.innerpageHeroDescription || '').replaceAll('sapn', 'span'),
    backgroundImage: {
      url: bannerRaw.innerpageHeroImage?.node?.mediaItemUrl || '',
      alt: bannerRaw.innerpageHeroHeading || '',
      width: bannerRaw.innerpageHeroImage?.node?.mediaDetails?.width || 1920,
      height: bannerRaw.innerpageHeroImage?.node?.mediaDetails?.height || 1080
    },
    ctaButtons: bannerRaw.innerpageHeroCTAButtons?.map((btn: any) => ({
      label: btn.buttonText,
      url: btn.buttonUrl?.url || '#'
    })) || [],
    mobileImage: bannerRaw.innerpageHeroMobileImage?.node?.mediaItemUrl ? {
      url: bannerRaw.innerpageHeroMobileImage.node.mediaItemUrl,
      alt: bannerRaw.innerpageHeroHeading || '',
      width: bannerRaw.innerpageHeroMobileImage.node.mediaDetails?.width || 768,
      height: bannerRaw.innerpageHeroMobileImage.node.mediaDetails?.height || 1024
    } : undefined,
    breadcrumbItems: [
      { label: 'Home', href: '/' },
      { label: 'Tech Stack', href: '/tech-stack' },
      { label: 'AI Solution' },
      { label: 'GuardianAI' }
    ]
  } : (page ? getSectionData(page, 'innerPageBanner') : undefined) || {};
  const vehicleInsightRaw = (page as any)?.imagePlusTextSection;
  const vehicleInsightData: any = vehicleInsightRaw ? {
    title: (vehicleInsightRaw.imageTextHeading || '').replaceAll('sapn', 'span'),
    description: (vehicleInsightRaw.imageTextDescription || '').replaceAll('sapn', 'span'),
    image: {
      url: vehicleInsightRaw.imageTextMedia?.node?.mediaItemUrl || '',
      alt: vehicleInsightRaw.imageTextMedia?.node?.altText || ''
    },
    button: vehicleInsightRaw.imageTextCtaButton?.imageTextButtonText ? {
      label: vehicleInsightRaw.imageTextCtaButton.imageTextButtonText,
      url: vehicleInsightRaw.imageTextCtaButton.imageTextButtonUrl?.url || '#'
    } : undefined
  } : (page ? getSectionData(page, 'vehicleInsight') : undefined) || {};
  const fleetAgentsRaw = (page as any)?.featureTabsSection;
  const fleetAgentsData: any = fleetAgentsRaw ? {
    title: (fleetAgentsRaw.featureTabsSectionHeading || '').replaceAll('sapn', 'span'),
    subheading: (fleetAgentsRaw.featureTabsSectionDescription || '').replaceAll('sapn', 'span'),
    agents: fleetAgentsRaw.tabs?.map((t: any) => ({
      id: t.tabLabel.toLowerCase().replace(/\s+/g, '-'),
      label: t.tabLabel,
      tabDescription: t.tabIntro,
      description: t.tabDescription,
      imageUrl: t.tabImage?.node?.mediaItemUrl
    })) || []
  } : (page ? getSectionData(page, 'fleetAgents') : undefined) || {};

  const centeredCtaRaw = (page as any)?.centeredCtaBanner;
  const contactStripData1 = centeredCtaRaw ? {
    title: (centeredCtaRaw.centeredBannerHeading || '').replaceAll('sapn', 'span'),
    description: (centeredCtaRaw.centeredBannerDescription || '').replaceAll('sapn', 'span'),
    backgroundImageUrl: centeredCtaRaw.centeredBackgroundImage?.node?.mediaItemUrl,
    ctas: [
      {
        text: centeredCtaRaw.centeredCtaButton?.centeredButtonText,
        url: centeredCtaRaw.centeredCtaButton?.centeredButtonLink?.url
      }
    ]
  } : (page?.sections?.filter((s: CMSSection) => s.type === 'contactStrip')?.[0]?.data || {});

  const prefooterRaw = (page as any)?.prefooterCtaBannerSection;
  const contactStripData2 = prefooterRaw ? {
    title: (prefooterRaw.prefooterCtaBannerHeading || '').replaceAll('sapn', 'span'),
    description: (prefooterRaw.prefooterCtaBannerDescription || '').replaceAll('sapn', 'span'),
    backgroundImageUrl: prefooterRaw.prefooterCtaBackgroundImage?.node?.mediaItemUrl,
    ctas: prefooterRaw.prefooterBannerCtaButtons?.map((btn: any) => ({
      text: btn.buttonText,
      url: btn.buttonUrl?.url || '#'
    }))
  } : (page?.sections?.filter((s: CMSSection) => s.type === 'contactStrip')?.[1]?.data || {});

  const staggeredGridRaw1 = (page as any)?.staggeredGridSection;
  const ultraSecureDesignData: any = staggeredGridRaw1 ? {
    title: (staggeredGridRaw1.gridSectionHeading || '').replaceAll('sapn', 'span'),
    subtitle: (staggeredGridRaw1.gridSectionDescription || '').replaceAll('sapn', 'span'),
    columns: 3,
    cells: staggeredGridRaw1.gridItems?.map((item: any, index: number) => ({
      type: (index % 2 !== 0) ? 'borderless-content' : 'content',
      iconClass: item.gridIconClass,
      icon: item.gridItemIconImage?.node?.mediaItemUrl,
      title: item.gridItemTitle,
      description: item.gridItemDescription,
      imageAlt: item.gridItemIconImage?.node?.altText
    })) || []
  } : (page ? getSectionData(page, 'ultraSecureDesign') : undefined) || {};

  const hardwareSpecRaw = (page as any)?.hardwareSpecSection;
  const protectedByDesignData: any = hardwareSpecRaw ? {
    title: (hardwareSpecRaw.hardwareSpecSectionHeading || '').replaceAll('sapn', 'span'),
    subheading: (hardwareSpecRaw.hardwareSpecSectionDescription || '').replaceAll('sapn', 'span'),
    centerImageUrl: hardwareSpecRaw.centerImage?.node?.mediaItemUrl,
    specLeftItems: hardwareSpecRaw.specLeftItems,
    specRightItems: hardwareSpecRaw.specRightItems,
    ctaText: hardwareSpecRaw.specCtaButton?.specButtonText,
    ctaHref: hardwareSpecRaw.specCtaButton?.specButtonUrl?.url
  } : (page ? getSectionData(page, 'protectedByDesign') : undefined) || {};
  const stepsRaw = (page as any)?.stepsWithMediaSection;
  const installItusData: any = stepsRaw ? {
    title: (stepsRaw.stepsMediaSectionHeading || '').replaceAll('sapn', 'span'),
    description: (stepsRaw.stepsMediaSectionDescription || '').replaceAll('sapn', 'span'),
    image: stepsRaw.centeredMedia?.node?.mediaItemUrl || '',
    alt: stepsRaw.centeredMedia?.node?.altText || '',
    cardData: stepsRaw.steps?.map((s: any) => ({
      number: s.stepNumber || '',
      title: s.stepTitle || '',
      description: s.stepDescription || ''
    })) || [],
    cta: stepsRaw.stepMediaCtaButton?.stepMediaButtonText ? {
      label: stepsRaw.stepMediaCtaButton.stepMediaButtonText,
      url: stepsRaw.stepMediaCtaButton.stepMediaButtonUrl?.url || '#'
    } : undefined
  } : (page ? getSectionData(page, 'headingImage') : undefined) || {};
  const outcomesRaw = (page as any)?.performanceMetricsSection;
  const outcomesData = outcomesRaw ? {
    title: outcomesRaw.metricsHeading || '',
    description: outcomesRaw.metricsDescription || '',
    outcomes: outcomesRaw.metricsItems?.map((m: any) => ({
      percentage: m.metricValue || '',
      title: m.metricTitle || '',
      description: m.metricDescription || ''
    })) || []
  } : (page ? getSectionData(page, 'outcomes') : undefined) || {};

  const quantifiedImpactRaw = (page as any)?.caseStudyCarouselSection;
  const quantifiedImpactData: any = quantifiedImpactRaw || (page ? getSectionData(page, 'quantifiedImpact') : undefined);

  const ctaBannerRaw = (page as any)?.ctaBannerSection;
  const bgTitleDescriptionData: any = ctaBannerRaw ? {
    title: ctaBannerRaw.ctaBannerHeading,
    description: ctaBannerRaw.ctaBannerDescription,
    backgroundImage: {
      url: ctaBannerRaw.ctaBannerBackgroundImage?.node?.mediaItemUrl,
      alt: (ctaBannerRaw.ctaBannerBackgroundImage?.node?.altText || ctaBannerRaw.ctaBannerHeading || ''),
      width: ctaBannerRaw.ctaBannerBackgroundImage?.node?.mediaDetails?.width || 1920,
      height: ctaBannerRaw.ctaBannerBackgroundImage?.node?.mediaDetails?.height || 1080
    },
    button: ctaBannerRaw.bannerCtaButtons?.[0] ? {
      label: ctaBannerRaw.bannerCtaButtons[0].buttonText,
      url: ctaBannerRaw.bannerCtaButtons[0].buttonUrl?.url || '#',
      variant: ctaBannerRaw.bannerCtaButtons[0].buttonStyle === 'primary' ? 'primary' : 'secondary'
    } : undefined
  } : (page ? getSectionData(page, 'bgTitleDescription') : undefined) || {};

  const relatedRaw = (page as any)?.intelligenceStackSection;
  const completeYourIntelligenceData: any = relatedRaw ? {
    stackSectionHeader: relatedRaw.stackSectionHeader,
    stackSectionDescription: relatedRaw.stackSectionDescription,
    stackDetails: relatedRaw.stackDetails,
    stackCtaButton: relatedRaw.stackCtaButton
  } : (page ? getSectionData(page, 'completeYourIntelligence') : undefined) || {};

  const faqRaw = (page as any)?.faqSection;
  const faqData: any = faqRaw ? {
    title: faqRaw.faqSectionHeading,
    items: faqRaw.faqItems?.map((item: any) => ({
      question: item.question,
      answer: item.answer
    })) || []
  } : {};

  const navRaw = (page as any)?.secondaryNavSection;
  const navData = navRaw || (page ? getSectionData(page, 'secondaryNav') : undefined);

  const ctaButtons = (bannerData.ctaButtons as Array<{ url: string; label: string }>) || [];

  let navItems: Array<{ label: string; id: string }> = [];

  if (navData && Array.isArray(navData.navItems) && navData.navItems.length > 0) {
    navItems = navData.navItems.map((n: { navLabel?: string; navAnchor?: string; label?: string; anchor?: string }) => ({
      label: n.navLabel || n.label || '',
      id: (n.navAnchor || n.anchor || '').replace('#', '')
    }));
  }



  return (
    <>
      <SoftwareApplicationPageSchema
        path="tech-stack/ai-solution/guardian-ai"
        description={
          (page as { seo?: { metaDesc?: string } })?.seo?.metaDesc ||
          bannerRaw?.innerpageHeroDescription
        }
        image={bannerRaw?.innerpageHeroImage?.node?.mediaItemUrl}
        faqItems={faqData.items as Array<{ question: string; answer: string }>}
      />
      <InnerPageBanner {...(bannerData as any)}>
        {ctaButtons.length > 0 && (
          <div className={bannerStyles.innerPageBannerCtaGroup}>
            {ctaButtons.map((btn, index: number) => (
              <Link key={index} href={btn.url} locale={locale} className={index === 1 ? 'secondaryCta' : 'primaryCta'}>
                {btn.label}
                <i
                  className={`icon fa-kit fa-right-arrow`}
                ></i>
              </Link>
            ))}
          </div>
        )}
      </InnerPageBanner>
      <StickyNavSection
        offset={150}
        items={navItems}
      />
      <VehicleInsightSection {...(vehicleInsightData as any)} id={navItems[0]?.id || "VehicleInsight"} hideBgGradient={true} />
      <FleetAgentsSection {...(fleetAgentsData as any)} id={navItems[1]?.id || "ouragents"} />
      <ContactStripSection {...(contactStripData1 as any)} id={navItems[2]?.id || "needacustomagent"} />
      <UltraSecureDesignSection {...(ultraSecureDesignData as any)} id="security" columns={3} className={styles.ultraSecureDesignData} />
      <ProtectedByDesignSection {...(protectedByDesignData as any)} />
      <InstallItus
        id={navItems[3]?.id || "howitworks"}
        title={installItusData.title}
        steps={installItusData.cardData || installItusData.steps}
        image={installItusData.image ? (typeof installItusData.image === 'string' ? { url: installItusData.image, alt: installItusData.alt } : installItusData.image) : undefined}
        ctaButtons={installItusData.cta ? [{ label: installItusData.cta.label, url: installItusData.cta.url, variant: 'primary' }] : (installItusData.ctaButtons || [])}
      />
      <OutcomesSection {...(outcomesData as any)} />
      <QuantifiedImpactSection {...(quantifiedImpactData as any)} id="impact" />
      <BgTitleDescriptionSection {...(bgTitleDescriptionData as any)} id={navItems[6]?.id || "bgTitleDescription"} />
      <CompleteYourIntelligence {...(completeYourIntelligenceData as any)} id={navItems[4]?.id || "completeyourintelligence"} isOxRedLens />
      <FAQSection
        id={navItems[5]?.id || "faqs"}
        title={(faqData.title as string) || "<span>Frequently</span> asked questions"}
        items={(faqData.items as Array<{ question: string; answer: string }>) || []}
      />
      <ContactStripSection {...(contactStripData2 as any)} />

    </>
  );
}
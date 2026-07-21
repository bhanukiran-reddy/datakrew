import type { Metadata } from 'next';
import { buildMetadata } from "@/lib/utils/metadata";
import type { CMSPage, CMSSection } from '@/lib/types/cms';
import { getSupportedLocalesSync } from '@/lib/config/locales';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from '@/components/ui/Link/Link';
import bannerStyles from '@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css';
import ProductPageSchema from "@/components/seo/ProductPageSchema";
import styles from './itus-autoscan.module.css';
import FleetAgentsSection from '@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection';
import InstallItus from '@/components/sections/Pages/ITUSMaxPage/InstallItus/InstallItus';
import CompleteYourIntelligence from '@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence';
import Compatibility from '@/components/sections/Pages/ITUSMaxPage/Compatibility/Compatibility';
import FAQSection from '@/components/sections/reusable/FAQSection/FAQSection';
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import OneDevice from '@/components/sections/reusable/OneDevice/OneDevice';
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import ProtectedByDesignSection from '@/components/sections/reusable/ProtectedByDesignSection/ProtectedByDesignSection';
import UltraSecureDesignSection from '@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection';
import { getInfrastructureITUSAutoscanPage } from '@/lib/graphql/queries/getItusAutoscanPage';
import BgTitleDescriptionSection from '@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection';
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import WebGLOrganicFlow from '@/components/sections/reusable/WebGLOrganicFlow/WebGLOrganicFlow';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
    return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

/** Get one section's data from CMS page by type (for passing as props). */
function getSectionData(page: CMSPage | null, type: string): Record<string, unknown> | undefined {
    if (!page) return undefined;
    const section = page.sections?.find((s: CMSSection) => s.type === type);
    return section?.data as Record<string, unknown> | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const page = await getInfrastructureITUSAutoscanPage(locale, '/infrastructure/itus-autoscan').catch(() => null);
    
    return buildMetadata(page?.seo || { title: 'ITUSMax' }, locale, { path: 'tech-stack/hardware/itus-autoscan' });
}

export const revalidate = 60;

export default async function ItusMaxPage({ params }: Props) {
    const { locale } = await params;

    const page = await getInfrastructureITUSAutoscanPage(locale, '/infrastructure/itus-autoscan').catch(() => null);

    const bannerData = (page ? getSectionData(page, 'innerPageBanner') : undefined) || {};
    const fleetAgentsData = (page ? getSectionData(page, 'fleetAgents') : undefined) || {};
    const faqRaw = (page ? getSectionData(page, 'faq') : undefined) as any || {};
    const faqData = {
        title: faqRaw.faqSectionHeading || faqRaw.title || '',
        items: Array.isArray(faqRaw.faqItems)
            ? faqRaw.faqItems.map((i: any) => ({ question: i.question || i.title, answer: i.answer || i.content }))
            : [],
        ...faqRaw
    };
    const contactStripData = ((page as any)?.infrastructure?.prefooterCtaBannerSection) || (page ? getSectionData(page, 'contactStrip') : undefined) || {};
    const textImageData = (page ? getSectionData(page, 'textImage') : undefined) || {};
    const installItusData = (page ? getSectionData(page, 'installItus') : undefined) || {};
    const completeYourIntelligenceData = ((page as any)?.infrastructure?.intelligenceStackSection) || (page ? getSectionData(page, 'completeYourIntelligence') : undefined) || {};
    const protectedByDesignData = (page ? getSectionData(page, 'protectedByDesign') : undefined) || {};
    const ultraSecureDesignData = (page ? getSectionData(page, 'ultraSecureDesign') : undefined) || {};
    const partnersData = (page ? getSectionData(page, 'partners') : undefined) || {};
    const bgTitleDescriptionData = (page ? getSectionData(page, 'bgTitleDescription') : undefined) || {};
    const testimonialData = (page ? getSectionData(page, 'testimonial') : undefined) || {};
    const quantifiedImpactData = ((page as any)?.infrastructure?.caseStudyCarouselSection) || (page as any)?.caseStudyCarouselSection || (page ? getSectionData(page, 'quantifiedImpact') : undefined) || {};
    const navData = page ? getSectionData(page, 'secondaryNav') : undefined;

    const ctaButtons = (bannerData.ctaButtons as Array<{ url: string; label: string }>) || [];

    let navItems: Array<{ label: string; id: string }> = [];
    const rawNavItems = navData?.navItems || (page as any)?.infrastructure?.secondaryNavSection?.navItems;
    if (Array.isArray(rawNavItems) && rawNavItems.length > 0) {
        navItems = rawNavItems.map((n: { label?: string; navLabel?: string; anchor?: string; navAnchor?: string }) => ({
            label: n.label || n.navLabel || '',
            id: (n.anchor || n.navAnchor || '').replace('#', '')
        }));
    }

    return (
        <>
            <ProductPageSchema
                path="tech-stack/hardware/itus-autoscan"
                description={
                    (page as { seo?: { metaDesc?: string } })?.seo?.metaDesc ||
                    (bannerData.description as string) ||
                    (page as any)?.infrastructure?.innerPageHeroSection?.innerpageHeroDescription
                }
                image={
                    (bannerData.backgroundImage as { url?: string } | undefined)?.url ||
                    (page as any)?.infrastructure?.innerPageHeroSection?.innerpageHeroImage?.node?.mediaItemUrl
                }
                faqItems={faqData.items as Array<{ question: string; answer: string }>}
            />
            <InnerPageBanner
                title={(bannerData.title as string) || (page as any)?.infrastructure?.innerPageHeroSection?.innerpageHeroHeading || ''}
                description={(bannerData.description as string) || (page as any)?.infrastructure?.innerPageHeroSection?.innerpageHeroDescription || ''}
                titleHighlight={bannerData.titleHighlight as string}
                breadcrumbItems={bannerData.breadcrumbItems as Array<{ label: string; href?: string }>}
                backgroundImage={((bannerData.backgroundImage as any)?.url ? bannerData.backgroundImage : { url: (page as any)?.infrastructure?.innerPageHeroSection?.innerpageHeroImage?.node?.mediaItemUrl }) as { url: string; alt: string; width: number; height: number }}
                mobileImage={((bannerData.mobileImage as any)?.url ? bannerData.mobileImage : { url: (page as any)?.infrastructure?.innerPageHeroSection?.innerpageHeroMobileImage?.node?.mediaItemUrl }) as { url: string; alt: string; width: number; height: number }}
                className={styles.itusmaxBanner}
                backgroundColor='#111216'
            >
                {ctaButtons.length > 0 && (
                    <div className={bannerStyles.innerPageBannerCtaGroup}>
                        {ctaButtons.map((btn, index: number) => (
                            <Link key={index} href={btn.url} className={index === 1 ? 'secondaryCta' : 'primaryCta'}>
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
            <OneDevice
                title={(textImageData.sectionHeading as string) || (page as any)?.infrastructure?.textImageStatsSection?.textImageStatsHeading || ''}
                description={(textImageData.sectionDescription as string) || (page as any)?.infrastructure?.textImageStatsSection?.textImageStatsDescription || ''}
                image={((textImageData.image as any)?.url ? textImageData.image : { url: (page as any)?.infrastructure?.textImageStatsSection?.textImageStatsMedia?.node?.mediaItemUrl }) as { url: string, alt?: string }}
                stats={(textImageData.stats as any) || (page as any)?.infrastructure?.textImageStatsSection?.stats}
                className={styles.oneDeviceSection}
                id={navItems[0]?.id || "oneDeviceSection"}
            />
            <FleetAgentsSection
                {...fleetAgentsData}
                title={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionHeading || (fleetAgentsData.title as string)}
                subheading={(page as any)?.infrastructure?.featureTabsSection?.featureTabsSectionDescription || (fleetAgentsData.subheading as string)}
                agents={(fleetAgentsData.agents as any) || (page as any)?.infrastructure?.featureTabsSection?.tabs?.map((t: any) => ({
                    id: t.tabLabel.toLowerCase().replace(/\s+/g, '-'),
                    label: t.tabLabel,
                    tabDescription: t.tabIntro,
                    description: t.tabDescription,
                    imageUrl: t.tabImage?.node?.mediaItemUrl
                }))}
                id={navItems[1]?.id || "fleetAgents"}

            />
            <InstallItus
                {...installItusData}
                title={(installItusData.title as string) || (page as any)?.infrastructure?.stepsWithMediaSection?.stepsMediaSectionHeading}
                image={undefined}
                steps={(installItusData.steps as any) || (page as any)?.infrastructure?.stepsWithMediaSection?.steps?.map((s: any) => ({
                    number: s.stepNumber,
                    title: s.stepTitle,
                    description: s.stepDescription
                }))}
                ctaButtons={[]}
                id={navItems[2]?.id || "installItus"}
            />
            <ProtectedByDesignSection
                {...protectedByDesignData}
                title={(protectedByDesignData.title as string) || (page as any)?.infrastructure?.hardwareSpecSection?.hardwareSpecSectionHeading}
                subheading={(protectedByDesignData.subheading as string) || (page as any)?.infrastructure?.hardwareSpecSection?.hardwareSpecSectionDescription}
                centerImageUrl={(protectedByDesignData.centerImageUrl as string) || (page as any)?.infrastructure?.hardwareSpecSection?.centerImage?.node?.mediaItemUrl}
                specLeftItems={(protectedByDesignData.specLeftItems as any) || (page as any)?.infrastructure?.hardwareSpecSection?.specLeftItems}
                specRightItems={(protectedByDesignData.specRightItems as any) || (page as any)?.infrastructure?.hardwareSpecSection?.specRightItems}
                ctaText={(protectedByDesignData.ctaText as string) || (page as any)?.infrastructure?.hardwareSpecSection?.specCtaButton?.specButtonText}
                ctaHref={(protectedByDesignData.ctaHref as string) || (page as any)?.infrastructure?.hardwareSpecSection?.specCtaButton?.specButtonUrl?.url || '#'}
                id={navItems[3]?.id || "protectedByDesign"}
            />

            <BgTitleDescriptionSection
                {...bgTitleDescriptionData}
                title={(bgTitleDescriptionData.title as string) || (page as any)?.infrastructure?.ctaBannerSection?.ctaBannerHeading}
                description={(bgTitleDescriptionData.description as string) || (page as any)?.infrastructure?.ctaBannerSection?.ctaBannerDescription}
                backgroundImage={(bgTitleDescriptionData.backgroundImage as any) || ((page as any)?.infrastructure?.ctaBannerSection?.ctaBannerBackgroundImage?.node?.mediaItemUrl ? {
                    url: (page as any)?.infrastructure?.ctaBannerSection?.ctaBannerBackgroundImage?.node?.mediaItemUrl,
                    width: 1920,
                    height: 443,
                    alt: (page as any)?.infrastructure?.ctaBannerSection?.ctaBannerBackgroundImage?.node?.altText || ''
                } : undefined)}
                button={(bgTitleDescriptionData.button as any) || ((page as any)?.infrastructure?.ctaBannerSection?.bannerCtaButtons?.[0]?.buttonText ? {
                    label: (page as any)?.infrastructure?.ctaBannerSection?.bannerCtaButtons?.[0]?.buttonText,
                    url: (page as any)?.infrastructure?.ctaBannerSection?.bannerCtaButtons?.[0]?.buttonUrl?.url || '#'
                } : undefined)}
                id={navItems[3]?.id || "roi"}

            />
            {/* <TestimonialSection
                {...testimonialData}
                title={(testimonialData.title as string) || (page as any)?.infrastructure?.testimonialSection?.testimonialHeading}
                testimonials={(testimonialData.testimonials as any) || (page as any)?.infrastructure?.testimonialSection?.testimonialsDetails?.nodes?.map((n: any) => ({
                    quote: n.testimonialsFields?.testifierDescription,
                    authorName: n.title,
                    authorTitle: `${n.testimonialsFields?.testifierDesignation || ""}, ${n.testimonialsFields?.testifierCompanyName || ""}`,
                    image: {
                        url: n.testimonialsFields?.testifierImage?.node?.mediaItemUrl,
                        width: 100,
                        height: 100,
                        alt: n.title
                    }
                }))}
                id="testimonial"
            /> */}
            <QuantifiedImpactSection
                {...quantifiedImpactData}
                title={(quantifiedImpactData.title as string) || (page as any)?.infrastructure?.caseStudyCarouselSection?.csCarouselHeading}
                description={(quantifiedImpactData.description as string) || (page as any)?.infrastructure?.caseStudyCarouselSection?.csCarouselDescription}
                items={(quantifiedImpactData.items as any) || (page as any)?.infrastructure?.caseStudyCarouselSection?.csCarouselItems?.nodes?.map((n: any) => ({
                    id: n.id,
                    clientName: n.caseStudyCardFields?.csClientName,
                    clientTitle: n.caseStudyCardFields?.csClientTitle,
                    description: n.caseStudyCardFields?.csDescription,
                    ctaText: n.caseStudyCardFields?.csCtaText,
                    featuredImage: n.featuredImage?.node?.mediaItemUrl,
                    clientPhoto: n.caseStudyCardFields?.csClientPhoto?.node?.mediaItemUrl,
                    metrics: n.caseStudyCardFields?.csKeyMetrics?.map((m: any) => ({
                        label: m.csMetricLabel,
                        value: m.csMetricValue
                    }))
                }))}
                id="quantifiedImpact"
            />
            <CompleteYourIntelligence
                {...completeYourIntelligenceData}
                stackSectionHeader={(completeYourIntelligenceData.stackSectionHeader as string) || (page as any)?.infrastructure?.intelligenceStackSection?.stackSectionHeader}
                stackSectionDescription={(completeYourIntelligenceData.stackSectionDescription as string) || (page as any)?.infrastructure?.intelligenceStackSection?.stackSectionDescription}
                stackDetails={(completeYourIntelligenceData.stackDetails as any) || (page as any)?.infrastructure?.intelligenceStackSection?.stackDetails}
                // id="completeYourIntelligence"
                id={navItems[4]?.id || "completeYourIntelligence"}
                isItusMaxAutoscan
            />
            <FAQSection
                id={navItems[5]?.id || "faqs"}
                title={faqData.title as string}
                items={faqData.items as Array<{ question: string; answer: string }>}
            />
            <ContactStripSection
                {...contactStripData}
                title={(contactStripData.prefooterCtaBannerHeading as string) || (page as any)?.infrastructure?.prefooterCtaBannerSection?.prefooterCtaBannerHeading}
                description={(contactStripData.prefooterCtaBannerDescription as string) || (page as any)?.infrastructure?.prefooterCtaBannerSection?.prefooterCtaBannerDescription}
                backgroundImage={(contactStripData.prefooterCtaBackgroundImage as any) || (page as any)?.infrastructure?.prefooterCtaBannerSection?.prefooterCtaBackgroundImage?.node?.mediaItemUrl}
                ctaButtons={(contactStripData.prefooterBannerCtaButtons as any) || (page as any)?.infrastructure?.prefooterCtaBannerSection?.prefooterBannerCtaButtons?.map((btn: any) => ({
                    label: btn.buttonText,
                    url: btn.buttonUrl?.url || '#'
                }))}
                id="contactStrip"
            />

        </>
    );
}
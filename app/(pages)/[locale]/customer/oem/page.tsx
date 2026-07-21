import type { Metadata } from 'next';
import type { CMSPage, CMSSection } from '@/lib/types/cms';
import { getSupportedLocalesSync } from '@/lib/config/locales';
import { buildMetadata } from '@/lib/utils/metadata';
import InnerPageBanner from '@/components/sections/reusable/InnerPageBanner/InnerPageBanner';
import Link from '@/components/ui/Link/Link';
import bannerStyles from '@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css';
import styles from './oem.module.css';
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import { getByCustomerOEMPage } from '@/lib/graphql/queries/getByCustomerOEMPage';
import OneDevice from '@/components/sections/reusable/OneDevice/OneDevice';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import TestimonialSection from '@/components/sections/reusable/TestimonialSection/TestimonialSection';
import FAQSection from '@/components/sections/reusable/FAQSection/FAQSection';
import ServicePageSchema from '@/components/seo/ServicePageSchema';
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import UltraSecureDesignSection from '@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection';
import FleetGapsSection from '@/components/sections/reusable/FleetGapsSection/FleetGapsSection';
import ImageCtaSection from '@/components/sections/reusable/ImageCtaSection/ImageCtaSection';
import PartnersSection from '@/components/sections/reusable/PartnersSection/PartnersSection';
import CompleteYourIntelligence from '@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence';
import FleetAgentsSection from '@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection';
import StackFitSection from '@/components/sections/reusable/StackFitSection/StackFitSection';

import EngagementModelSection from '@/components/sections/Pages/ByOEMPage/EngagementModelSection/EngagementModelSection';

type Props = { params: Promise<{ locale: string }> };

/** Get one section's data from CMS page by type (for passing as props). */
function getSectionData(page: CMSPage | null, type: string): Record<string, unknown> | undefined {
    if (!page) return undefined;
    const section = page.sections?.find((s: CMSSection) => s.type === type);
    return section?.data as Record<string, unknown> | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const page = await getByCustomerOEMPage(locale, 'customer/oem/').catch(() => null) as any | null;
    return buildMetadata(page?.seo || { title: 'By OEM' }, locale, { path: 'customer/oem' });
}

export const revalidate = 60;

export default async function ByOEMPage({ params }: Props) {
    const { locale } = await params;

    const page = (await getByCustomerOEMPage(locale, 'customer/oem/').catch(() => null));

    const bannerData = (page ? getSectionData(page, 'innerPageBanner') : undefined) || {};
    const textImageData = (page ? getSectionData(page, 'textImage') : undefined) || {};
    const fleetGapsData = (page ? getSectionData(page, 'fleetGaps') : undefined) || {};
    const imageCtaData = (page ? getSectionData(page, 'imageCta') : undefined) || {};
    const quantifiedImpactData = (page ? getSectionData(page, 'quantifiedImpact') : undefined) || {};
    const bgTitleDescriptionData = (page ? getSectionData(page, 'bgTitleDescription') : undefined) || {};
    const testimonialData = (page ? getSectionData(page, 'testimonial') : undefined) || {};
    const completeYourIntelligenceData = (page ? getSectionData(page, 'completeYourIntelligence') : undefined) || {};
    const partnersData = (page ? getSectionData(page, 'partners') : undefined) || {};
    const stackFitData = (page ? getSectionData(page, 'stackFitData') : undefined) || {};
    const fleetAgentsData = (page ? getSectionData(page, 'fleetAgents') : undefined) || {};
    const engagementModelData = (page ? getSectionData(page, 'engagementModel') : undefined) || {};
    const faqData = (page ? getSectionData(page, 'faq') : undefined) || {};
    const contactStripData = (page ? getSectionData(page, 'contactStrip') : undefined) || {};
    const productModulesData = (page ? getSectionData(page, 'productModules') : undefined) || {};
    const ultraSecureDesignData = (page ? getSectionData(page, 'ultraSecureDesign') : undefined) || {};
    const ultraSecureDesignData2 = (page ? getSectionData(page, 'ultraSecureDesign2') : undefined) || {};

    const navRaw = (page ? getSectionData(page, 'secondaryNav') : undefined) as any;
    const ctaButtons = (bannerData.ctaButtons as Array<{ url: string; label: string }>) || [];
    let navItems: Array<{ label: string; id: string }> = [];

    if (navRaw && Array.isArray(navRaw.navItems) && navRaw.navItems.length > 0) {
        navItems = navRaw.navItems.map((n: any) => ({
            label: n.navLabel || n.label || '',
            id: (n.navAnchor || n.anchor || '').replace('#', '')
        }));
    }

    return (
        <>
            <ServicePageSchema
                path="customer/oem"
                name={page?.title as string}
                description={
                    (page as { seo?: { description?: string } })?.seo?.description ||
                    (bannerData.description as string)
                }
                faqItems={(faqData.items as Array<{ question: string; answer: string }>) || []}
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
                        {ctaButtons.map((btn: any, index: number) => (
                            <Link
                                key={index}
                                href={btn.url}
                                locale={locale}
                                className={index === 1 ? 'secondaryCta' : 'primaryCta'}
                            >
                                {btn.label}
                                <i
                                    className={`icon fa-kit fa-right-arrow`}
                                ></i>
                            </Link>
                        ))}
                    </div>
                )}
            </InnerPageBanner>

            <FleetGapsSection {...fleetGapsData} id="fleetGaps" isByOEM={true} />
            <OneDevice
                {...(textImageData as any)}
                id="oneDevice"
                moveTitleInsideWrapper={true}
            />

            <PartnersSection {...partnersData} id="partners" />
            <FleetAgentsSection {...(fleetAgentsData as any)} headerAlign="left" id="fleetAgents" hideTabDescription={(fleetAgentsData as any).hideTabDescription} />
            {(stackFitData.title || (stackFitData.media as any)?.src) && (
                <StackFitSection {...stackFitData} id="stackFit" />
            )}
            <UltraSecureDesignSection {...(ultraSecureDesignData2)} id="enterpriseSecurity" columns={4} />
            <EngagementModelSection {...engagementModelData} id="engagementModel" />
            <QuantifiedImpactSection {...quantifiedImpactData} id="quantifiedImpact" />
            {/* <TestimonialSection {...testimonialData} id="testimonial" /> */}
            <CompleteYourIntelligence {...completeYourIntelligenceData} id="completeYourIntelligence" isOxRedLens />
            <FAQSection
                id="faq"
                title={faqData.title as string}
                items={faqData.items as Array<{ question: string; answer: string }>}
            />
            <ContactStripSection {...contactStripData} id="contactStrip" />
        </>
    );
}

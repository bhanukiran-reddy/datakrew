import type { Metadata } from 'next';
import { getSupportedLocalesSync } from "@/lib/config/locales";
import { buildMetadata } from "@/lib/utils/metadata";
import { notFound } from "next/navigation";

import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import OperationalCertaintySection from "@/components/sections/reusable/OperationalCertaintySection/OperationalCertaintySection";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import Link from "@/components/ui/Link/Link";
import StatsSections from '@/components/sections/reusable/StatsSection/StatsSection';
import CompleteYourIntelligence from '@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence';
import InstallItus from '@/components/sections/Pages/ITUSMaxPage/InstallItus/InstallItus';
import SingleMediaSection from '@/components/sections/reusable/SingleMediaSection/SingleMediaSection';
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import WebGLOrganicFlow from '@/components/sections/reusable/WebGLOrganicFlow/WebGLOrganicFlow';
import TableSection from '@/components/sections/reusable/TableSection/TableSection';
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import SoftwareApplicationPageSchema from '@/components/seo/SoftwareApplicationPageSchema';
import FleetAgentsSection from '@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection';
import byneedStyles from './use-case.module.css';

import { getByNeedSinglePage, getByNeedSlugs } from "@/lib/graphql/queries/getByNeedSinglePage";

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
    const locales = getSupportedLocalesSync();
    const slugs = await getByNeedSlugs();
    
    return locales.flatMap((locale: string) => 
        slugs.map((slug: string) => ({ locale, slug }))
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const data = await getByNeedSinglePage(slug, "SLUG");
    
    if (!data) return buildMetadata({ title: "Page Not Found" }, locale, { path: `use-case/${slug}` });
    
    return buildMetadata(data.seo || { title: data.title }, locale, { path: `use-case/${slug}` });
}

export default async function MixedFleetManagementPage({ params }: Props) {
    const { locale, slug } = await params;
    // Using SLUG is generally more reliable than constructing the URI
    const data = await getByNeedSinglePage(slug, "SLUG");

    if (!data) {
        notFound();
    }

    const {
        innerPageHeroSection,
        featuresCardSection,
        comparisionTableSection,
        featureTabsSection,
        statsSection,
        intelligenceStackSection,
        stepsWithMediaSection,
        singleMediaSection,
        caseStudyCarouselSection,
        prefooterCtaBannerSection
    } = data;

    return (
        <>
            <SoftwareApplicationPageSchema
                path={`use-case/${slug}`}
                name={data.title}
                description={
                    data.seo?.metaDesc || innerPageHeroSection?.innerpageHeroDescription
                }
                image={innerPageHeroSection?.innerpageHeroImage?.node?.mediaItemUrl}
            />
            <div>
                {innerPageHeroSection && (
                    <InnerPageBanner
                        title={innerPageHeroSection.innerpageHeroHeading}
                        description={innerPageHeroSection.innerpageHeroDescription}
                        backgroundImage={innerPageHeroSection.innerpageHeroImage?.node ? {
                            url: innerPageHeroSection.innerpageHeroImage.node.mediaItemUrl,
                            alt: innerPageHeroSection.innerpageHeroImage.node.altText || ''
                        } : undefined}
                        mobileImage={innerPageHeroSection.innerpageHeroMobileImage?.node ? {
                            url: innerPageHeroSection.innerpageHeroMobileImage.node.mediaItemUrl,
                            alt: innerPageHeroSection.innerpageHeroMobileImage.node.altText || ''
                        } : undefined}
                        breadcrumbItems={[
                            { label: "Home", href: "/" },
                            { label: "Use Case" },
                            { label: data.title },
                        ]}
                        className={byneedStyles.byneedBanner}
                    >
                        {innerPageHeroSection.innerpageHeroCTAButtons?.length > 0 && (
                            <div className={bannerStyles.innerPageBannerCtaGroup}>
                                {innerPageHeroSection.innerpageHeroCTAButtons.map((btn: any, index: number) => (
                                    <Link key={index} href={btn.buttonUrl?.url || "#"} locale={locale} className={index === 0 ? "primaryCta" : "secondaryCta"}>
                                        {btn.buttonText}
                                        <i className={`icon fa-kit fa-right-arrow`}></i>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </InnerPageBanner>
                )}

                {featuresCardSection && (
                    <div style={{ position: 'relative' }}>
                        <WebGLOrganicFlow className={byneedStyles.desktopOnly} ariaHidden={true} />
                        <OperationalCertaintySection 
                            title={featuresCardSection.featuresCardHeading}
                            description={featuresCardSection.featuresCardDescription}
                            align="left"
                            showTint={false}
                            className={byneedStyles.transparentOperationalBg}
                            cards={featuresCardSection.featureCards?.map((card: any) => ({
                                title: card.featureCardTitle,
                                description: card.featureCardDescription,
                                iconImage: card.featureCardIconImage?.node?.mediaItemUrl,
                                iconAlt: card.featureCardIconImage?.node?.altText,
                                iconClass: card.featureCardIconClass
                            }))}
                        />
                    </div>
                )}

                {comparisionTableSection && (
                    <TableSection 
                        {...comparisionTableSection}
                    />
                )}

                {featureTabsSection && (
                    <FleetAgentsSection 
                        title={featureTabsSection.featureTabsSectionHeading}
                        subheading={featureTabsSection.featureTabsSectionDescription}
                        agents={featureTabsSection.tabs?.map((tab: any, index: number) => ({
                            id: `tab-${index}`,
                            label: tab.tabLabel,
                            tabDescription: tab.tabIntro,
                            description: tab.tabDescription,
                            imageUrl: tab.tabImage?.node?.mediaItemUrl
                        }))}
                        headerAlign="left"
                        className={byneedStyles.useCaseFleetAgents}
                    />
                )}

                {data.statsSection && (
                    <StatsSections 
                        title={data.statsSection.statsHeading}
                        stats={data.statsSection.metricsDetails?.map((item: any) => ({
                            value: item.metricNumber ? `${item.metricNumber}${item.metricSuffix || ''}` : '',
                            label: item.metricLabel || '',
                            cellType: item.metricCellType?.[0],
                            // Only pass image if it actually exists - null means empty slot (shows placeholder div)
                            ...(item.metricImage?.node?.mediaItemUrl
                                ? { image: item.metricImage.node.mediaItemUrl }
                                : {})
                        }))}
                        ctaText={data.statsSection.statsCTAButton?.buttonText}
                        ctaHref={data.statsSection.statsCTAButton?.buttonUrl?.url}
                        className={byneedStyles.useCaseStats}
                    />
                )}

                {intelligenceStackSection && (
                    <CompleteYourIntelligence 
                        stackSectionHeader={intelligenceStackSection.stackSectionHeader}
                        stackSectionDescription={intelligenceStackSection.stackSectionDescription}
                        stackDetails={intelligenceStackSection.stackDetails}
                        stackCtaButton={intelligenceStackSection.stackCtaButton}
                    />
                )}

                {stepsWithMediaSection && stepsWithMediaSection.enableStepsWithMediaSection && (
                    <InstallItus 
                        title={stepsWithMediaSection.stepsMediaSectionHeading}
                        steps={stepsWithMediaSection.steps?.map((step: any) => ({
                            number: step.stepNumber,
                            title: step.stepTitle,
                            description: step.stepDescription
                        }))}
                        align='left'
                        image={stepsWithMediaSection.centeredMedia?.node ? {
                            url: stepsWithMediaSection.centeredMedia.node.mediaItemUrl,
                            alt: stepsWithMediaSection.centeredMedia.node.altText
                        } : undefined}
                        ctaButtons={stepsWithMediaSection.stepMediaCtaButton?.stepMediaButtonText ? [{
                            label: stepsWithMediaSection.stepMediaCtaButton.stepMediaButtonText,
                            url: stepsWithMediaSection.stepMediaCtaButton.stepMediaButtonUrl?.url || "#",
                            variant: 'primary'
                        }] : []}
                    />
                )}

                {singleMediaSection && (
                    <SingleMediaSection 
                        title={singleMediaSection.singleMediaSectionHeading}
                        description={singleMediaSection.singleMediaSectionDescription}
                        centerImage={singleMediaSection.singleMedia?.node?.mediaItemUrl}
                        buttons={singleMediaSection.singleMediaCtaButtons?.map((btn: any) => ({
                            label: btn.singleMediaButtonText,
                            url: btn.singleMediaButtonUrl?.url || "#"
                        }))}
                    />
                )}

                {caseStudyCarouselSection && (
                    <QuantifiedImpactSection 
                        {...caseStudyCarouselSection}
                    />
                )}

                {prefooterCtaBannerSection && (
                    <ContactStripSection 
                        {...prefooterCtaBannerSection}
                    />
                )}
            </div>
        </>
    );
}

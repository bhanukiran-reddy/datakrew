import type { Metadata } from 'next';
import { getSupportedLocalesSync } from "@/lib/config/locales";
import { buildMetadata } from "@/lib/utils/metadata";

import BgTitleDescriptionSection from "@/components/sections/reusable/BgTitleDescriptionSection/BgTitleDescriptionSection";
import CompleteYourIntelligence from "@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import FAQSection from '@/components/sections/reusable/FAQSection/FAQSection';
import FleetAgentsSection from '@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import OneDevice from "@/components/sections/reusable/OneDevice/OneDevice";
import { OperationalCertaintySection } from "@/components/sections/reusable/OperationalCertaintySection";
import QuantifiedImpactSection from '@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection';
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import Link from "@/components/ui/Link/Link";
import { getIndustryConstructionMiningPage } from "@/lib/graphql/queries/getIndustryConstructionMiningPage";
import IndustryPageSchema from "@/components/seo/IndustryPageSchema";
import styles from "./constructionmining.module.css";
import bannerStyles from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner.module.css";
import SingleMediaSection from '@/components/sections/reusable/SingleMediaSection/SingleMediaSection';
type Props = {
    params: Promise<{ locale: string }>;
};

export const revalidate = 60;


export function generateStaticParams() {
    return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const pageData = await getIndustryConstructionMiningPage(
        locale,
        "/industry/construction-mining/",
    ).catch(() => null);

    return buildMetadata(pageData?.seo || { title: "Construction & Mining" }, locale, { path: 'industry/construction-mining' });
}

export default async function ConstructionMiningPage({ params }: Props) {
    const { locale } = await params;

    const pageData = await getIndustryConstructionMiningPage(
        locale,
        "/industry/construction-mining/",
    ).catch((err: any) => {
        console.warn(
            "[construction-mining] CMS fetch failed, using empty fallback:",
            err?.message ?? err,
        );
        return null;
    });

    const heroSection = pageData?.innerPageHeroSection || {};

    const bannerData = {
        title: heroSection.innerpageHeroHeading || "",
        description: heroSection.innerpageHeroDescription || "",
        backgroundImage: heroSection.innerpageHeroImage?.node
            ? {
                url: heroSection.innerpageHeroImage.node.mediaItemUrl || "",
                alt: heroSection.innerpageHeroImage.node.altText || "",
            }
            : { url: "", alt: "" },
        mobileImage: heroSection.innerpageHeroMobileImage?.node
            ? {
                url: heroSection.innerpageHeroMobileImage.node.mediaItemUrl || "",
                alt: heroSection.innerpageHeroMobileImage.node.altText || "",
            }
            : undefined,
        breadcrumbItems: [
            { label: "Home", href: "/" },
            { label: "Industry"},
            { label: "Construction & Mining" },
        ],
        ctaButtons:
            heroSection.innerpageHeroCTAButtons?.map((btn: any) => ({
                label: btn.buttonText || "",
                url: btn.buttonUrl?.url || "#",
            })) || [],
    };

    const featuresSection = pageData?.featuresCardSection || {};

    const operationalData = {
        title: featuresSection.featuresCardHeading || "",
        description: featuresSection.featuresCardDescription || "",
        align: "left" as const,
        ctaText: featuresSection.featureCardCta?.featureCardCTAText || undefined,
        ctaHref: featuresSection.featureCardCta?.featureCardCTAURL?.url || undefined,
        cards:
            featuresSection.featureCards?.map((card: any) => ({
                iconImage: card.featureCardIconImage?.node?.mediaItemUrl || "",
                iconAlt: card.featureCardIconImage?.node?.altText || "",
                iconClass: card.featureCardIconClass || "",
                title: card.featureCardTitle || "",
                description: card.featureCardDescription || "",
            })) || [],
    };

    const imagePlusTextSection = pageData?.imagePlusTextSection || {};
    const oneDeviceDataDynamic = {
        title: imagePlusTextSection.imageTextHeading || "",
        description: imagePlusTextSection.imageTextDescription || "",
        image: imagePlusTextSection.imageTextMedia?.node
            ? {
                url: imagePlusTextSection.imageTextMedia.node.mediaItemUrl,
                alt: "Device showcase",
            }
            : { url: "", alt: "" },
        statsWidth: "narrow" as const,
        stats: [],
    };

    const featureTabsSection = pageData?.featureTabsSection || {};
    const fleetAgentsDataDynamic = {
        title: featureTabsSection.featureTabsSectionHeading || "",
        subheading: featureTabsSection.featureTabsSectionDescription || "",
        headerAlign: "center" as const,
        agents:
            featureTabsSection.tabs?.map((tab: any, i: number) => ({
                id: `tab-${i}`,
                label: tab.tabLabel || "",
                tabDescription: tab.tabIntro || "",
                description: tab.tabDescription || "",
                imageUrl: tab.tabImage?.node?.mediaItemUrl || "",
            })) || [],
    };

    const staggeredGridSection = pageData?.staggeredGridSection || {};
    const ultraSecureDesignDataDynamic = {
        title:
            staggeredGridSection.gridSectionHeading || "",
        subtitle:
            staggeredGridSection.gridSectionDescription || "",
        columns: 3,
        cells:
            staggeredGridSection.gridItems?.map((item: any) => ({
                type:
                    item.gridLayoutStyle?.[0] === "no-border"
                        ? "borderless-content"
                        : "content",
                number: item.gridItemTitle || "",
                description: item.gridItemDescription || "",
            })) || [],
    };

    const intelligenceStackSection = pageData?.intelligenceStackSection || {};
    const caseStudySection = pageData?.caseStudyCarouselSection;

    const ctaBanner = pageData?.ctaBannerSection || {};
    const faqSectionData = pageData?.faqSection || {};
    const prefooterSection = pageData?.prefooterCtaBannerSection || {};

    const bgTitleDescriptionDynamic = {
        title: ctaBanner.ctaBannerHeading || "",
        description: ctaBanner.ctaBannerDescription || "",
        backgroundImage: {
            url: ctaBanner.ctaBannerBackgroundImage?.node?.mediaItemUrl || "",
            alt: "CTA background",
            width: 1440,
            height: 443,
        },
        button: ctaBanner.bannerCtaButtons?.[0]
            ? {
                label: ctaBanner.bannerCtaButtons[0].buttonText || "",
                url: ctaBanner.bannerCtaButtons[0].buttonUrl?.url || "#",
                variant: "primary" as const,
            }
            : undefined,
    };

    const faqDynamic = {
        title: faqSectionData.faqSectionHeading || "",
        items:
            faqSectionData.faqItems?.map((item: any) => ({
                question: item.question || "",
                answer: item.answer || "",
            })) || [],
    };

    const contactStripDynamic = {
        prefooterCtaBannerHeading: prefooterSection.prefooterCtaBannerHeading || "",
        prefooterCtaBannerDescription:
            prefooterSection.prefooterCtaBannerDescription || "",
        prefooterCtaBackgroundImage:
            prefooterSection.prefooterCtaBackgroundImage || {
                node: { mediaItemUrl: "" },
            },
        prefooterBannerCtaButtons: prefooterSection.prefooterBannerCtaButtons || [],
    };

    const singleMediaSection = pageData?.singleMediaSection || {};
    const productModulesDataDynamic = {
        title: singleMediaSection.singleMediaSectionHeading || "",
        description: singleMediaSection.singleMediaSectionDescription || "",
        centerImage: singleMediaSection.singleMedia?.node?.mediaItemUrl || "",
        buttons: singleMediaSection.singleMediaCtaButtons?.map((btn: any) => ({
            label: btn.singleMediaButtonText || "",
            url: btn.singleMediaButtonUrl?.url || "#"
        })) || []
    };

    return (
        <>
            <IndustryPageSchema
                slug="construction-mining"
                name={bannerData.title}
                description={pageData?.seo?.metaDesc || bannerData.description}
                faqItems={faqDynamic.items}
            />

                <InnerPageBanner
                    title={bannerData.title}
                    description={bannerData.description}
                    backgroundImage={bannerData.backgroundImage}
                    mobileImage={bannerData.mobileImage}
                    breadcrumbItems={bannerData.breadcrumbItems}
                    className={styles.miningOparationalSection}
                >
                    {bannerData.ctaButtons.length > 0 && (
                        <div className={bannerStyles.innerPageBannerCtaGroup}>
                            {bannerData.ctaButtons.map((btn: any, index: number) => (
                                <Link key={index} href={btn.url} locale={locale} className={index === 0 ? "primaryCta" : "secondaryCta"}>
                                    {btn.label}
                                    <i
                                        className={`icon fa-kit fa-right-arrow`}
                                    ></i>
                                </Link>
                            ))}
                        </div>
                    )}
                </InnerPageBanner>
                <OperationalCertaintySection {...operationalData} className={styles.miningOparationalSection} />
                <OneDevice {...oneDeviceDataDynamic} statsWidth="full" hideFallbackImage={true} />
                {fleetAgentsDataDynamic.agents?.length > 0 && <FleetAgentsSection {...fleetAgentsDataDynamic} headerAlign="left" />}
                <UltraSecureDesignSection
                    {...ultraSecureDesignDataDynamic}
                    columns={3}
                    numberClassName={styles.customNumberSize}
                    className={styles.miningOparationalSection}
                />
                <SingleMediaSection {...productModulesDataDynamic} centerImage={productModulesDataDynamic.centerImage} />
                {/* <TwelveModuleSection {...productModulesDataDynamic} mobileCardStartY={500} mobileCardYSpacing={340} mobileLineColor="#3AB1C5" /> */}
                <CompleteYourIntelligence
                    stackSectionHeader={intelligenceStackSection.stackSectionHeader}
                    stackSectionDescription={intelligenceStackSection.stackSectionDescription}
                    stackDetails={intelligenceStackSection.stackDetails}
                    stackCtaButton={intelligenceStackSection.stackCtaButton}
                />
                <QuantifiedImpactSection {...(caseStudySection as any)} id="impact" />
                <BgTitleDescriptionSection {...bgTitleDescriptionDynamic} />
                {faqDynamic.title && faqDynamic.items?.length > 0 && (
                    <FAQSection
                        title={faqDynamic.title}
                        items={faqDynamic.items}
                    />
                )}
                <ContactStripSection {...contactStripDynamic} />
        
            
        </>
    )
}

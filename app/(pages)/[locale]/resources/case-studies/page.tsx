import type { Metadata } from "next";
import { getCaseStudiesOverviewPage } from "@/lib/graphql/queries/getCaseStudiesOverviewPage";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import styles from "./caseStudies.module.css";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import QuantifiedImpactSection from "@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection";
import BlogListSection from "@/components/sections/reusable/BlogListSection/BlogListSection";
import OutcomesSection from "@/components/sections/Pages/Home/OutcomesSection/OutcomesSection";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/utils/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const data = await getCaseStudiesOverviewPage().catch(() => null);
    const page = data?.page;

    const heroTitle = page?.innerPageHeroSection?.innerpageHeroHeading;
    return buildMetadata(page?.seo, locale, {
        title: heroTitle || page?.title || "Case Studies",
        path: 'resources/case-studies',
    });
}

export default async function CaseStudiesPage() {
    const data = await getCaseStudiesOverviewPage();

    if (!data || !data.page) {
        return notFound();
    }

    const { page, regularCaseStudies } = data;

    const hero = page.innerPageHeroSection || {};
    const carousel = page.caseStudyCarouselSection || {};
    const outcomesConfig = page.performanceMetricsSection || {};
    const prefooter = page.prefooterCtaBannerSection || {};

    const breadcrumbItems = [
        { label: "Resources", href: "/resources" },
        { label: "Case Studies" }
    ];

    const allIndustriesSet = new Set<string>();
    const allRegionsSet = new Set<string>();

    regularCaseStudies?.nodes?.forEach((post: any) => {
        post.industries?.nodes?.forEach((n: any) => {
            if (n.name) allIndustriesSet.add(n.name);
        });
        post.region?.nodes?.forEach((n: any) => {
            if (n.name) allRegionsSet.add(n.name);
        });
    });

    const industryOptions = Array.from(allIndustriesSet).sort();
    const regionOptions = Array.from(allRegionsSet).sort();

    // Map regular case studies for BlogListSection
    const mappedCaseStudies = regularCaseStudies?.nodes?.map((post: any) => {
        const industriesNodes = post.industries?.nodes || [];
        const regionNodes = post.region?.nodes || [];

        const industry = industriesNodes?.[0]?.name;
        const region = regionNodes?.[0]?.name;

        const category = industry && region ? `${industry} | ${region}` : (industry || region || "Case Study");

        return {
            id: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            rawDate: post.date,
            image: post.featuredImage?.node?.mediaItemUrl || "/blog/blog.svg",
            imageAlt: post.featuredImage?.node?.altText || post.title || "Case study",
            category: category,
            industries: industriesNodes.map((n: any) => n.name),
            region: regionNodes.map((n: any) => n.name),
            linkUrl: `/resources/case-studies/${post.slug}/`,
            linkText: "View case study",
            slug: post.slug
        };
    }) || [];

    const prefooterCtas = prefooter?.prefooterBannerCtaButtons?.map((btn: any) => ({
        text: btn.buttonText,
        url: btn.buttonUrl?.url || "#"
    })) || [];

    const outcomesData = {
        title: outcomesConfig.metricsHeading,
        description: outcomesConfig.metricsDescription,
        outcomes: outcomesConfig.metricsItems?.map((item: any) => ({
            percentage: item.metricValue,
            title: item.metricTitle,
            description: item.metricDescription,
        })) || []
    };

    return (
        <div className={styles.caseStudiesPage}>
            <InnerPageBanner
                title={hero.innerpageHeroHeading || "Case Studies"}
                description={hero.innerpageHeroDescription}
                className={styles.caseStudiesBanner}
                breadcrumbItems={breadcrumbItems}
                backgroundImage={{
                    url: hero.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
                    alt: hero.innerpageHeroImage?.node?.altText || "Case Studies Banner",
                }}
                mobileImage={{
                    url: hero.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
                    alt: hero.innerpageHeroMobileImage?.node?.altText || "Case Studies Mobile Banner",
                }}
            />

            <QuantifiedImpactSection
                csCarouselHeading={carousel.csCarouselHeading}
                csCarouselDescription={carousel.csCarouselDescription}
                csCarouselItems={carousel.csCarouselItems}
            />

            {mappedCaseStudies.length > 0 && (
                <BlogListSection
                    posts={mappedCaseStudies}
                    isCategory={false}
                    isSort={false}
                    isSearch={false}
                    heading="More success"
                    headingHighlight="stories"
                    categoryStyle="text"
                    industries={industryOptions}
                    regions={regionOptions}
                />
            )}

            <OutcomesSection {...outcomesData} />
            <ContactStripSection
                title={prefooter?.prefooterCtaBannerHeading || "Turn data into decisions"}
                description={prefooter?.prefooterCtaBannerDescription || ""}
                ctas={prefooterCtas}
                backgroundImageUrl={prefooter?.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "/prefooter-banner.webp"}
            />
        </div>
    );
}

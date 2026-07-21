"use client";

import { useState, useMemo } from "react";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import StickyNavSection from '@/components/sections/reusable/StickyNavSection/StickyNavSection';
import BlogCard from "@/components/ui/BlogCard/BlogCard";
import PodcastCard from "@/components/ui/PodcastCard/podcastCard";
import ContactStripSection from '@/components/sections/reusable/ContactStripSection/ContactStripSection';
import Filters from "@/components/ui/Filters/Filters";
import DownloadFormPopup from "@/components/ui/DownloadFormPopup/DownloadFormPopup";
import Link from "next/link";
import styles from "./resources.module.css";
import { defaultLocale } from "@/lib/config/locales";

interface Section {
    id: string;
    title: string;
    viewAllUrl: string;
    viewAllText?: string;
    posts: any[];
}

interface ResourcesClientProps {
    locale: string;
    hero: any;
    prefooter: any;
    sections: Section[];
    stickyNavItems: any[];
}

const DOWNLOADABLE_SECTIONS = ["whitepapers", "infographics"];

export default function ResourcesClient({ locale, hero, prefooter, sections, stickyNavItems }: ResourcesClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortOption, setSortOption] = useState("Latest");
    const [selectedAsset, setSelectedAsset] = useState<any>(null);

    const categories = useMemo(() => stickyNavItems.map(item => item.label), [stickyNavItems]);

    const handleCardClick = (post: any, sectionId: string) => {
        if (!DOWNLOADABLE_SECTIONS.includes(sectionId)) return;
        const access = post.category?.toLowerCase();
        if (access === 'non-gated' || access === 'nongated' || access === 'ungated') {
            if (post.fileUrl) window.open(post.fileUrl, '_blank');
        } else {
            setSelectedAsset(post);
        }
    };

    const filteredSections = useMemo(() => {
        return sections
            .map((section) => {
                let filteredPosts = section.posts;

                // 1. Text Search
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    filteredPosts = filteredPosts.filter(
                        (post) =>
                            post.title.toLowerCase().includes(q) ||
                            (post.excerpt && post.excerpt.toLowerCase().includes(q))
                    );
                }

                // 2. Sorting
                if (sortOption) {
                    filteredPosts = [...filteredPosts].sort((a, b) => {
                        const dateA = new Date(a.rawDate || a.date).getTime() || 0;
                        const dateB = new Date(b.rawDate || b.date).getTime() || 0;
                        return sortOption === "Latest" ? dateB - dateA : dateA - dateB;
                    });
                }

                return { ...section, posts: filteredPosts.slice(0, 3) };
            })
            .filter((section) => {
                // 3. Category Filter
                const matchingNavItem = stickyNavItems.find(item => item.label === categoryFilter);
                if (categoryFilter && matchingNavItem) {
                    return section.id === matchingNavItem.id;
                }
                return section.posts.length > 0;
            });
    }, [sections, searchQuery, categoryFilter, sortOption, stickyNavItems]);

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Resources", href: locale === defaultLocale ? "/resources" : `/${locale}/resources` },
    ];

    return (
        <>
            <InnerPageBanner
                title={hero?.innerpageHeroHeading || "Decision-grade <span>resources</span>"}
                description={hero?.innerpageHeroDescription || "Reports, infographics, whitepapers, case studies, and events built for real operational outcomes."}
                breadcrumbItems={breadcrumbItems}
                className={styles.resourcesBanner}
                backgroundImage={{
                    url: hero?.innerpageHeroImage?.node?.mediaItemUrl || "/blog/blog-banner.webp",
                    alt: hero?.innerpageHeroImage?.node?.altText || "Resources Banner"
                }}
                mobileImage={{
                    url: hero?.innerpageHeroMobileImage?.node?.mediaItemUrl || "/blog/blog-mobile-banner.webp",
                    alt: hero?.innerpageHeroMobileImage?.node?.altText || "Resources Mobile Banner"
                }}
            />

            {!searchQuery && !categoryFilter && <StickyNavSection items={stickyNavItems} />}

            <div className="container">
                <div className={styles.resourcesWrapper}>
                    <div className={styles.filterWrapper}>
                        <Filters
                            isSearch={true}
                            isCategory={true}
                            isSort={true}
                            categories={categories}
                            categoryLabel="Filter by content type"
                            onSearch={setSearchQuery}
                            onCategoryChange={setCategoryFilter}
                            onSortChange={setSortOption}
                        />
                    </div>

                    {filteredSections.length > 0 ? (
                        filteredSections.map((section) => (
                            <section key={section.id} id={section.id} className={styles.categorySection}>
                                <div>
                                    <h2
                                        className={`sectionTitle ${styles.categoryTitle}`}
                                        dangerouslySetInnerHTML={{ __html: section.title }}
                                    />
                                    <div className={styles.cardsGrid}>
                                        {section.id === "videos-podcasts" ? (
                                            section.posts.map((post: any) => (
                                                <PodcastCard key={post.id} {...post} />
                                            ))
                                        ) : DOWNLOADABLE_SECTIONS.includes(section.id) ? (
                                            section.posts.map((post: any) => (
                                                <div
                                                    key={post.id}
                                                    onClick={() => handleCardClick(post, section.id)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <BlogCard
                                                        {...post}
                                                        linkUrl={undefined}
                                                        onClick={() => handleCardClick(post, section.id)}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            section.posts.map((post: any) => (
                                                <BlogCard
                                                    key={post.id}
                                                    {...post}
                                                    categoryStyle={["events", "case-studies"].includes(section.id) ? "text" : "bubble"}
                                                    categoryClassName={section.id === "events" ? styles.tealCategory : ""}
                                                />
                                            ))
                                        )}
                                    </div>
                                    {!searchQuery && (
                                        <div className={styles.viewAllWrapper}>
                                            <Link href={section.viewAllUrl} className="secondaryCta">
                                                {section.viewAllText || "Explore more events"} <i className="icon fa-kit fa-right-arrow"></i>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                            <p style={{ fontSize: '1.5rem', color: '#ccc' }}>Uh-oh!! We couldn&apos;t find any resources matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            <ContactStripSection
                title={prefooter?.prefooterCtaBannerHeading || ""}
                description={prefooter?.prefooterCtaBannerDescription || ""}
                ctas={prefooter?.prefooterBannerCtaButtons?.map((btn: any) => ({
                    text: btn.buttonText,
                    url: btn.buttonUrl?.url || "#"
                })) || []}
                backgroundImageUrl={prefooter?.prefooterCtaBackgroundImage?.node?.mediaItemUrl || "/prefooter-banner.webp"}
            />

            {selectedAsset && (
                <DownloadFormPopup
                    title="Share your details to download and start the conversation"
                    fileUrl={selectedAsset.fileUrl}
                    assetName={selectedAsset.title}
                    onClose={() => setSelectedAsset(null)}
                />
            )}
        </>
    );
}

"use client";

import { useState } from "react";
import BlogListSection from "@/components/sections/reusable/BlogListSection/BlogListSection";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import teamStyles from "@/components/sections/reusable/TeamSection/TeamSection.module.css";
import eventsStyles from "./events.module.css";
import blogCardStyles from "@/components/ui/BlogCard/BlogCard.module.css";
import Link from "next/link";

interface EventsClientProps {
    pageData: any;
    upcomingEvents: any;
    ongoingEvents: any;
    pastEvents: any;
}

export default function EventsClient({ pageData, upcomingEvents, ongoingEvents, pastEvents }: EventsClientProps) {
    // Priority order: Ongoing > Upcoming > Past
    // We "swap" them so that the first tab shown is the one that actually has content.
    const allTabs = [
        { id: "Ongoing Events", nodes: ongoingEvents?.nodes },
        { id: "Upcoming Events", nodes: upcomingEvents?.nodes },
        { id: "Past Events", nodes: pastEvents?.nodes },
    ];

    const tabsWithContent = allTabs.filter(t => t.nodes && t.nodes.length > 0).map(t => t.id);
    const tabsWithoutContent = allTabs.filter(t => !t.nodes || t.nodes.length === 0).map(t => t.id);

    const tabs = [...tabsWithContent, ...tabsWithoutContent];
    const [activeTab, setActiveTab] = useState(tabs[0] || "Upcoming Events");

    const isUpcoming = activeTab === "Upcoming Events";
    const isOngoing = activeTab === "Ongoing Events";
    const isPast = activeTab === "Past Events";

    // Choose hero section based on tab
    let hero = pageData?.upcomingEventHeroSection;
    if (isOngoing) hero = pageData?.ongoingEventHeroSection;
    if (isPast) hero = pageData?.pastEventHeroSection;

    let eventNodes = upcomingEvents?.nodes || [];
    if (isOngoing) eventNodes = ongoingEvents?.nodes || [];
    if (isPast) eventNodes = pastEvents?.nodes || [];

    const formatDateRange = (startDate: string, endDate: string) => {
        if (!startDate) return "";
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        const month = start.toLocaleString('en-US', { month: 'long' });
        const startDay = start.getDate();

        if (end && end.getMonth() === start.getMonth()) {
            const endDay = end.getDate();
            if (startDay === endDay) return `${startDay} <br/> ${month}`;
            return `${startDay}-${endDay} <br/> ${month}`;
        }

        return `${startDay} <br/> ${month}`;
    };

    const mappedPosts = eventNodes.map((node: any) => {
        const details = node.eventAdditionalDetails || {};
        return {
            id: node.slug,
            title: node.title,
            image: node.featuredImage?.node?.mediaItemUrl,
            dateBadge: formatDateRange(details.eventStartDate, details.eventEndDate),
            excerpt: details.eventVenue ? `${details.eventVenue}, ${details.eventLocation || ''}`.replace(/, $/, '') : details.eventLocation,
            date: isUpcoming ? "Upcoming Event" : isOngoing ? "Ongoing Event" : "Past Event",
            rawDate: details.eventStartDate,
            slug: node.slug,
            linkUrl: node.uri || `/resources/events/${node.slug}`,
            linkText: "Learn more",
            locationIcon: "fa-kit fa-location",
            tab: activeTab,
            hideCategory: false
        };
    });

    let bannerTitle = hero?.upcomingHeroHeading || hero?.ongoingHeroHeading || hero?.pastHeroHeading;
    let bannerDesc = hero?.upcomingHeroDescription || hero?.ongoingHeroDescription || hero?.pastHeroDescription;
    let bannerImg = hero?.upcomingHeroImage || hero?.ongoingHeroImage || hero?.pastHeroImage;
    let bannerMobileImg = hero?.upcomingHeroMobileImage || hero?.ongoingHeroMobileImage || hero?.pastHeroMobileImage;
    let bannerButtons = isUpcoming ? hero?.upcomingHeroCTAButtons : isPast ? hero?.pastHeroCTAButtons : null;

    return (<div className={eventsStyles.eventsPageContainer}>
        {/* Wrapper for animation trigger on tab change */}
        <InnerPageBanner
            title={bannerTitle || ""}
            description={bannerDesc || ""}
            className={eventsStyles.eventsBanner}
            breadcrumbItems={[
                { label: "Home", href: "/" },
                { label: "Resources", href: "/resources" },
                { label: "Events" }
            ]}
            backgroundImage={bannerImg?.node ? {
                url: bannerImg.node.mediaItemUrl,
                alt: bannerImg.node.altText
            } : undefined}
            mobileImage={bannerMobileImg?.node ? {
                url: bannerMobileImg.node.mediaItemUrl,
                alt: bannerMobileImg.node.altText
            } : undefined}
        >
            {bannerButtons && bannerButtons.length > 0 && (
                <div className="bannerButtonsGroup" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    {bannerButtons.map((btn: any, idx: number) => {
                        const buttonText = isUpcoming ? btn.upcomingButtonText : btn.pastButtonText;
                        const buttonUrl = isUpcoming ? btn.upcomingButtonUrl : btn.pastButtonUrl;
                        return (
                            <Link
                                key={idx}
                                href={buttonUrl?.url || "#"}
                                target={buttonUrl?.target || "_self"}
                                className={idx === 0 ? "primaryCta" : "secondaryCta"}
                            >
                                {buttonText}
                            </Link>
                        );
                    })}
                </div>
            )}
        </InnerPageBanner>
        <BlogListSection
            posts={mappedPosts}
            isSearch={true}
            isCategory={false}
            isSort={true}
            noResultsMessage={
                <p>
                    There are no {isUpcoming ? "upcoming" : isOngoing ? "ongoing" : "past"} events at the moment.
                    Stay tuned with us for more event details.
                </p>
            }
        >
            <div
                className={`${teamStyles.categoryFilterWrap} ${eventsStyles.categoryFilterWrap}`}
            >
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        className={`${teamStyles.categoryTab} ${activeTab === tab ? teamStyles.active : ""}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ flexShrink: 0, marginRight: 0 }}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </BlogListSection>
    </div>
    );
}

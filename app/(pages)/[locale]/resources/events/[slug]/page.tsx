import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/utils/metadata";
import { buildEventJsonLd } from "@/lib/seo";
import { getBaseUrl } from "@/lib/env";
import JsonLd from "@/components/seo/JsonLd";
import { getEventInnerPage } from "@/lib/graphql/queries/getEventInnerPage";
import { getHeaderMegaMenu } from "@/lib/graphql/queries/getHeaderMegaMenu";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Stats from "@/components/ui/Stats/Stats";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import TableSection from "@/components/sections/reusable/TableSection/TableSection";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import ContactFormSection from "@/app/(pages)/[locale]/contact/ContactFormSection";
import contactStyles from "@/app/(pages)/[locale]/contact/contactForm.module.css";
import Image from "@/components/ui/Image/Image";
import Link from "@/components/ui/Link/Link";
import EventCtaButtons from "./EventCtaButtons";
import LifeAtDatakrew from "../../../careers/LifeAtDatakrew";
import ActiveEventTheme from "./ActiveEventTheme";
import LandingHeader from "./LandingHeader";
import SingleMediaSection from "@/components/sections/reusable/SingleMediaSection/SingleMediaSection";

import linkedIcon from "@/public/icons/linkedin-icon.svg";
import styles from "./page.module.css";

interface EventHeroCtaButton {
    eventButtonText?: string;
    eventButtonUrl?: {
        url?: string;
        target?: string;
    };
}

interface MetricsItem {
    metricValue?: string;
    metricTitle?: string;
    metricDescription?: string;
}

interface GridItem {
    gridCellType?: string;
    gridIconClass?: string;
    gridItemIconImage?: {
        node?: {
            mediaItemUrl?: string;
        };
    };
    gridItemDescription?: string;
    gridItemTitle?: string;
    gridLayoutStyle?: string[];
}

interface SpeakerMember {
    id: string;
    title?: string;
    featuredImage?: {
        node?: {
            altText?: string;
            mediaItemUrl?: string;
        };
    };
    teamAdditionFields?: {
        teamDesignation?: string;
        socialLinks?: {
            linkedinUrl?: string;
        };
    };
}

interface FeatureItem {
    featureHeading?: string;
    featureDescription?: string;
}

interface GalleryNode {
    mediaItemUrl: string;
    altText?: string;
}

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const { getEventSlugs, staticParamsFromSlugs } = await import(
    '@/lib/graphql/queries/getStaticSlugs'
  );
  return staticParamsFromSlugs(await getEventSlugs());
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const uri = `events/${slug}/`;
    const event = await getEventInnerPage(uri);

    if (!event) {
        return buildMetadata({ title: "Event - Datakrew" }, locale, { path: `resources/events/${slug}` });
    }

    return buildMetadata(event.seo || { title: event.title }, locale, {
        path: `resources/events/${slug}`,
    });
}

export default async function EventInnerPage({ params }: Props) {
    const { slug, locale } = await params;
    const uri = `events/${slug}/`;
    const [event, headerData] = await Promise.all([
        getEventInnerPage(uri),
        getHeaderMegaMenu().catch(() => null)
    ]);

    if (!event) notFound();

    const {
        eventHeroSection,
        performanceMetricsSection,
        staggeredGridSection,
        comparisionTableSection,
        eventsSpeakersSection,
        prefooterCtaBannerSection,
        eventAdditionalDetails
    } = event;

    // Calculate active vs past state early so we can use it for ctaButtons
    const now = new Date();
    const eventEnd = eventAdditionalDetails?.eventEndDate ? new Date(eventAdditionalDetails.eventEndDate) : null;
    const eventStart = eventAdditionalDetails?.eventStartDate ? new Date(eventAdditionalDetails.eventStartDate) : null;
    const eventEndDateVal = eventEnd || eventStart;
    const isEventPast = eventEndDateVal ? eventEndDateVal < now : false;

    let ctaButtons = eventHeroSection?.eventHeroCTAButtons?.map((btn: EventHeroCtaButton) => ({
        label: btn.eventButtonText,
        url: btn.eventButtonUrl?.url || "#",
        target: btn.eventButtonUrl?.target,
        pdfUrl: btn.eventButtonText?.toLowerCase().includes("download") ? btn.eventButtonUrl?.url : undefined,
    })) || [];

    if (!isEventPast) {
        // If upcoming, ensure "Reserve Your spot" is available as the primary CTA
        const hasReserveBtn = ctaButtons.some((b: { label?: string }) => b.label?.toLowerCase().includes("reserve"));
        if (!hasReserveBtn) {
            ctaButtons.unshift({
                label: "Reserve your spot",
                url: "#contact",
                target: "_self"
            });
        }
    }

    const stats = performanceMetricsSection?.metricsItems?.map((item: MetricsItem) => ({
        statsValue: item.metricValue,
        statsDescription: item.metricTitle,
    }));

    const ultraSecureDesignDataDynamic = {
        title: staggeredGridSection?.gridSectionHeading || "",
        subtitle: staggeredGridSection?.gridSectionDescription || "",
        columns: 3,
        cells: staggeredGridSection?.gridItems?.map((item: GridItem) => ({
            type: item.gridLayoutStyle?.[0] === "no-border" ? "borderless-content" : "content",
            number: item.gridItemTitle || "",
            description: item.gridItemDescription || "",
            iconClass: item.gridIconClass || "",
            icon: item.gridItemIconImage?.node?.mediaItemUrl || "",
        })) || [],
    };

    const teamMembers = eventsSpeakersSection?.eventSpeakers?.nodes || [];

    const galleryNodes = eventAdditionalDetails?.eventGallery?.nodes || [];
    const lifeAtDatakrewData = galleryNodes.length > 0 ? {
        title: "Event <span>gallery</span>",
        subheading: "",
        images: galleryNodes.slice(0, 4).map((node: GalleryNode, index: number) => ({
            url: node.mediaItemUrl,
            alt: node.altText || `Event Photo ${index + 1}`,
            type: (index === 0 || index === 3) ? "horizontal" as const : "square" as const
        }))
    } : null;

    const twoColumnFormSection = event?.twoColumnFormSection || {};

    const whyChooseData = {
        title: twoColumnFormSection.twoColumnFormHeading || "Why Choose DataKrew",
        features: twoColumnFormSection.twoColumnDescriptionFeatures || [],
    };

    const pageUrl = getBaseUrl()
        ? `${getBaseUrl()}/resources/events/${slug}`
        : "";
    const eventJsonLd = pageUrl
        ? buildEventJsonLd({
            name: eventHeroSection?.eventHeroHeading || event.title,
            url: pageUrl,
            startDate: eventAdditionalDetails?.eventStartDate,
            endDate: eventAdditionalDetails?.eventEndDate,
            description: eventHeroSection?.eventHeroDescription,
            image: eventHeroSection?.eventHeroImage?.node?.mediaItemUrl,
            location:
                eventAdditionalDetails?.eventVenue ||
                eventAdditionalDetails?.eventLocation,
        })
        : null;

    const pageContent = (
        <>
            {eventJsonLd ? <JsonLd data={eventJsonLd} /> : null}
            <InnerPageBanner
                className={styles.cvShowBanner}
                title={eventHeroSection?.eventHeroHeading || event.title}
                description={eventHeroSection?.eventHeroDescription}
                pageUrl={pageUrl || undefined}
                backgroundImage={
                    eventHeroSection?.eventHeroImage?.node?.mediaItemUrl
                        ? {
                            url: eventHeroSection.eventHeroImage.node.mediaItemUrl,
                            alt: eventHeroSection?.eventHeroHeading || event.title,
                        }
                        : undefined
                }
                mobileImage={
                    eventHeroSection?.eventHeroMobileImage?.node?.mediaItemUrl
                        ? {
                            url: eventHeroSection.eventHeroMobileImage.node.mediaItemUrl,
                            alt: eventHeroSection?.eventHeroHeading || event.title,
                        }
                        : undefined
                }
                breadcrumbItems={[
                    { label: "Home", href: "/" },
                    { label: "Resources", href: "/resources" },
                    { label: "Events", href: "/resources/events" },
                    { label: event.title },
                ]}
            >
                <div className={styles.bannerEventInfo}>
                    {eventHeroSection?.bannerEventDate && (
                        <div className={styles.bannerEventItem}>
                            <i className="fa-kit fa-date" />
                            <p className={styles.bannerEventItemText} dangerouslySetInnerHTML={{ __html: eventHeroSection.bannerEventDate }} />
                        </div>
                    )}
                    {(eventHeroSection?.bannerEventDate && event.eventAdditionalDetails?.eventVenue) && (
                        <div className={styles.bannerDivider} />
                    )}
                    {event.eventAdditionalDetails?.eventVenue && (
                        <div className={styles.bannerEventItem}>
                            <i className="fa-kit fa-booth" />
                            <p dangerouslySetInnerHTML={{ __html: event.eventAdditionalDetails.eventVenue }} />
                        </div>
                    )}
                </div>
                {ctaButtons && ctaButtons.length > 0 && (
                    <EventCtaButtons
                        buttons={ctaButtons}
                        wrapperClassName={styles.bannerCtaWrapper}
                        isBanner={true}
                        id="banner-ctas"
                    />
                )}
            </InnerPageBanner>

            {eventsSpeakersSection?.eventSpeakersHeading && (
                <section className={styles.meetTheTeamSection}>
                    <div className="container">
                        <div className={styles.meetTeamWrapper}>
                            <div className={styles.meetTeamImage}>
                                {eventsSpeakersSection.eventSpeakersBgImage?.node?.mediaItemUrl && (
                                    <Image
                                        src={eventsSpeakersSection.eventSpeakersBgImage.node.mediaItemUrl}
                                        alt="Event image"
                                        width={900}
                                        height={600}
                                        className={styles.eventImage}
                                    />
                                )}
                                <div className={styles.desktopEventInfoBox}>
                                    <div className={styles.eventInfoInner}>
                                        {event.eventAdditionalDetails?.eventLogo?.node?.mediaItemUrl && (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={event.eventAdditionalDetails.eventLogo.node.mediaItemUrl} alt="Event logo" className={styles.eventLogo} />
                                        )}
                                        <div className={styles.eventDetailsList}>
                                            {eventHeroSection?.bannerEventDate && (
                                                <div className={styles.eventDetailItem}>
                                                    <i className="fa-kit fa-date" />
                                                    <p dangerouslySetInnerHTML={{ __html: eventHeroSection.bannerEventDate }} />
                                                </div>
                                            )}
                                            {event.eventAdditionalDetails?.eventLocation && (
                                                <div className={styles.eventDetailItem}>
                                                    <i className="fa-kit fa-location" />
                                                    <p dangerouslySetInnerHTML={{ __html: event.eventAdditionalDetails.eventLocation }} />
                                                </div>
                                            )}
                                            {event.eventAdditionalDetails?.eventVenue && (
                                                <div className={styles.eventDetailItem}>
                                                    <i className="fa-kit fa-booth" />
                                                    <p dangerouslySetInnerHTML={{ __html: event.eventAdditionalDetails.eventVenue }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.meetTeamContent}>
                                <h2
                                    className={styles.meetTeamHeading}
                                    dangerouslySetInnerHTML={{ __html: eventsSpeakersSection.eventSpeakersHeading }}
                                />
                                {eventsSpeakersSection.eventSpeakersDescription && (
                                    <p
                                        className={styles.meetTeamDescription}
                                        dangerouslySetInnerHTML={{ __html: eventsSpeakersSection.eventSpeakersDescription }}
                                    />
                                )}

                                <div className={styles.teamGrid}>
                                    {teamMembers.map((member: SpeakerMember) => {
                                        const linkedinUrl = member.teamAdditionFields?.socialLinks?.linkedinUrl;
                                        const cardContent = (
                                            <>
                                                <div className={styles.teamImageWrap}>
                                                    {member.featuredImage?.node?.mediaItemUrl && (
                                                        <Image
                                                            src={member.featuredImage.node.mediaItemUrl}
                                                            alt={member.featuredImage.node.altText || member.title || ""}
                                                            width={220}
                                                            height={267}
                                                        />
                                                    )}
                                                </div>
                                                <div className={styles.teamInfo}>
                                                    <div className={styles.profileInfoIcon}>
                                                        <div className={styles.profileInfo}>
                                                            <p className={styles.teamName}>{member.title}</p>
                                                            <p className={styles.teamDesignation}>{member.teamAdditionFields?.teamDesignation}</p>
                                                        </div>
                                                        {linkedinUrl && (
                                                            <div className={styles.iconLink}>
                                                                <Image
                                                                    src={linkedIcon}
                                                                    alt="linkedin icon"
                                                                    width={12}
                                                                    height={12}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        );

                                        return linkedinUrl ? (
                                            <Link key={member.id} href={linkedinUrl} target="_blank" className={styles.teamCard}>
                                                {cardContent}
                                            </Link>
                                        ) : (
                                            <div key={member.id} className={styles.teamCard}>
                                                {cardContent}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.outcomesSection}>
                <div className="container">
                    {(performanceMetricsSection?.metricsHeading || performanceMetricsSection?.metricsDescription) && (
                        <div className={styles.outcomesContainer}>
                            {performanceMetricsSection?.metricsHeading && <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: performanceMetricsSection.metricsHeading }} />}
                            {performanceMetricsSection?.metricsDescription && <p className="sectionDescription" dangerouslySetInnerHTML={{ __html: performanceMetricsSection.metricsDescription }} />}
                        </div>
                    )}
                    {stats && (
                        <Stats
                            stats={stats}
                            className={styles.outcomesStatsWrapper}
                            itemClassName={styles.outcomesStatsItem}
                        />
                    )}
                </div>
            </section>

            {staggeredGridSection?.enableStaggeredGridSection && (
                <UltraSecureDesignSection
                    {...ultraSecureDesignDataDynamic}
                    className={styles.ultraSecureDesignSection}
                    columns={3}
                    numberClassName={styles.customNumberSize}
                />
            )}

            {comparisionTableSection?.ctSectionHeading && (
                <TableSection
                    {...comparisionTableSection}
                />
            )}

            {(event?.singleMediaSection?.singleMediaSectionHeading && event?.singleMediaSection?.singleMediaSectionDescription) ? (
                <SingleMediaSection
                    title={event.singleMediaSection.singleMediaSectionHeading}
                    description={event.singleMediaSection.singleMediaSectionDescription}
                    centerImage={event.singleMediaSection.singleMedia?.node?.mediaItemUrl}
                    mobileImage={event.singleMediaSection.singleMobileMedia?.node?.mediaItemUrl}
                    buttons={!isEventPast && event.singleMediaSection.singleMediaCtaButtons ? event.singleMediaSection.singleMediaCtaButtons.map((btn: any) => ({
                        label: btn.singleMediaButtonText,
                        url: btn.singleMediaButtonUrl?.url,
                        target: btn.singleMediaButtonUrl?.target
                    })) : undefined}
                />
            ) : null}

            {lifeAtDatakrewData && (
                <LifeAtDatakrew {...lifeAtDatakrewData} />
            )}

            {/* Form section: Only show if the event is active (not ended/past) */}
            {!isEventPast && (
                <section className={contactStyles.contactSection}>
                    <div className="container">
                        <div className={`${contactStyles.officeGridContainer} ${styles.cvOfficeGridContainer}`}>
                            <div className={contactStyles.officeGrid}>
                                <h2
                                    className={`sectionTitle ${contactStyles.sectionHeading}`}
                                    dangerouslySetInnerHTML={{ __html: whyChooseData.title }}
                                />
                                {whyChooseData.features?.length > 0 && (
                                    <div className={styles.whyChooseDataKrewFeatures}>
                                        {whyChooseData.features.map((item: FeatureItem, idx: number) => (
                                            <div key={idx} className={styles.whyChooseDataKrewFeature}>
                                                <span className={styles.checkIcon}><i className="fa-kit fa-tick" /></span>
                                                <div>
                                                    <h3 dangerouslySetInnerHTML={{ __html: item.featureHeading || "" }} />
                                                    <p dangerouslySetInnerHTML={{ __html: item.featureDescription || "" }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <ContactFormSection formHeading={twoColumnFormSection.formHeading || "Contact Us"} id='contact'/>
                        </div>
                    </div>
                </section>
            )}

            {prefooterCtaBannerSection && (
                <ContactStripSection {...prefooterCtaBannerSection} />
            )}
        </>
    );

    if (!isEventPast) {
        return (
            <div className={styles.landingPageWrapper}>
                <ActiveEventTheme />
                <LandingHeader 
                    locale={locale} 
                    ctaButtons={ctaButtons} 
                    menuItems={headerData?.menuColumnsSection?.navItems} 
                />
                <div className={styles.activeEventMain}>
                    {pageContent}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.landingPage}>
            {pageContent}
        </div>
    );
}

import type { Metadata } from 'next';
import { getEventCvShowBirminghamPage } from '@/lib/graphql/queries/getEventCvShowBirminghamPage';
import { buildMetadata } from '@/lib/utils/metadata';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Link from "@/components/ui/Link/Link";
import styles from "./page.module.css";
import contactStyles from "@/app/(pages)/[locale]/contact/contactForm.module.css";
import Stats from '@/components/ui/Stats/Stats';
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import TableSection from "@/components/sections/reusable/TableSection/TableSection";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import ContactFormSection from "@/app/(pages)/[locale]/contact/ContactFormSection";
import Image from "@/components/ui/Image/Image";
import CvShowCtaButtons from "./CvShowCtaButtons";
import linkedIcon from "@/public/icons/linkedin-icon.svg";

import { getHeaderMegaMenu } from '@/lib/graphql/queries/getHeaderMegaMenu';
import HeaderCtas from "./HeaderCtas";
import LandingHeader from "./LandingHeader";

export const revalidate = 60;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const event = await getEventCvShowBirminghamPage(locale).catch(() => null);

    const heroTitle = event?.eventHeroSection?.eventHeroHeading;
    return buildMetadata(event?.seo, locale, {
        title: heroTitle || event?.title || "CV Show Birmingham",
        path: 'resources/events/cv-show-birmingham',
    });
}

export default async function EventLandingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const [event, headerData] = await Promise.all([
        getEventCvShowBirminghamPage(locale),
        getHeaderMegaMenu()
    ]);

    if (!event) return null;

    const { eventHeroSection, performanceMetricsSection } = event;

    const ctaButtons = eventHeroSection?.eventHeroCTAButtons?.map((btn: any) => ({
        label: btn.eventButtonText,
        url: btn.eventButtonUrl?.url || '#',
        target: btn.eventButtonUrl?.target,
        pdfUrl: btn.eventButtonText?.toLowerCase().includes('download') ? btn.eventButtonUrl?.url : undefined
    }));

    const stats = performanceMetricsSection?.metricsItems?.map((item: any) => ({
        statsValue: item.metricValue,
        statsDescription: item.metricTitle,
    }));

    const staggeredGridSection = event?.staggeredGridSection || {};
    const ultraSecureDesignDataDynamic = {
        title: staggeredGridSection.gridSectionHeading || "",
        subtitle: staggeredGridSection.gridSectionDescription || "",
        columns: 3,
        cells: staggeredGridSection.gridItems?.map((item: any) => ({
            type: item.gridLayoutStyle?.[0] === "no-border" ? "borderless-content" : "content",
            number: item.gridItemTitle || "",
            description: item.gridItemDescription || "",
            iconClass: item.gridIconClass || "",
            icon: item.gridItemIconImage?.node?.mediaItemUrl || ""
        })) || [],
    };

    const comparisionTableSection = event?.comparisionTableSection || {};
    const contactStripSection = event?.prefooterCtaBannerSection || {};
    const twoColumnFormSection = event?.twoColumnFormSection || {};

    const whyChooseData = {
        title: twoColumnFormSection.twoColumnFormHeading || "Why Choose DataKrew",
        features: twoColumnFormSection.twoColumnDescriptionFeatures || [],
    };

    const meetTheTeamData = event?.eventsSpeakersSection || {};
    const teamMembers = meetTheTeamData.eventSpeakers?.nodes || [];

    return (
        <div className={styles.landingPage}>
            <LandingHeader 
                locale={locale} 
                ctaButtons={ctaButtons} 
                menuItems={headerData?.menuColumnsSection?.navItems} 
            />

            <main>
                <InnerPageBanner
                    className={styles.cvShowBanner}
                    title={eventHeroSection?.eventHeroHeading || event.title}
                    description={eventHeroSection?.eventHeroDescription}
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
                        { label: event.title }
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
                        <CvShowCtaButtons 
                            buttons={ctaButtons} 
                            wrapperClassName={styles.bannerCtaWrapper} 
                            isBanner={true} 
                            id="banner-ctas"
                        />
                    )}
                </InnerPageBanner>
                {meetTheTeamData?.eventSpeakersHeading && (
                    <section className={styles.meetTheTeamSection}>
                        <div className="container">
                            <div className={styles.meetTeamWrapper}>
                                <div className={styles.meetTeamImage}>
                                    <Image src={meetTheTeamData.eventSpeakersBgImage.node.mediaItemUrl} alt="Event image" width={900} height={600} className={styles.eventImage} />
                                    <div className={styles.desktopEventInfoBox}>
                                        <div className={styles.eventInfoInner}>
                                            {event.eventAdditionalDetails?.eventLogo?.node?.mediaItemUrl && (
                                                <img src={event.eventAdditionalDetails.eventLogo.node.mediaItemUrl} alt="Event logo" className={styles.eventLogo} />
                                            )}
                                            <div className={styles.eventDetailsList}>
                                                {event.eventHeroSection?.bannerEventDate && (
                                                    <div className={styles.eventDetailItem}>
                                                        <i className="fa-kit fa-date" />
                                                        <p dangerouslySetInnerHTML={{ __html: event.eventHeroSection.bannerEventDate }} />
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
                                        dangerouslySetInnerHTML={{ __html: meetTheTeamData.eventSpeakersHeading }}
                                    />
                                    <p
                                        className={styles.meetTeamDescription}
                                        dangerouslySetInnerHTML={{ __html: meetTheTeamData.eventSpeakersDescription }}
                                    />

                                    <div className={styles.teamGrid}>
                                        {teamMembers.map((member: any) => (
                                            <div key={member.id} className={styles.teamCard}>
                                                <div className={styles.teamImageWrap}>
                                                    <Image
                                                        src={member.featuredImage?.node?.mediaItemUrl}
                                                        alt={member.featuredImage?.node?.altText || member.title}
                                                        width={220}
                                                        height={267}
                                                    />
                                                </div>
                                                <div className={styles.teamInfo}>
                                                    <div className={styles.profileInfoIcon}>
                                                        <div className={styles.profileInfo}>
                                                            <p className={styles.teamName}>{member.title}</p>
                                                            <p className={styles.teamDesignation}>{member.teamAdditionFields?.teamDesignation}</p>
                                                        </div>
                                                        {member.teamAdditionFields?.socialLinks?.linkedinUrl && (
                                                            <div className={styles.iconLink}>
                                                                <Link href={member.teamAdditionFields.socialLinks.linkedinUrl} target="_blank">
                                                                    <Image
                                                                        src={linkedIcon}
                                                                        alt="linkedin icon"
                                                                        width={12}
                                                                        height={12}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                        columns={3}
                        numberClassName={styles.customNumberSize}
                    />
                )}

                {comparisionTableSection?.ctSectionHeading && (
                    <TableSection
                        {...comparisionTableSection}
                    />
                )}

                

                {whyChooseData.features?.length > 0 && (
                    <section className={contactStyles.contactSection}>
                        <div className="container">
                            <div className={`${contactStyles.officeGridContainer} ${styles.cvOfficeGridContainer}`}>
                                <div className={contactStyles.officeGrid}>
                                    <h2
                                        className={`sectionTitle ${contactStyles.sectionHeading}`}
                                        dangerouslySetInnerHTML={{ __html: whyChooseData.title }}
                                    />
                                    <div className={styles.whyChooseDataKrewFeatures}>
                                        {whyChooseData.features.map((item: any, idx: number) => (
                                            <div key={idx} className={styles.whyChooseDataKrewFeature}>
                                                <span className={styles.checkIcon}><i className="fa-kit fa-tick" /></span>
                                                <div>
                                                    <h3 dangerouslySetInnerHTML={{ __html: item.featureHeading }} />
                                                    <p dangerouslySetInnerHTML={{ __html: item.featureDescription }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                    <ContactFormSection formHeading={twoColumnFormSection.formHeading} id='contact'/>
                                
                            </div>
                        </div>
                    </section>
                )}

                <ContactStripSection {...contactStripSection} />
            </main>

            <footer className={styles.footer}>
                <div className="container">
                    <div>
                        <p>©2026. All rights reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

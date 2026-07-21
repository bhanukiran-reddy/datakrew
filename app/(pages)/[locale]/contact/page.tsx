import type { Metadata } from "next";
import { getSupportedLocalesSync } from "@/lib/config/locales";
import { buildMetadata } from "@/lib/utils/metadata";
import {
  getContactPage,
  getContactPageSeo,
  CONTACT_BANNER_FALLBACK_URL,
  type ContactPageData,
  type ContactBannerSection,
  type ContactInformationSection,
} from "@/lib/graphql/queries/getContactPage";

import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import Image from "@/components/ui/Image/Image";
import ContactFormSection from "./ContactFormSection";
import styles from "./contactForm.module.css";
import { sanitizeHTML } from "@/lib/utils/sanitize";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return getSupportedLocalesSync().map((locale: string) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const page = await getContactPage("contact-us").catch(() => null);
  return buildMetadata(page?.seo || { title: "Contact Us" }, locale, { path: 'contact' });
}

/** Normalize contactInfo from CMS. API can return: array of { infoDetails: { infoIconClass, infoText } } or { infoDetails: [...] } or flat array. */
function getContactInfoDetails(
  section: ContactBannerSection | null | undefined,
): Array<{ infoIconClass?: string; infoText?: string }> {
  if (!section?.contactInfo) return [];
  const raw = section.contactInfo;

  if (Array.isArray(raw)) {
    const mapped: Array<{ infoIconClass?: string; infoText?: string }> = [];
    for (const item of raw as Array<{
      infoDetails?: { infoIconClass?: string | null; infoText?: string | null };
      infoIconClass?: string | null;
      infoText?: string | null;
    }>) {
      if (
        item.infoDetails &&
        (item.infoDetails.infoIconClass != null ||
          item.infoDetails.infoText != null)
      ) {
        mapped.push({
          infoIconClass: item.infoDetails.infoIconClass ?? undefined,
          infoText: item.infoDetails.infoText ?? undefined,
        });
      } else if (item.infoIconClass != null || item.infoText != null) {
        mapped.push({
          infoIconClass: item.infoIconClass ?? undefined,
          infoText: item.infoText ?? undefined,
        });
      }
    }
    return mapped;
  }

  const infoDetails = (
    raw as {
      infoDetails?: Array<{
        infoIconClass?: string | null;
        infoText?: string | null;
      }>;
    }
  ).infoDetails;
  if (Array.isArray(infoDetails)) {
    return infoDetails
      .filter((d) => d?.infoIconClass || d?.infoText)
      .map((d) => ({
        infoIconClass: d.infoIconClass ?? undefined,
        infoText: d.infoText ?? undefined,
      }));
  }
  return [];
}

function ContactBannerBlock({
  section,
}: {
  section: ContactBannerSection | null | undefined;
}) {
  const detailsList = getContactInfoDetails(section);
  if (!detailsList.length) return null;
  return (
    <div className={styles.contactInfoBlock}>
      {detailsList.map((item, i) => (
        <div key={i} className={styles.contactInfoItem}>
          {item.infoIconClass && (
            <i 
              className={`icon fa-kit ${item.infoIconClass}`} 
              aria-hidden 
              style={{ fontSize: i > 0 ? '1.5rem' : undefined }}
            />
          )}
          <span className={styles.contactInfoText} dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.infoText ?? "") }} />
        </div>
      ))}
    </div>
  );
}

function ContactInformationBlock({
  section,
}: {
  section: ContactInformationSection | null | undefined;
}) {
  if (!section) return null;
  const offices = section.officeLocations?.filter(
    (o: { officeTitle?: string | null; officeAddress?: string | null }) =>
      o?.officeTitle || o?.officeAddress,
  );
  const hasOffices = Array.isArray(offices) && offices.length > 0;
  const hasForm = !!(section.formHeading || section.contactForm);
  const sectionTitle = section.sectionHeading;

  return (
    <section className={styles.contactSection}>
      <div className="container">
        <div className={styles.officeGridContainer}>
          {hasOffices && (
            <div className={styles.officeGrid}>
              {sectionTitle && (
                <h2
                  className={`sectionTitle ${styles.sectionHeading}`}
                  dangerouslySetInnerHTML={{ __html: sectionTitle }}
                />
              )}
              {offices!.map((office, i) => (
                <div key={i} className={styles.officeCard}>
                  {office.officeTitle && (
                    <h3 className={styles.officeTitle}>{office.officeTitle}</h3>
                  )}
                  {office.officeAddress && (
                    <p
                      className={styles.officeAddress}
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(office.officeAddress ?? '') }}
                    />
                  )}
                  {office.googleMapImage?.node?.mediaItemUrl && (
                    <div className={styles.officeMapWrap}>
                      <Image
                        src={office.googleMapImage.node.mediaItemUrl}
                        alt={office.officeTitle || "Office map"}
                        width={400}
                        height={240}
                        className={styles.officeMapImage}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {hasForm && (
            <ContactFormSection
              formHeading={section.formHeading ?? undefined}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export const revalidate = 60;

export default async function ContactPage({ params }: Props) {
  await params;

  const page: ContactPageData | null = await getContactPage("contact-us").catch(() => null);

  const banner = page?.contactBannerSection;
  const infoSection = page?.contactInformationSection;
  const prefooter = page?.prefooterCtaBannerSection;

  const bannerTitle = banner?.contactBannerHeading ?? "Contact Us";
  const bannerImage = banner?.contactBannerImage?.node;
  const bannerImageUrl = bannerImage?.mediaItemUrl ?? undefined;
  const bannerMobileImage = banner?.contactMobileBannerImage?.node;
  const bannerMobileImageUrl = bannerMobileImage?.mediaItemUrl ?? undefined;
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Contact" }];

  const backgroundImage =
    bannerImageUrl || CONTACT_BANNER_FALLBACK_URL
      ? {
        url: bannerImageUrl || CONTACT_BANNER_FALLBACK_URL,
        alt: bannerImage?.altText ?? "Contact",
        width: 1920,
        height: 1080,
      }
      : undefined;

  const mobileImage = bannerMobileImageUrl
    ? {
      url: bannerMobileImageUrl,
      alt: bannerMobileImage?.altText ?? "Contact Mobile",
      width: 768,
      height: 1024,
    }
    : undefined;

  return (
    <>
      <InnerPageBanner
        title={bannerTitle}
        breadcrumbItems={breadcrumbItems}
        backgroundImage={backgroundImage}
        mobileImage={mobileImage}
        className={styles.contactBanner}
      >
        <ContactBannerBlock section={banner} />
      </InnerPageBanner>

      <ContactInformationBlock section={infoSection} />

      {prefooter && (
        <ContactStripSection
          prefooterCtaBannerHeading={
            prefooter.prefooterCtaBannerHeading ?? undefined
          }
          prefooterCtaBannerDescription={
            prefooter.prefooterCtaBannerDescription ?? undefined
          }
          prefooterCtaBackgroundImage={
            prefooter.prefooterCtaBackgroundImage?.node
              ? {
                node: {
                  mediaItemUrl:
                    prefooter.prefooterCtaBackgroundImage.node.mediaItemUrl ??
                    undefined,
                },
              }
              : undefined
          }
          id="contactStrip"
        />
      )}
    </>
  );
}

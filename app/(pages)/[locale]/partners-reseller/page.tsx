import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/metadata';
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import PartnersSection from "@/components/sections/reusable/PartnersSection/PartnersSection";
import FleetAgentsSection from "@/components/sections/reusable/FleetAgentsSection/FleetAgentsSection";
import QuantifiedImpactSection from "@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection";
import ContactStripSection from "@/components/sections/reusable/ContactStripSection/ContactStripSection";
import UltraSecureDesignSection from "@/components/sections/reusable/UltraSecureDesignSection/UltraSecureDesignSection";
import { innerBanner } from "./index";
import styles from "./partners.module.css";
import BecomePartnerFormSection from "./BecomePartnerFormSection";
import Stats from '@/components/ui/Stats/Stats';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return buildMetadata({ title: 'Partners & Resellers' }, locale, { path: 'partners-reseller' });
}

export default function PartnersPage() {
    return (
        <>
            <InnerPageBanner
                title={innerBanner.title}
                description={innerBanner.description}
                backgroundImage={innerBanner.backgroundImage}
                mobileImage={innerBanner.mobileImage}
                breadcrumbItems={innerBanner.breadcrumbItems as any}
            >
                <div className={styles.bannerCta}>
                    <Link href={innerBanner.ctaButton.url}>
                        <Button className="primaryCta">
                            {innerBanner.ctaButton.text}
                        </Button>
                    </Link>
                </div>
            </InnerPageBanner>

            <PartnersSection
                title="<span>35+ global </span> OEM compatibility"
                description="Datakrew solutions are play across 35+ OEMs and 100+ vehicle models."
                partners={innerBanner.partners as any}
                paddingTop="5rem"
                className={styles.partnersSectionOverride}
            />
            
            <section className={styles.statsSection}>
                <div className="container">
                    <Stats 
                        stats={innerBanner.stats as any} 
                        className={styles.partnersStatsWrapper}
                        itemClassName={styles.partnersStatsItem}
                    />
                </div>
            </section>

            <UltraSecureDesignSection
                title={innerBanner.capacities.title}
                subtitle={innerBanner.capacities.subtitle}
                columns={innerBanner.capacities.columns}
                cells={innerBanner.capacities.cells as any}
                numberClassName={styles.customNumberSize}
            />

            <FleetAgentsSection
                title={innerBanner.benefits.title}
                subheading={innerBanner.benefits.subheading}
                agents={innerBanner.benefits.agents as any}
                centerImageUrl={innerBanner.benefits.centerImageUrl}
                headerAlign={innerBanner.benefits.headerAlign as any}
                id="partner-benefits"
            />

            <QuantifiedImpactSection
                title={innerBanner.successStories.title}
                titleHighlight={innerBanner.successStories.titleHighlight}
                description={innerBanner.successStories.description}
                slides={innerBanner.successStories.slides as any}
                id="success-stories"
            />
            <BecomePartnerFormSection />

            <ContactStripSection
                title="Join us in building the <span>future of mobility</span>"
                description="Partner with Datakrew to deliver next-gen telematics solutions and unlock new revenue streams."
                ctas={[
                    { text: "Contact Investor Relations", url: "/become-a-partner" },
                    { text: "Download corporate deck", url: "/download-corporate-deck" }
                ]}
                backgroundImageUrl="/prefooter-banner.webp"
            />


        </>
    );
}

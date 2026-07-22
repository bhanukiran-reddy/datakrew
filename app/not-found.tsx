import Link from 'next/link';
import styles from './not-found.module.css';
import Header, { HeaderSkeleton } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer/Footer';
import Image from 'next/image';
import { Suspense } from 'react';
import { getDefaultLocaleSync } from "@/lib/config/locales";
import { getSiteConfig } from "@/lib/config/site";
import { getLanguages } from "@/lib/i18n/getLanguages";
import { getFooterMegaMenu } from "@/lib/graphql/queries/getFooterMegaMenu";
import { getHeaderMegaMenu } from "@/lib/graphql/queries/getHeaderMegaMenu";
import PageWrapper from "@/components/layout/PageWrapper/PageWrapper";

/** Root 404 page. */
export default async function NotFound() {
  const locale = getDefaultLocaleSync();
  const [siteConfig, languages, footerData, headerData] = await Promise.all([
    getSiteConfig(),
    getLanguages(),
    getFooterMegaMenu().catch(() => null),
    getHeaderMegaMenu().catch(() => null),
  ]);

  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header
          locale={locale}
          siteName={siteConfig.name}
          languages={languages}
          headerData={headerData}
        />
      </Suspense>
      <PageWrapper>
        <div className={styles.contentWrapper}>
          <div className={styles.imageContainer}>
            <Image src="/not-found1.svg" alt="Not Found" width={1440} height={440} />
          </div>
          <div className='container'>
            <div className={styles.content}>
              <h2 className={styles.notFoundHeading}>Uh-oh!</h2>
              <p className={styles.description}>
                We couldn’t find the page you’re looking for.
              </p>
              <Link href="/" className="primaryCta">
                Go home <i className="icon fa-kit fa-right-arrow"></i>
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
      <Suspense fallback={<div style={{ height: '400px', backgroundColor: '#0b1d27' }} />}>
        <Footer
          locale={locale}
          siteName={siteConfig.name}
          tagline={siteConfig.defaultDescription}
          footerData={footerData}
        />
      </Suspense>
    </>
  );
}

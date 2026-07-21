import Link from 'next/link';
import styles from './not-found.module.css';
import Image from 'next/image';
import PageWrapper from "@/components/layout/PageWrapper/PageWrapper";

/** Locale-scoped 404 page. */
export default function NotFound() {
  return (
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
  );
}

'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NavItem } from '@/lib/types/cms';
import type { GlobalFooterMegaMenuFields } from '@/lib/graphql/types';
import styles from './Footer.module.css';

export interface FooterProps {
  locale?: string;
  siteName?: string;
  tagline?: string;
  items?: NavItem[];
  /** From getFooterMegaMenu() */
  footerData?: GlobalFooterMegaMenuFields | null;
}

export function FooterSkeleton() {
  return (
    <footer className={`${styles.footer} ${styles.footerLoading}`}>
      <div className="container">
        <div style={{ height: "600px" }} />
      </div>
    </footer>
  );
}

export default function Footer({
  siteName,
  footerData,
  ..._rest
}: FooterProps = {}) {
  void _rest;
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleColumn = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const isLoading = !footerData;

  const logo = footerData?.footerLogo;
  const logoUrl = logo?.footerLogoImage?.node?.mediaItemUrl;
  const logoLinkUrl = logo?.footerLogoLink?.url;

  const menuColumns = footerData?.menuColumnsSection?.menuColumns ?? [];
  const bottom = footerData?.bottomSection;

  const legalLinks = bottom?.legalLinks ?? [];

  const hasLogo = !!logoUrl;
  const hasBottom =
    (bottom?.copyrightText != null && bottom.copyrightText !== '') ||
    legalLinks.length > 0;

  const getLegalHref = (link: (typeof legalLinks)[number]) => link?.legalUrl?.url ?? '';

  // if (!hasLogo && !hasNewsletter && menuColumns.length === 0 && !hasBottom) return null;

  return (
    <footer className={`${styles.footer} ${isLoading ? styles.footerLoading : ''}`}>
      <div className="container">
        {isLoading ? (
          <div style={{ height: '600px' }} /> // More accurate placeholder height for Mega-Menu content
        ) : (
          <>
            <div className={styles.footerMain}>
          <div className={styles.footerLeft}>
            {hasLogo && (
              <div className={styles.logoSection}>
                <Link href={logoLinkUrl || '/'} className={styles.logoLink}>
                  <Image
                    src={logoUrl!}
                    alt={siteName ? `${siteName} Logo` : 'Datakrew Logo'}
                    width={141}
                    height={55}
                    className={styles.logo}
                  />
                </Link>
              </div>
            )}
          </div>
          <div className={styles.links}>
            <div className={styles.column}>
              <ul className={styles.list}>
                {menuColumns.map((col, idx) => {
                  const isStayConnected = col.column?.columnHeading?.toLowerCase() === 'stay connected';
                  return (
                    <li key={idx} className={`${styles.menuColumn} ${openIndex === idx || isStayConnected ? styles.isOpen : ''} ${isStayConnected ? styles.noAccordion : ''}`}>
                      {col.column?.columnHeading && (
                        <p className={styles.space} onClick={() => !isStayConnected && toggleColumn(idx)}>
                          {col.column.columnHeading}
                          {!isStayConnected && (
                            <i className={`${styles.dropdownIconDark} fa-kit fa-dropdown ${openIndex === idx ? styles.rotated : ''}`}></i>
                          )}
                        </p>
                      )}
                      <ul className={`${styles.columnLinks} ${isStayConnected ? styles.socialLinksRow : ''}`}>
                      {col.column?.columnLinks?.map((linkItem, lIdx) => (
                        <li key={lIdx}>
                          {linkItem?.link?.linkUrl?.url ? (
                            <Link
                              href={linkItem.link.linkUrl.url}
                              target={linkItem.link.linkUrl.target || undefined}
                              className={styles.columnLink}
                              aria-label={linkItem.link?.linkText?.toLowerCase().includes('linkedin') ? 'Visit our LinkedIn page' : undefined}
                            >
                              {linkItem.link.linkText && (
                                linkItem.link.linkText.startsWith('fa-') ? (
                                  <i className={`${styles.footerSocialIcon} ${linkItem.link.linkText.includes('linkedin') ? styles.linkedinIcon : ''} icon fa-kit ${linkItem.link.linkText}`}></i>
                                ) : (
                                  <span className={styles.linkText} dangerouslySetInnerHTML={{ __html: linkItem.link.linkText }} />
                                )
                              )}
                            </Link>
                          ) : (
                            <span className={styles.linkTextOnly}>
                              {linkItem?.link?.linkText && (
                                linkItem.link.linkText.startsWith('fa-') ? (
                                  <i className={`${styles.footerSocialIcon} ${linkItem.link.linkText.includes('linkedin') ? styles.linkedinIcon : ''} icon fa-kit ${linkItem.link.linkText}`}></i>
                                ) : (
                                  <span className={styles.linkText} dangerouslySetInnerHTML={{ __html: linkItem.link.linkText }} />
                                )
                              )}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar — only from footerData (mock when USE_MOCK_PAGE_DATA, else CMS or empty) */}
        {hasBottom && (
          <div className={styles.footerBottom}>
            <div className={styles.bottomLeft}>
              {bottom?.copyrightText != null && bottom.copyrightText !== '' && (
                <p className={styles.copyright} suppressHydrationWarning>
                  {bottom.copyrightText.replace(/\b20\d{2}\b/, new Date().getFullYear().toString())}
                </p>
              )}
            </div>
            <div className={styles.bottomCenter}>
              {legalLinks.map((link, index) => {
                const href = getLegalHref(link);
                const label = link?.legalLabel?.trim();
                if (!label && !href) return null;
                return (
                  <Fragment key={index}>
                    {index > 0 && <span className={styles.separator}>|</span>}
                    {href ? (
                      <Link href={href} className={styles.legalLink}>
                        {label ?? ''}
                      </Link>

                    ) : (
                      <span className={styles.legalLink}>{label ?? ''}</span>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </footer>
  );
}

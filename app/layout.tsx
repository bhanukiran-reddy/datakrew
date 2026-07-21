import type { Metadata } from 'next';
import { Lexend_Deca } from 'next/font/google';
import Script from 'next/script';
import { getSiteConfigFallback } from '@/lib/config/site';
import { buildSiteOrganizationJsonLd, buildSiteNavigationJsonLd, buildSiteWebSiteJsonLd } from '@/lib/seo';
import { env, getGraphqlPreconnectOrigin } from '@/lib/env';
import './globals.css';
import UTMTracker from '@/components/common/UTMTracker';
import { GoogleTagManagerHead, GoogleTagManagerNoScript } from '@/components/common/GoogleTagManager';
import ThirdPartyScripts from '@/components/common/ThirdPartyScripts';

const lexendDeca = Lexend_Deca({
  variable: '--font-lexend-deca',
  subsets: ['latin'],
  display: 'swap',
});

const fallback = getSiteConfigFallback();
const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  title: fallback.name || undefined,
  description: fallback.defaultDescription || undefined,
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  openGraph: {
    type: 'website',
    siteName: fallback.name || undefined,
    title: fallback.name || undefined,
    description: fallback.defaultDescription || undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: fallback.name || undefined,
    description: fallback.defaultDescription || undefined,
  },
  robots: {
    index: true, //true for production
    follow: true, //true for production
  },
};

/**
 * Root layout.
 * Sets up fonts, global styles, default metadata (OpenGraph, Twitter), and Organization JSON-LD.
 * The <html lang> is set by the [locale] layout.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fallback = getSiteConfigFallback();
  const organizationJsonLd = buildSiteOrganizationJsonLd();
  const webSiteJsonLd = buildSiteWebSiteJsonLd();
  const navJsonLd = buildSiteNavigationJsonLd([
    { name: 'About Us', url: `${env.siteUrl}/about-us` },
    { name: 'Team', url: `${env.siteUrl}/team` },
    { name: 'Investors', url: `${env.siteUrl}/investors` },
    { name: 'Contact', url: `${env.siteUrl}/contact` },
    { name: 'Book a Demo', url: `${env.siteUrl}/book-a-demo` },
  ]);

  const graphqlPreconnect = getGraphqlPreconnectOrigin();

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* CookieYes — afterInteractive so it never blocks first paint / LCP */}
        <link rel="dns-prefetch" href="https://cdn-cookieyes.com" />
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/5592e7c13fb94efa49e5c80e5609ec8d/script.js"
          strategy="afterInteractive"
        />
        <GoogleTagManagerHead />
        {graphqlPreconnect ? (
          <link rel="preconnect" href={graphqlPreconnect} crossOrigin="anonymous" />
        ) : null}
      </head>
      <body className={lexendDeca.variable} suppressHydrationWarning>
        <GoogleTagManagerNoScript />
        <Script
          src="https://kit.fontawesome.com/d4d59a1c1d.js"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <ThirdPartyScripts />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: webSiteJsonLd }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: navJsonLd }}
        />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <div className="page-wrapper">
          <UTMTracker />
          {children}
        </div>
      </body>
    </html>
  );
}

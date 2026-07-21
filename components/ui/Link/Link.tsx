"use client";

import NextLink from 'next/link';
import type { ReactNode, AnchorHTMLAttributes } from 'react';
import { getDefaultLocaleSync } from '@/lib/config/locales';
import { isAbsoluteUrl, stripDefaultLocalePrefix } from '@/lib/utils/slugUtils';

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  locale?: string;
  children: ReactNode;
  /** Set to true for external links — adds rel="noopener noreferrer" and target="_blank". */
  external?: boolean;
  pdfUrl?: string;
}

/**
 * Locale-aware Link.
 * Default locale (e.g. en) has no prefix: / and /about. Other locales: /fr, /fr/about.
 */
export default function Link({
  href,
  locale,
  children,
  external,
  pdfUrl,
  ...rest
}: LinkProps) {
  const trimmedHref = href?.trim() ?? '';
  const hrefPath =
    trimmedHref && isAbsoluteUrl(trimmedHref)
      ? trimmedHref
      : trimmedHref
        ? stripDefaultLocalePrefix(trimmedHref)
        : trimmedHref;
  const isPdf = hrefPath?.toLowerCase().endsWith('.pdf');
  const isMailOrTel =
    hrefPath?.startsWith('mailto:') || hrefPath?.startsWith('tel:');

  if (external || (hrefPath && isAbsoluteUrl(hrefPath)) || isPdf || isMailOrTel) {
    return (
      <a
        href={hrefPath}
        target="_blank"
        rel="noopener noreferrer"
        download={isPdf ? true : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const defaultLocale = getDefaultLocaleSync();
  const isDefaultLocale = locale === defaultLocale;
  const localizedHref =
    hrefPath && locale && !isDefaultLocale && !hrefPath.startsWith(`/${locale}`)
      ? `/${locale}${hrefPath.startsWith('/') ? '' : '/'}${hrefPath}`
      : hrefPath || '#';

  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If a PDF is attached, save it to session storage so the form can open it after submission
    if (pdfUrl) {
      sessionStorage.setItem('pendingPdfUrl', pdfUrl);
    } else {
      // Clear any previous attempts if they just want to "Reserve"
      sessionStorage.removeItem('pendingPdfUrl');
    }

    if (hrefPath?.startsWith('#')) {
      e.preventDefault();
      const targetId = hrefPath.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without causing a page jump
        window.history.pushState(null, '', hrefPath);
      }
    }
    // Call any original onClick if provided
    if (rest.onClick) {
      rest.onClick(e);
    }
  };

  return (
    <NextLink 
      href={localizedHref} 
      {...rest} 
      onClick={handleHashLinkClick}
    >
      {children}
    </NextLink>
  );
}

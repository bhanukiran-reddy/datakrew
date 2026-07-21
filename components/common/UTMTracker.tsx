"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * UTMTracker component handles capturing marketing parameters from the URL
 * and persisting them in both Cookies (long-term) and sessionStorage (short-term).
 * This ensures that if a user lands on a product page via a tracked link (like a QR code)
 * and later navigates to a form page, their source data is preserved and captured.
 */
function UTMTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const utmKeys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "msclkid",
    ];

    let hasUpdates = false;

    utmKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        // 1. Persist to Cookies (30-day expiry)
        // Cookies are the most robust way to track across page navigations and tab closures
        const date = new Date();
        date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expires = "; expires=" + date.toUTCString();
        document.cookie = `${key}=${value}${expires}; path=/; SameSite=Lax`;
        
        // 2. Persist to sessionStorage as a backup
        // Some internal forms already look for utm_* keys here
        sessionStorage.setItem(`utm_${key}`, value);
        
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      // console.log("UTMTracker: Marketing parameters captured and persisted.");
    }
  }, [searchParams, pathname]);

  return null;
}

export default function UTMTracker() {
  return (
    <Suspense fallback={null}>
      <UTMTrackerInner />
    </Suspense>
  );
}

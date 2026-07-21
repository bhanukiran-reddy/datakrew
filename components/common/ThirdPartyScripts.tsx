"use client";

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function ThirdPartyScripts() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading of tracking scripts to improve initial performance scores
    // This ensures tracking doesn't interfere with LCP and initial interaction
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 4000); // 4 seconds delay

    return () => clearTimeout(timer);
  }, []);

  // Don't burden development with tracking scripts
  if (process.env.NODE_ENV !== 'production') return null;
  if (!shouldLoad) return null;

  return (
    <>
      {/* Zoho PageSense */}
      <Script
        id="zoho-pagesense"
        src="https://cdn-in.pagesense.io/js/60056203055/2783342ce4f14d0c8e582b41e48db3d2.js"
        strategy="lazyOnload"
      />

      {/* GA4 (G-3S9BQ2J34C) loads via GTM container GTM-PF5WKDS4 — no direct gtag here. */}

      {/* RB2B tracking script */}
      <Script id="rb2b-tracking" strategy="lazyOnload">
        {`
          !function () {
            var reb2b = window.reb2b = window.reb2b || []; if (reb2b.invoked) return; reb2b.invoked = true; reb2b.methods = ["identify", "collect"];
            reb2b.factory = function (method) {
              return function () {
                var args = Array.prototype.slice.call(arguments); args.unshift(method); reb2b.push(args); return reb2b;
              };
            };
            for (var i = 0; i < reb2b.methods.length; i++) {
              var key = reb2b.methods[i]; reb2b[key] = reb2b.factory(key);
            }
            reb2b.load = function (key) {
              var script = document.createElement("script"); script.type = "text/javascript"; script.async = true;
              script.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/961Y0H4W9YNG.js.gz";
              var first = document.getElementsByTagName("script")[0]; first.parentNode.insertBefore(script, first);
            };
            reb2b.SNIPPET_VERSION = "1.0.1"; reb2b.load("961Y0H4W9YNG");
          }();
        `}
      </Script>

      {/* Snitcher tracking script (Radar) */}
      <Script id="snitcher-tracking" strategy="lazyOnload">
        {`
          !function(e){"use strict";var t=e&&e.namespace;if(t&&e.profileId&&e.cdn){var i=window[t];if(i&&Array.isArray(i)||(i=window[t]=[]),!i.initialized&&!i._loaded)if(i._loaded)console&&console.warn("[Radar] Duplicate initialization attempted");else{i._loaded=!0;["track","page","identify","group","alias","ready","debug","on","off","once","trackClick","trackSubmit","trackLink","trackForm","pageview","screen","reset","register","setAnonymousId","addSourceMiddleware","addIntegrationMiddleware","addDestinationMiddleware","giveCookieConsent"].forEach((function(e){var a;i[e]=(a=e,function(){var e=window[t];if(e.initialized)return e[a].apply(e,arguments);var i=[].slice.call(arguments);return i.unshift(a),e.push(i),e})})),-1===e.apiEndpoint.indexOf("http")&&(e.apiEndpoint="https://"+e.apiEndpoint),i.bootstrap=function(){var t,i=document.createElement("script");i.async=!0,i.type="text/javascript",i.id="__radar__",i.setAttribute("data-settings",JSON.stringify(e)),i.src=[-1!==(t=e.cdn).indexOf("http")?"":"https://",t,"/releases/latest/radar.min.js"].join("");var a=document.scripts[0];a.parentNode.insertBefore(i,a)},i.bootstrap()}}else"undefined"!=typeof console&&console.error("[Radar] Configuration incomplete")}({
            "apiEndpoint": "radar.snitcher.com",
            "cdn": "cdn.snitcher.com",
            "namespace": "Snitcher",
            "profileId": "8434015"
          });
        `}
      </Script>
    </>
  );
}

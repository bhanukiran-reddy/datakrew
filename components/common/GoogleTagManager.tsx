import Script from 'next/script';
import { GTM_ID } from '@/lib/analytics/gtm';

const GTM_BOOTSTRAP = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

/** GTM head snippet — production only, loads before page hydration. */
export function GoogleTagManagerHead() {
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <Script id="google-tag-manager" strategy="beforeInteractive">
      {GTM_BOOTSTRAP}
    </Script>
  );
}

/** GTM noscript fallback — place immediately after opening <body>. */
export function GoogleTagManagerNoScript() {
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

import type { NextConfig } from 'next';

const defaultLocale = process.env.DEFAULT_LOCALE || 'en';

const nextConfig: NextConfig = {
  compress: true,
  staticPageGenerationTimeout: 300,
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  // Redirects for legacy URLs to new canonical paths
  async redirects() {
    return [
      {
        source: '/demo',
        destination: '/book-a-demo',
        permanent: true,
      },
      
      // ... (rest of simple redirects)
      {
        source: '/demo/:path*',
        destination: '/book-a-demo/:path*',
        permanent: true,
      },
      {
        source: '/company/about-datakrew/:path*',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/company/team/:path*',
        destination: '/team',
        permanent: true,
      },
      {
        source: '/company/investors/:path*',
        destination: '/investors',
        permanent: true,
      },
      {
        source: '/company/termsandconditions/:path*',
        destination: '/termsandconditions',
        permanent: true,
      },
      {
        source: '/customers/ev-oems/:path*',
        destination: '/customer/oem',
        permanent: true,
      },
      {
        source: '/customers/ev-fleets/:path*',
        destination: '/customer/fleet-management',
        permanent: true,
      },
      {
        source: '/company/our-investors/:path*',
        destination: '/investors',
        permanent: true,
      },
      {
        source: '/products/oxred-myfleet/:path*',
        destination: '/tech-stack/software/oxred-myfleet',
        permanent: true,
      },
      {
        source: '/products/itus-max/:path*',
        destination: '/tech-stack/hardware/itus-max',
        permanent: true,
      },
      {
        source: '/company/contact-us/:path*',
        destination: '/contact',
        permanent: true,
      },      
      {
        source: '/company/careers/:path*',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/company/:path*',
        destination: '/about-us',
        permanent: true,
      },
      {
        source: '/resources/faqs/:path*',
        destination: '/tech-stack',
        permanent: true,
      },
      {
        source: '/components/:path*',
        destination: '/tech-stack/hardware/itus-max',
        permanent: true,
      },
      {
        source: '/use-cases/driving-and-ride-analytics',
        destination: 'https://datakrew.com/use-case/driver-behaviour',
        permanent: true,
      },
      {
        source: '/use-cases/ev-predictive-maintenance',
        destination: 'https://datakrew.com/use-case/predictive-maintenance',
        permanent: true,
      },
      {
        source: '/industry/logistics-freight-services',
        destination: 'https://datakrew.com/industry/logistics-delivery',
        permanent: true,
      },
      {
        source: '/industry/logistics-freight-services/:path*',
        destination: 'https://datakrew.com/industry/logistics-delivery',
        permanent: true,
      },
    ];
  },

  // Note: Localized routing is handled by proxy.ts.
  // Root and path-based rewrites are done dynamically there.
  // We keep no config-level rewrites to avoid conflicts with the middleware.
  async rewrites() {
    return [];
  },
  // Fix Turbopack workspace root issue - set explicit root to current directory
  // This resolves the warning about multiple lockfiles
  turbopack: {
    root: process.cwd(),
  },

  images: {
    qualities: [100, 75, 85],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.datakrew.com',
      pathname: '/wp-content/uploads/**',
    },
    {
      protocol: 'https',
      hostname: '**.amazonaws.com',
    },
    {
      protocol: 'https',
      hostname: '**.cloudfront.net',
    },
  ],
    // Use standard 75 quality for optimized balance between speed and clarity.
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: [
              "default-src 'self'",
              // Allow own scripts + all required third-party tracking/analytics
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn-cookieyes.com https://*.cookieyes.com https://player.vimeo.com https://kit.fontawesome.com https://assets.calendly.com https://cdn-in.pagesense.io https://www.googletagmanager.com https://www.google-analytics.com https://ddwl4m2hdecbv.cloudfront.net https://snid.snitcher.com https://static.cloudflareinsights.com https://cdn.snitcher.com https://www.google.com https://www.gstatic.com https://b-code.liadm.com",
              "script-src-elem 'self' 'unsafe-inline' https://cdn-cookieyes.com https://*.cookieyes.com https://player.vimeo.com https://kit.fontawesome.com https://assets.calendly.com https://cdn-in.pagesense.io https://www.googletagmanager.com https://www.google-analytics.com https://ddwl4m2hdecbv.cloudfront.net https://snid.snitcher.com https://static.cloudflareinsights.com https://cdn.snitcher.com https://www.google.com https://www.gstatic.com https://b-code.liadm.com",
              "style-src 'self' 'unsafe-inline' https://cdn-cookieyes.com https://*.cookieyes.com https://assets.calendly.com https://www.google.com https://www.gstatic.com",
              "img-src 'self' data: https: http: blob: https://assets.calendly.com",
              "font-src 'self' data: https://ka-f.fontawesome.com https://ka-p.fontawesome.com https://fonts.gstatic.com https://fonts.googleapis.com",
              "connect-src 'self' https: http: https://ka-f.fontawesome.com https://calendly.com https://www.google-analytics.com https://analytics.google.com https://region1.analytics.google.com https://cloudflareinsights.com https://www.google.com",
              "frame-src 'self' https://player.vimeo.com https://www.youtube.com https://*.youtube.com https://calendly.com https://www.google.com",
              "media-src 'self' blob: https://api.datakrew.com/ https://staging-api.datakrew.com/",
              "frame-ancestors 'none'",
            ].join('; '),
          },  
        ],  
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;

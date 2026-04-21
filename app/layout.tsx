import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

/* ═══════════════════════════════════════════════════════════════════
   SITE-WIDE CONSTANTS — edit these once and every meta/JSON-LD/og image
   picks up the change. The canonical URL is the brand domain (not the
   Vercel alias) so once the domain is wired, nothing else needs to move.
   ═══════════════════════════════════════════════════════════════════ */
const SITE_URL = 'https://www.scriptlevel.com';
const SITE_NAME = 'scriptlevel';
const SITE_TAGLINE = 'five modes, one project';
const SITE_DESCRIPTION =
  'An AI filmmaking tool from words to final cut. Script through board and booth to render — carried as one object, not a file handed between tools.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  keywords: [
    'AI filmmaking',
    'AI video tool',
    'script to screen',
    'screenplay editor',
    'storyboard generator',
    'AI voice casting',
    'video timeline editor',
    'short film production',
    'AI explainer video',
    'generative video',
    'scriptlevel',
    'made by wind',
  ],
  authors: [{ name: 'Made by Wind', url: 'https://madebywind.com' }],
  creator: 'Made by Wind',
  publisher: 'Made by Wind',
  category: 'technology',
  classification: 'AI filmmaking, video production tool',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    creator: '@MadebyWind',
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon', sizes: '180x180' }],
    shortcut: '/favicon.ico',
  },
  referrer: 'strict-origin-when-cross-origin',
  other: {
    'apple-mobile-web-app-title': SITE_NAME,
    'application-name': SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#15151a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'light',
};

/* ═══════════════════════════════════════════════════════════════════
   STRUCTURED DATA (JSON-LD) — Organization, WebSite, SoftwareApplication
   Surfaces Google rich results + feeds AI answer engines with canonical
   facts. Keep entity IDs stable (use the URL as the @id).
   ═══════════════════════════════════════════════════════════════════ */
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Made by Wind',
  url: 'https://madebywind.com',
  logo: `${SITE_URL}/icon`,
  sameAs: [
    'https://twitter.com/MadebyWind',
    'https://www.instagram.com/madebywind/',
    'https://www.threads.com/@madebywind',
    'https://www.linkedin.com/in/narensundar/',
  ],
  brand: [
    { '@type': 'Brand', name: 'scriptlevel', url: SITE_URL },
    { '@type': 'Brand', name: 'candidrender', url: 'https://candidrender.com' },
    { '@type': 'Brand', name: 'object guide' },
    { '@type': 'Brand', name: 'shape draft' },
    { '@type': 'Brand', name: 'album os' },
  ],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-US',
};

const jsonLdSoftwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#app`,
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'MultimediaApplication',
  applicationSubCategory: 'AI video production',
  operatingSystem: 'Web (any modern browser)',
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/opengraph-image`,
  softwareVersion: '0.1',
  publisher: { '@id': `${SITE_URL}/#organization` },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    description: 'Free through v0.1. Paid plans when the remaining modes ship.',
  },
  featureList: [
    'Screenplay editor with shot division (develop)',
    'Storyboard and style lab (visualize)',
    'Voice cards and take comparison (perform)',
    'Timeline and program monitor (assemble)',
    'Render queue and exports gallery (deliver)',
    'Multi-workspace and project grid',
    'Model-agnostic routing (forthcoming)',
  ],
  audience: {
    '@type': 'Audience',
    audienceType: 'Directors and small teams making short-form AI-assisted films',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        {/* Inline — sets --g-sb and --vh before first paint so structural
            grid dividers don't jump on hydration. Keep inline, not deferred. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.documentElement;var sb=function(){r.style.setProperty('--g-sb',(window.innerWidth-r.clientWidth)+'px');};sb();window.addEventListener('resize',sb);r.style.setProperty('--vh',window.innerHeight+'px');window.addEventListener('orientationchange',function(){r.style.setProperty('--vh',window.innerHeight+'px');});})();`,
          }}
        />
        {/* JSON-LD — Organization, WebSite, SoftwareApplication. These
            three entities are sufficient for Google's knowledge panel,
            rich results, and AI answer engines to identify + summarize
            scriptlevel accurately. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApplication) }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <Header />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

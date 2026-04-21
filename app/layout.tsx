import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'scriptlevel — five modes, one project',
  description:
    'An AI filmmaking tool from words to final cut. Five modes. One project.',
  openGraph: {
    title: 'scriptlevel — five modes, one project',
    description:
      'An AI filmmaking tool from words to final cut. Five modes. One project.',
    type: 'website',
    url: 'https://scriptlevel.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'scriptlevel — five modes, one project',
    description:
      'An AI filmmaking tool from words to final cut. Five modes. One project.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set --g-sb and --vh before paint so grid dividers don't jump
            on hydration. Inline on purpose — a deferred next/script tag
            would miss the first frame. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.documentElement;var sb=function(){r.style.setProperty('--g-sb',(window.innerWidth-r.clientWidth)+'px');};sb();window.addEventListener('resize',sb);r.style.setProperty('--vh',window.innerHeight+'px');window.addEventListener('orientationchange',function(){r.style.setProperty('--vh',window.innerHeight+'px');});})();`,
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased bg-white text-gray-900`}>
        <Header />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

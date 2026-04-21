import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "candid render — AI-Powered Architectural Visualization",
  description: "Transform your architectural renders with AI-powered population, editing, and animation. Add realistic humans, enhance your designs, and bring static images to life.",
  keywords: ["architectural visualization", "AI render", "3D population", "architectural animation", "render enhancement"],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "candid render — AI-Powered Architectural Visualization",
    description: "Transform your architectural renders with AI-powered population, editing, and animation.",
    type: "website",
    url: "https://candidrender.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "candid render — AI-Powered Architectural Visualization",
    description: "Transform your architectural renders with AI-powered population, editing, and animation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Set --g-sb to the reserved scrollbar-gutter width so structural-grid
            horizontal dividers (width: 100vw - var(--g-sb)) match the content
            area and don't get clipped under the scrollbar, which would
            visually left-shift them. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var r=document.documentElement;var sb=function(){r.style.setProperty('--g-sb',(window.innerWidth-r.clientWidth)+'px');};sb();window.addEventListener('resize',sb);r.style.setProperty('--vh',window.innerHeight+'px');window.addEventListener('orientationchange',function(){r.style.setProperty('--vh',window.innerHeight+'px');});})();`,
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans antialiased bg-white text-gray-900`}>
        <SmoothScrollProvider>
          <Header />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

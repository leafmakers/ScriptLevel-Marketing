'use client';

import Link from 'next/link';
import Image from 'next/image';
import GridOverlay from './GridOverlay';
import WordmarkSVG from './WordmarkSVG';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
} as const;

const MailSolid = () => (
  <svg {...iconProps}>
    <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v.2l-10 5.8L2 5.7v-.2Zm0 2.5v10.5A2.5 2.5 0 0 0 4.5 21h15a2.5 2.5 0 0 0 2.5-2.5V8l-9.5 5.5a1 1 0 0 1-1 0L2 8Z" />
  </svg>
);
const LinkedinSolid = () => (
  <svg {...iconProps}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.78 2.66 4.78 6.12V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4V9Z" />
  </svg>
);
const InstagramSolid = () => (
  <svg {...iconProps}>
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm5.25-3.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
  </svg>
);
const ThreadsSolid = () => (
  <svg {...iconProps}>
    <path d="M12.2 2C6.7 2 3 5.6 3 12s3.7 10 9.2 10c3.6 0 6.2-1.5 7.6-4.1 1-1.8 1-4 .1-5.6-.9-1.6-2.5-2.6-4.6-2.8-.5-2.4-2.1-3.7-4.5-3.7-1.8 0-3.4.9-4.2 2.3l1.7 1.1c.5-.8 1.4-1.4 2.5-1.4 1.4 0 2.3.8 2.6 2.2-.6 0-1.2 0-1.8.1-2.9.3-4.6 1.8-4.5 3.9.1 1.9 1.7 3.2 3.9 3.2 2 0 3.7-1 4.6-2.9.7.2 1.2.6 1.5 1.1.4.8.4 2-.2 3.1-.9 1.7-2.7 2.6-5.3 2.6-4.1 0-6.7-2.4-6.7-7.8S8.1 4.2 12.2 4.2c3.2 0 5.3 1.4 6.3 4.1l1.9-.7C19.2 4 16.4 2 12.2 2Zm-.7 11c.3 0 .6 0 .9-.1-.5 1.1-1.4 1.7-2.5 1.7-1 0-1.7-.5-1.7-1.3 0-.9 1-1.5 3.3-1.3Z" />
  </svg>
);
const XSolid = () => (
  <svg {...iconProps}>
    <path d="M18.244 2H21l-6.52 7.45L22 22h-6.28l-4.92-6.43L5.1 22H2.34l6.98-7.97L2 2h6.44l4.45 5.88L18.244 2Zm-1.1 18h1.64L7.02 4h-1.7l11.82 16Z" />
  </svg>
);

export default function Footer() {
  const { ref: wordmarkRef, isVisible: wordmarkVisible } = useScrollAnimation(0.25, false);
  return (
    <footer id="site-footer" className="g-section--dark relative z-10 bg-[#15151a]">
      <GridOverlay />

      {/* Brand / Product / Connect — content extracted as locals so the
          mobile (one .g-row per cell — divider via .g-row::after, identical
          mechanism to every other horizontal grid line) and desktop
          (single .g-row with all three side-by-side) layouts share the
          same content without duplication. */}
      {(() => {
        const brand = (
          <div className="flex flex-col md:flex-row md:items-center items-start gap-3 max-w-sm">
            <Link href="/" aria-label="CandidRender" className="flex-shrink-0">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="CandidRender"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-500 min-w-0">
              Complete design communication suite<br />for architecture and industrial design
            </p>
          </div>
        );
        const product = (
          <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://app.candidrender.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Launch App →
                </a>
              </li>
            </ul>
          </>
        );
        const connect = (
          <>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Connect</h3>
            <ul className="flex items-center gap-4">
              <li>
                <a href="mailto:hello@madebywind.com" aria-label="Email" className="inline-flex items-center justify-center text-gray-500 transition-colors hover:text-white">
                  <MailSolid />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/narensundar/" aria-label="LinkedIn" className="inline-flex items-center justify-center text-gray-500 transition-colors hover:text-white">
                  <LinkedinSolid />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/madebywind/" aria-label="Instagram" className="inline-flex items-center justify-center text-gray-500 transition-colors hover:text-white">
                  <InstagramSolid />
                </a>
              </li>
              <li>
                <a href="https://www.threads.com/@madebywind" aria-label="Threads" className="inline-flex items-center justify-center text-gray-500 transition-colors hover:text-white">
                  <ThreadsSolid />
                </a>
              </li>
              <li>
                <a href="https://x.com/MadebyWind" aria-label="X" className="inline-flex items-center justify-center text-gray-500 transition-colors hover:text-white">
                  <XSolid />
                </a>
              </li>
            </ul>
          </>
        );
        return (
          <>
            {/* Mobile: each cell its own .g-row → divider from .g-row::after. */}
            <div className="md:hidden">
              <div className="g-row relative z-[2]">
                <div className="g-cell g-full">{brand}</div>
              </div>
              <div className="g-row relative z-[2]">
                <div className="g-cell g-full">{product}</div>
              </div>
              <div className="g-row relative z-[2]">
                <div className="g-cell g-full">{connect}</div>
              </div>
            </div>
            {/* Desktop / tablet: single row, side-by-side. */}
            <div className="hidden md:block">
              <div className="g-row relative z-[2] footer-main-row">
                <div className="g-cell g-span-6">{brand}</div>
                <div className="g-cell g-span-3">{product}</div>
                <div className="g-cell g-span-3">{connect}</div>
              </div>
            </div>
          </>
        );
      })()}

      {/* Big wordmark row — WordmarkSVG auto-sizes its viewBox to the
          text's natural bbox, then scales proportionally via width:100%.
          No glyph distortion; the wordmark fills the cell edge to edge
          at every breakpoint while keeping the font's real letterforms. */}
      <div
        className="g-row g-row--no-divider relative z-[2]"
        style={{ '--g-inset': '0' } as React.CSSProperties}
      >
        <div ref={wordmarkRef} className="g-cell g-full">
          <WordmarkSVG
            letterSpacing="-0.04em"
            fill="#8b1a1a"
            stroke="#a52222"
            strokeWidth={5}
            textClassName={wordmarkVisible ? 'wordmark-flicker' : ''}
          >
            candidrender
          </WordmarkSVG>
        </div>
      </div>

      {/* Bottom bar row — continuous horizontal marquee */}
      <div
        className="g-row g-row--no-divider relative z-[2]"
        style={{ '--g-inset': '0' } as React.CSSProperties}
      >
        <div className="g-cell g-full p-0">
          <div className="footer-marquee py-1.5 text-xs" style={{ color: '#8b1a1a' }}>
            <div className="footer-marquee__track" aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i}>
                  © {new Date().getFullYear()} <b>Made by Wind</b>. All rights reserved.
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

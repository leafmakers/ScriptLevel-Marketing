'use client';

import Link from 'next/link';
import GridOverlay from './GridOverlay';
import WordmarkSVG from './WordmarkSVG';
import Icon from './Icon';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

type Column = {
  title: string;
  links: { label: string; href?: string; external?: boolean }[];
};

const columns: Column[] = [
  {
    title: 'product',
    links: [
      { label: 'how it works', href: '/#the-shot' },
      { label: 'the five modes', href: '/#five-modes' },
      { label: 'updates · v0.1', href: '/updates' },
      { label: 'faq', href: '/#faq' },
    ],
  },
  {
    title: 'company',
    links: [
      { label: 'made by wind' },
      { label: 'manifesto' },
      { label: 'exciting times' },
      { label: 'contact' },
    ],
  },
  {
    title: 'legal',
    links: [{ label: 'terms' }, { label: 'privacy' }],
  },
  {
    title: 'also from mbw',
    links: [
      { label: 'candidrender' },
      { label: 'object guide' },
      { label: 'shape draft' },
      { label: 'album os' },
    ],
  },
];

const MARQUEE_ITEMS: { icon: 'article' | 'dashboard' | 'mic' | 'movie' | 'rocket_launch'; label: string }[] = [
  { icon: 'article', label: 'develop' },
  { icon: 'dashboard', label: 'visualize' },
  { icon: 'mic', label: 'perform' },
  { icon: 'movie', label: 'assemble' },
  { icon: 'rocket_launch', label: 'deliver' },
];

export default function Footer() {
  const { ref: wordmarkRef, isVisible: wordmarkVisible } =
    useScrollAnimation(0.25, false);

  return (
    <footer
      id="site-footer"
      className="g-section--dark site-footer card-grain card-grain--dark relative z-10"
    >
      <GridOverlay />

      {/* Four columns in one responsive grid — reflows 4 → 2 → 1 */}
      <div
        className="g-row relative z-[2]"
        style={{ '--g-inset': 'clamp(28px, 3.5vw, 40px) clamp(18px, 2vw, 28px)' } as React.CSSProperties}
      >
        {columns.map((col) => (
          <div className="g-cell footer-col" key={col.title}>
            <h4 className="site-footer-head">{col.title}</h4>
            <ul className="site-footer-list">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <Link href={l.href}>{l.label}</Link>
                  ) : (
                    <span>{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Wordmark row — flush to the grid rails on all four sides */}
      <div
        className="g-row g-row--no-divider relative z-[2]"
        style={{ '--g-inset': '0' } as React.CSSProperties}
      >
        <div ref={wordmarkRef} className="g-cell g-full site-footer-wordmark">
          <WordmarkSVG
            fontWeight={900}
            letterSpacing="-0.025em"
            fill="var(--wordmark-red-fill-rest)"
            stroke="var(--wordmark-red-stroke-rest)"
            strokeWidth={2.5}
            flicker={wordmarkVisible}
          >
            scriptlevel
          </WordmarkSVG>
        </div>
      </div>

      {/* Marquee — icons + labels looping */}
      <div
        className="g-row g-row--no-divider relative z-[2]"
        style={{ '--g-inset': '0' } as React.CSSProperties}
      >
        <div className="g-cell g-full p-0">
          <div className="footer-marquee">
            <div className="footer-marquee__track" aria-hidden>
              {Array.from({ length: 14 }).flatMap((_, group) =>
                MARQUEE_ITEMS.map((m, i) => (
                  <span key={`${group}-${i}`}>
                    <Icon name={m.icon} size={14} style={{ color: 'var(--wordmark-red-fill-rest)' }} />
                    {m.label}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="g-row g-row--no-divider relative z-[2]"
        style={{ '--g-inset': '20px' } as React.CSSProperties}
      >
        <div className="g-cell g-full" style={{ textAlign: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.14em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'lowercase',
            }}
          >
            © 2026 made by wind&nbsp;&nbsp;·&nbsp;&nbsp;scriptlevel v0.1
          </span>
        </div>
      </div>
    </footer>
  );
}

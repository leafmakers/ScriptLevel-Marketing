'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import GridOverlay from './GridOverlay';
import Icon from './Icon';

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'the shot', href: '/#the-shot' },
  { label: 'five modes', href: '/#five-modes' },
  { label: 'updates', href: '/updates' },
  { label: 'faq', href: '/#faq' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const io = new IntersectionObserver(
      ([e]) => setFooterVisible(e.isIntersecting),
      { threshold: 0.08 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const hide = footerVisible;

  return (
    <header
      className={`site-header ${scrolled ? 'is-scrolled' : ''} ${hide ? 'is-hidden' : ''}`}
    >
      <nav className="relative">
        <GridOverlay />
        <div
          className="g-row g-row--center relative z-[2]"
          style={{ '--g-row-min': '60px', '--g-inset': '10px' } as React.CSSProperties}
        >
          {/* Full-width cell with flex layout: brand left, actions right.
              This avoids the half-l/half-r split colliding when the actions
              group needs more room than the brand. */}
          <div className="g-cell g-full site-header__row">
            <Link href="/" aria-label="scriptlevel" className="site-header__brand">
              scriptlevel
            </Link>

            <div className="site-header__actions">
              <ul className="site-header__links">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="nav-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <a href="/#open" className="cta-pill-3d site-header__cta">
                <span className="site-header__cta-label">launch</span>
                <Icon name="arrow_outward" size={13} />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

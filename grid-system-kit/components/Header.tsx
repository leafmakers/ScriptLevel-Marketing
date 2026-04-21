'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import GridOverlay from './GridOverlay';

// 3D Pill Button - styled like the slider thumb
function Pill3DButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white text-gray-700 text-xs font-bold tracking-wide transition-all duration-150 ease-out hover:scale-105 active:scale-95"
      style={{
        boxShadow: isPressed
          ? '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(0,0,0,0.05)'
          : '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08), inset 0 -1px 2px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.06)',
        transform: isPressed ? 'translateY(1px)' : 'translateY(0)',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // Nav is always visible so the grid line at its bottom reads cleanly
  // from first paint on mobile. Only hides when the footer intersects.
  const showNav = !footerVisible;

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      footerVisible
        ? 'opacity-0 -translate-y-4 pointer-events-none'
        : showNav
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100'
          : 'bg-transparent border-b border-transparent'
    }`}>
      <nav className="relative">
        <GridOverlay />
        <div className="g-row g-row--center relative z-[2]" style={{ '--g-row-min': '64px', '--g-inset': '16px' } as React.CSSProperties}>
          {/* Logo — left half, reflows cleanly at every breakpoint */}
          <div className="g-cell g-half-l">
            <Link
              href="/"
              className={`flex items-center gap-2 transition-all duration-300 ${
                showNav ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
            >
              <Image
                src="/logo.png"
                alt="CandidRender"
                width={22}
                height={22}
                className="rounded-lg"
              />
              <span className="text-lg font-black tracking-[-0.04em] text-black whitespace-nowrap" style={{ fontFamily: 'var(--font-plus-jakarta), system-ui, sans-serif' }}>candidrender</span>
            </Link>
          </div>

          {/* Actions — right half, content flush-right */}
          <div className="g-cell g-half-r">
            <div className="flex items-center justify-end gap-3">
              <a
                href="https://app.candidrender.com?login=true"
                className="hidden md:inline-flex text-sm font-medium text-gray-500 hover:text-black transition-colors px-4 py-2"
              >
                Login
              </a>
              <div className="hidden md:block">
                <Pill3DButton href="https://app.candidrender.com">
                  Get Started
                </Pill3DButton>
              </div>
              <button
                className="md:hidden p-2 text-gray-600 hover:text-black"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <span className="text-xl">✕</span>
                ) : (
                  <span className="text-xl">☰</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu — stacks below the nav row */}
        {mobileMenuOpen && (
          <div className="g-row g-row--no-divider md:hidden" style={{ borderTop: '1px solid var(--g-divider)', borderBottom: 'none' }}>
            <div className="g-cell g-full">
              <div className="flex flex-col gap-4">
                <a
                  href="https://app.candidrender.com?login=true"
                  className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                  Login
                </a>
                <a
                  href="https://app.candidrender.com"
                  className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                >
                  Launch App →
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
    {mobileMenuOpen && (
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in"
        onClick={() => setMobileMenuOpen(false)}
      />
    )}
    </>
  );
}

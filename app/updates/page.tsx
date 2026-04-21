import type { Metadata } from 'next';
import Link from 'next/link';
import GridOverlay from '@/components/GridOverlay';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
  title: 'scriptlevel — updates · v0.1',
  description:
    'Honest about ship state. What ships today, what is designed and porting, what is forthcoming.',
};

const MODE_ICONS = {
  develop: 'article',
  visualize: 'dashboard',
  perform: 'mic',
  assemble: 'movie',
  deliver: 'rocket_launch',
} as const;

const TODAY: {
  label: string;
  icon?: keyof typeof MODE_ICONS;
  status: 'shipped' | 'porting' | 'forthcoming';
}[] = [
  { label: 'Home dashboard with multi-workspace and project grid', status: 'shipped' },
  { label: 'develop — screenplay editor and shot division', icon: 'develop', status: 'shipped' },
  { label: 'visualize — storyboard and style lab', icon: 'visualize', status: 'porting' },
  { label: 'perform — voice cards and take comparison', icon: 'perform', status: 'porting' },
  { label: 'assemble — timeline and program monitor', icon: 'assemble', status: 'porting' },
  { label: 'deliver — render queue and exports gallery', icon: 'deliver', status: 'porting' },
  { label: 'AI generation wiring to models', status: 'forthcoming' },
  { label: 'Accounts, cloud sync, collaboration', status: 'forthcoming' },
];

export default function Updates() {
  return (
    <>
      {/* ─── Page header ─────────────────────────────────────────── */}
      <section className="relative">
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-full">
            <Reveal>
              <Link
                href="/"
                className="inline-flex items-center gap-2"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: 'var(--gray-500)',
                  textTransform: 'lowercase',
                }}
              >
                <span aria-hidden>←</span> back to home
              </Link>
            </Reveal>

            <Reveal delay={1}>
              <span className="micro-label" style={{ marginTop: 40, display: 'inline-flex' }}>
                updates · v0.1
              </span>
            </Reveal>

            <Reveal delay={2}>
              <h1
                className="type-display"
                style={{
                  marginTop: 16,
                  fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.02,
                  maxWidth: '22ch',
                }}
              >
                Honest about ship state.
              </h1>
            </Reveal>

            <Reveal delay={3}>
              <p className="type-body" style={{ marginTop: 24, maxWidth: 640 }}>
                What ships today, what is designed and porting, what is still forthcoming. Updated as the wiring lands.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Ship state list ─────────────────────────────────────── */}
      <section className="relative">
        <GridOverlay />
        <div
          className="g-row g-row--no-divider section-rhythm--tight relative z-[2]"
          style={{ paddingTop: 0 }}
        >
          <div className="g-cell g-full">
            <Reveal>
              <ul className="dash-list">
                {TODAY.map((item) => (
                  <li key={item.label}>
                    <span aria-hidden />
                    <span className="flex items-center gap-2.5">
                      {item.icon && (
                        <Icon
                          name={MODE_ICONS[item.icon]}
                          size={16}
                          style={{ color: 'var(--foreground)' }}
                        />
                      )}
                      {item.label}
                    </span>
                    <span className={`status-pill status-pill--${item.status}`}>{item.status}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={1}>
              <p
                style={{
                  marginTop: 56,
                  fontStyle: 'italic',
                  fontSize: '1.0625rem',
                  lineHeight: 1.55,
                  color: 'var(--gray-500)',
                  maxWidth: '58ch',
                }}
              >
                The shape is built. The modes are designed. The wiring is what&apos;s next.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

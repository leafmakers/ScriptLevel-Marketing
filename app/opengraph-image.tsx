import { ImageResponse } from 'next/og';

/**
 * Open Graph share image — 1200×630 standard for Facebook, LinkedIn,
 * Slack, Discord, Messages, iMessage, etc.
 *
 * Design: dark surface, large "scriptlevel" wordmark (matches footer),
 * tagline below, mode strip at bottom. Matches the brand at a glance.
 */
export const alt = 'scriptlevel — five modes, one project';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0e0e10',
          color: '#ffffff',
          fontFamily: 'system-ui, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Top row — brand micro-label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 20,
            letterSpacing: '0.18em',
            textTransform: 'lowercase',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 600,
          }}
        >
          <div style={{ width: 44, height: 1, background: 'rgba(255,255,255,0.35)' }} />
          scriptlevel · v0.1
        </div>

        {/* Center — wordmark in production red */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 228,
              fontWeight: 900,
              letterSpacing: '-0.045em',
              color: '#c73535',
              lineHeight: 0.9,
              display: 'flex',
            }}
          >
            scriptlevel
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 900,
              display: 'flex',
            }}
          >
            From script to final cut.
          </div>
        </div>

        {/* Bottom — mode strip */}
        <div
          style={{
            display: 'flex',
            gap: 36,
            fontSize: 22,
            letterSpacing: '0.12em',
            textTransform: 'lowercase',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 500,
          }}
        >
          <span>develop</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span>visualize</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span>perform</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span>assemble</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
          <span>deliver</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from 'next/og';

/**
 * favicon — 32×32 "s" mark on ink surface. Matches the brand header
 * wordmark's opening glyph.
 */
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '-0.06em',
          fontFamily: 'system-ui, sans-serif',
          borderRadius: 6,
        }}
      >
        s
      </div>
    ),
    { ...size }
  );
}

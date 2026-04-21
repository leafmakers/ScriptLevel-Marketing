/**
 * Material Icons — inline SVG path data, sourced from the Google
 * Material Icons set (filled variant). 24×24 viewBox, filled glyphs.
 *
 * Per DESIGN.md §7: use Material Icons family uniformly for arrows + UI
 * glyphs so the visual language stays consistent.
 *
 * Add new icons by extending PATHS below with the 24×24 filled path
 * from https://fonts.google.com/icons (select "Material Icons" style,
 * copy the SVG path data).
 */

type IconName =
  // Arrows
  | 'arrow_outward'
  | 'arrow_forward'
  | 'arrow_downward'
  | 'arrow_right_alt'
  | 'north_east'
  // Mode icons (filled)
  | 'article'       // develop: screenplay document
  | 'dashboard'     // visualize: storyboard grid
  | 'mic'           // perform: microphone (voice cast + takes)
  | 'movie'         // assemble: film / timeline
  | 'rocket_launch' // deliver: render + ship
  // Misc UI (filled)
  | 'check_circle'
  | 'open_in_new';

const PATHS: Record<IconName, string> = {
  // ─── Arrows ─────────────────────────────────────────────────────
  arrow_outward: 'M6 17.59 17.59 6H10V4h11v11h-2V7.41L7.41 19z',
  arrow_forward: 'M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11z',
  arrow_downward: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z',
  arrow_right_alt: 'M16.01 11H4v2h12.01v3L20 12l-3.99-4z',
  north_east: 'M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z',

  // ─── Mode glyphs (filled Material Icons) ────────────────────────
  // article — page with horizontal lines, for "develop" (screenplay)
  article:
    'M19 3H4.99c-1.11 0-1.98.9-1.98 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',

  // dashboard — 2x2 panel grid, for "visualize" (storyboard frames)
  dashboard:
    'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',

  // mic — microphone (solid), for "perform" (voice cast + takes)
  mic:
    'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',

  // movie — film cell / strip, for "assemble" (timeline)
  movie:
    'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',

  // rocket_launch — for "deliver" (render + ship)
  rocket_launch:
    'M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM11.17 17s3.74-1.55 5.89-3.7c5.4-5.4 4.5-9.62 4.21-10.57-.95-.3-5.17-1.19-10.57 4.21C8.55 9.09 7 12.83 7 12.83L11.17 17zm6.48-7.8c-.78.78-2.05.78-2.83 0-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0 .78.78.78 2.05 0 2.83zm-2.3 7.98L17.31 22l4.05-4.05c.47-.47.68-1.15.55-1.81l-.26-1.33c-2.29 2.04-5.58 3.44-5.89 3.57-.13 0-.33-.22-.41-.41zM6.96 16.06L9.11 18.21 4 23l-1.06-1.06 4.02-5.88zm-2.62-1.37l1.33-1.33c-.61-.08-1.36.14-2.01.55l-1.06 1.06 1.74-.28z',

  // ─── Misc UI ────────────────────────────────────────────────────
  check_circle:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  open_in_new:
    'M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z',
};

export type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  'aria-label'?: string;
  style?: React.CSSProperties;
};

export default function Icon({
  name,
  size = 16,
  className = '',
  style,
  'aria-label': ariaLabel,
}: IconProps) {
  const labelled = ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : { 'aria-hidden': true as const };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={{ flexShrink: 0, ...style }}
      {...labelled}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

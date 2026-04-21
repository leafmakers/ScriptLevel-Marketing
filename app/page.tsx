import GridOverlay from '@/components/GridOverlay';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/* ═══════════════════════════════════════════════════════════════════
   SCRIPTLEVEL MARKETING — single-page, anchor-nav site.
   Copy verbatim. Typography + colors per DESIGN.md (Plus Jakarta Sans,
   white / neutral / near-black / gray-scale + wordmark reds).
   ═══════════════════════════════════════════════════════════════════ */

type ModeIcon = 'article' | 'dashboard' | 'mic' | 'movie' | 'rocket_launch';

const MODES: {
  icon: ModeIcon;
  name: string;
  headline: string;
  body: string;
  produces: string;
}[] = [
  {
    icon: 'article',
    name: 'develop',
    headline: 'Write it. Break it down.',
    body: 'Screenplay paper with an outline rail. Every shot block collapses into a card for Visualize.',
    produces: 'scenes · shots',
  },
  {
    icon: 'dashboard',
    name: 'visualize',
    headline: 'Frames first, style second.',
    body: 'Generate variants. Lock the look. A seed makes the next frame rhyme with the last.',
    produces: 'frames',
  },
  {
    icon: 'mic',
    name: 'perform',
    headline: 'Voices with takes.',
    body: 'Six cards, six waveforms. Pick one. Blend two. The line stays anchored to the shot.',
    produces: 'voices',
  },
  {
    icon: 'movie',
    name: 'assemble',
    headline: 'The timeline is the film.',
    body: 'Tracks, playhead, scrubber. The shots you locked upstream are already here.',
    produces: 'clips',
  },
  {
    icon: 'rocket_launch',
    name: 'deliver',
    headline: 'Render, share, review.',
    body: 'A queue that respects your plan. A gallery your director can comment on.',
    produces: 'renders',
  },
];

const SHOT_BLOCKS: { icon: ModeIcon; name: string; body: React.ReactNode }[] = [
  {
    icon: 'article',
    name: 'develop',
    body: (
      <>
        You write a slug line, an action, a line. The shot block highlights the beats. Each beat becomes an index card
        in Shots — a type (<span className="type-mono">MACRO</span>), a duration (
        <span className="type-mono">3.1s</span>), a lens (<span className="type-mono">100mm</span>), a status dot.
      </>
    ),
  },
  {
    icon: 'dashboard',
    name: 'visualize',
    body: (
      <>
        That shot card flows into the storyboard. You generate four frame variants. You lock a style —{' '}
        <em>Ed-Ruscha-ish.</em> A seed (<span className="type-mono">0x7A3F91</span>) anchors consistency across every
        frame you generate next.
      </>
    ),
  },
  {
    icon: 'mic',
    name: 'perform',
    body: (
      <>
        Narrator voice-over needs casting. Six voice cards, six waveforms. You record two takes of{' '}
        <em>&ldquo;Microbes wake. Heat builds. The pile breathes without lungs.&rdquo;</em> You pick one. Or blend them.
      </>
    ),
  },
  {
    icon: 'movie',
    name: 'assemble',
    body: (
      <>
        The shot, its locked frames, and the chosen voice take land on the timeline. A program monitor. A scrubber. A
        playhead. You nudge timing.
      </>
    ),
  },
  {
    icon: 'rocket_launch',
    name: 'deliver',
    body: (
      <>
        The render queue picks it up. A pill at the top of the screen reads <span className="render-pill">42%</span>.
        When it&apos;s done, a comment-able link drops into your exports gallery.
      </>
    ),
  },
];

/* FAQ entries — rendered as visible JSX AND emitted as JSON-LD
   FAQPage schema below for rich results + AI answer ingestion. */
const FAQS: { q: string; a: string }[] = [
  {
    q: 'Who is this for?',
    a: 'Directors and small teams making short-form AI-assisted films — explainers, ads, music videos, short films, docs.',
  },
  {
    q: "What's here today?",
    a: 'The home dashboard, multi-workspace, project creation, and Develop mode. The other four modes are designed and porting.',
  },
  {
    q: 'Does it generate video?',
    a: 'Not yet. The UI is built around generation; model wiring is next.',
  },
  {
    q: 'Which models will it use?',
    a: 'Model-agnostic routing, per shot. Specifics announced when the wiring lands.',
  },
  {
    q: 'Does it replace my editor?',
    a: 'It gets shots onto a timeline. For heavy finishing, you’ll still open Premiere or Resolve.',
  },
  {
    q: 'Is it collaborative?',
    a: 'The shape is built for it; real-time is not yet wired.',
  },
  {
    q: 'Is my work safe?',
    a: 'v0.1 persists to your browser’s localStorage. Cloud persistence and accounts are next.',
  },
  {
    q: 'What will it cost?',
    a: 'Free through v0.1. Paid plans when the remaining modes ship.',
  },
];

// Shared heading style — Plus Jakarta bold, tight tracking.
const HEADING_STYLE: React.CSSProperties = {
  fontSize: 'clamp(1.875rem, 4.5vw, 3.25rem)',
  lineHeight: 1.08,
  fontWeight: 700,
  letterSpacing: '-0.02em',
};

/* FAQPage JSON-LD — shipped once to Google + answer engines.
   Keeps the visible copy as the source of truth. */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://www.scriptlevel.com/#faq',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      {/* FAQPage JSON-LD — emitted into the same document as the FAQ
          section so Google and AI engines can verify the visible copy
          matches the structured data. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ═══════════════ 1 — HERO ═══════════════ */}
      <section id="hero" className="relative">
        <GridOverlay />
        <div className="g-row g-row--no-divider section-rhythm--loose relative z-[2]">
          <div className="g-cell g-full" style={{ textAlign: 'center' }}>
            <Reveal>
              <div className="micro-label" style={{ justifyContent: 'center' }}>
                scriptlevel&nbsp;&nbsp;·&nbsp;&nbsp;v0.1
              </div>
            </Reveal>

            <Reveal delay={1}>
              <h1
                className="type-display mt-8"
                style={{
                  fontSize: 'clamp(2.75rem, 7.5vw, 6.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 0.98,
                }}
              >
                From script to{' '}
                <span style={{ display: 'inline-block' }}>final&nbsp;cut.</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p
                className="type-body mx-auto mt-7"
                style={{
                  maxWidth: 620,
                  fontSize: 'clamp(1.0625rem, 1.25vw, 1.1875rem)',
                }}
              >
                An AI filmmaking tool from words to final cut. Script through board and booth to render — carried as one
                object, not a file handed between tools.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <a href="#open" className="cta-primary">
                  start something
                  <Icon name="arrow_outward" size={14} />
                </a>
                <a href="#the-shot" className="cta-secondary">
                  see the shape
                </a>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <p
                className="mt-12"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: 'var(--gray-400)',
                  textTransform: 'lowercase',
                }}
              >
                from the studio behind candidrender
              </p>
            </Reveal>

            {/* Horizontal breathing dash — subtle scroll affordance */}
            <Reveal delay={5}>
              <div style={{ marginTop: 80 }}>
                <span aria-hidden className="hero-dash" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 2 — THE PROBLEM ═══════════════ */}
      <section id="problem" className="relative">
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-span-3 g-sm-full">
            <Reveal>
              <span className="micro-label">the problem</span>
            </Reveal>
          </div>
          <div className="g-cell g-span-9 g-sm-full">
            <Reveal delay={1}>
              <h2 className="type-heading" style={{ ...HEADING_STYLE, maxWidth: '18ch' }}>
                Making a short film with AI today is a stack of open tabs.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="type-body mt-8" style={{ maxWidth: 640 }}>
                A script doc. A generation tool. A voice tool. A timeline. A review link. Context drops at every
                boundary. Consistency — of character, of style, of voice — is the work, and the tools aren&apos;t built
                for it.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="g-row g-row--no-divider relative z-[2]">
          <div className="g-cell g-full">
            <Reveal>
              <p className="pull-quote">
                <em>Every scrap is a decision.</em> — line from the demo project
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 3 — THE SHOT ═══════════════ */}
      <section id="the-shot" className="relative" style={{ background: 'var(--neutral-50)' }}>
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-span-3 g-sm-full">
            <Reveal>
              <span className="micro-label">one shot, all the way through</span>
            </Reveal>
          </div>
          <div className="g-cell g-span-9 g-sm-full">
            <Reveal delay={1}>
              <h2 className="type-heading" style={{ ...HEADING_STYLE, maxWidth: '20ch' }}>
                A single shot, carried from script to render.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="type-body mt-8" style={{ maxWidth: 640 }}>
                This is what the product does, told through one beat from the demo project —{' '}
                <em>sc 03 · microbes.</em>
              </p>
            </Reveal>
          </div>
        </div>

        {/* Five shot blocks — icon + label left, body right */}
        <div
          className="g-row g-row--no-divider relative z-[2]"
          style={{ '--g-inset': '0 var(--g-pad)' } as React.CSSProperties}
        >
          <div className="g-cell g-full">
            <div
              style={{
                borderTop: '1px solid var(--gray-200)',
                borderBottom: '1px solid var(--gray-200)',
              }}
            >
              {SHOT_BLOCKS.map((blk, i) => (
                <Reveal key={blk.name} delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
                  <article className="shot-block">
                    <header className="shot-block__head">
                      <span className="shot-block__glyph" aria-hidden>
                        <Icon name={blk.icon} size={22} />
                      </span>
                      <span className="shot-block__label">{blk.name}</span>
                    </header>
                    <div className="shot-block__body">{blk.body}</div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="g-row g-row--no-divider relative z-[2]">
          <div className="g-cell g-full" style={{ textAlign: 'center', paddingBlock: 'clamp(48px, 8vh, 96px)' }}>
            <Reveal>
              <p className="pull-quote" style={{ maxWidth: '40ch', margin: '0 auto' }}>
                <em>Same shot. One project tree. No re-plumbing between stages.</em>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 4 — THE FIVE MODES ═══════════════ */}
      <section id="five-modes" className="relative">
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-span-3 g-sm-full">
            <Reveal>
              <span className="micro-label">each mode, in one sentence</span>
            </Reveal>
          </div>
          <div className="g-cell g-span-9 g-sm-full">
            <Reveal delay={1}>
              <h2 className="type-heading" style={{ ...HEADING_STYLE, maxWidth: '18ch' }}>
                Five modes. One project.
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Bento cluster — one full-width grid cell that spans between
            the outer rails, then a .bento container INSIDE it that has
            uniform `var(--g-pad)` padding on all four sides. That inset
            is measured from the grid rails (not the viewport), so the
            cluster reads as a contained unit with symmetric breathing
            room on every side. Cards pack with a flat 16px gap. */}
        <div
          className="g-row g-row--no-divider relative z-[2]"
          style={{ '--g-inset': '0' } as React.CSSProperties}
        >
          <div className="g-cell g-full">
            <div className="bento">
              {MODES.map((m, i) => {
                const isLast = i === MODES.length - 1;
                return (
                  <Reveal
                    key={m.name}
                    delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
                    className={isLast ? 'bento__slot bento__slot--full' : 'bento__slot'}
                  >
                    <article className="mode-card">
                      <header className="mode-card__head">
                        <span className="mode-card__glyph" aria-hidden>
                          <Icon name={m.icon} size={20} />
                        </span>
                        <span className="mode-card__label">{m.name}</span>
                      </header>
                      <h3 className="mode-card__headline">{m.headline}</h3>
                      <p className="mode-card__body">{m.body}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 5 — THE PROJECT TREE ═══════════════ */}
      <section id="project-tree" className="relative" style={{ background: 'var(--neutral-50)' }}>
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-span-3 g-sm-full">
            <Reveal>
              <span className="micro-label">how the app is structured</span>
            </Reveal>
          </div>
          <div className="g-cell g-span-9 g-sm-full">
            <Reveal delay={1}>
              <h2 className="type-heading" style={{ ...HEADING_STYLE, maxWidth: '22ch' }}>
                One workspace. One project. Five lenses on the same tree.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="type-body mt-6" style={{ maxWidth: 600 }}>
                A workspace holds projects. A project is one film. Each mode is a lens on the same project tree — not a
                separate document, not a separate app.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Simplified file-tree diagram: workspace → project → modes → objects */}
        <div className="g-row g-row--no-divider relative z-[2]">
          <div className="g-cell g-full">
            <Reveal>
              <div className="tree" aria-label="project tree diagram">
                <div className="tree__row tree__row--root">
                  <span className="tree__kind">workspace</span>
                  <span className="tree__label">personal</span>
                  <span className="tree__hint">· studio · agency</span>
                </div>

                <div className="tree__row tree__row--child">
                  <span className="tree__branch" aria-hidden>└─</span>
                  <span className="tree__kind">project</span>
                  <span className="tree__label">how compost works</span>
                  <span className="tree__hint">· explainer</span>
                </div>

                {MODES.map((m, i) => (
                  <div key={m.name} className="tree__row tree__row--grandchild">
                    <span className="tree__branch" aria-hidden>
                      {'    '}
                      {i === MODES.length - 1 ? '└─' : '├─'}
                    </span>
                    <Icon name={m.icon} size={16} className="tree__icon" />
                    <span className="tree__label">{m.name}</span>
                    <span className="tree__hint">
                      produces <span className="tree__objs">{m.produces}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 6 — PRODUCTION DISCIPLINE ═══════════════ */}
      <section id="production-discipline" className="relative">
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-span-3 g-sm-full">
            <Reveal>
              <span className="micro-label">why this isn&apos;t another generation tool</span>
            </Reveal>
          </div>
          <div className="g-cell g-span-9 g-sm-full">
            <Reveal delay={1}>
              <h2 className="type-heading" style={HEADING_STYLE}>
                Format. Versions. Queues. Review.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="type-body mt-6" style={{ maxWidth: 600 }}>
                Generation tools give you clips. scriptlevel gives you a project — with the discipline that short-form
                production actually runs on.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <ul className="discipline-list" style={{ maxWidth: 680 }}>
                <li>
                  <strong>Screenplay format</strong> as a first-class document, not a workaround
                </li>
                <li>
                  <strong>Shot codes</strong>, lenses, durations, statuses — the metadata of real production
                </li>
                <li>
                  <strong>Versions</strong> on every shot, every frame, every take
                </li>
                <li>
                  <strong>Render queue</strong> with explicit progress and retry
                </li>
                <li>
                  <strong>Review</strong> with comment-able links, time-pinned threads
                </li>
                <li>
                  <strong>Model-agnostic</strong> — route shots to the model that fits{' '}
                  <em style={{ color: 'var(--gray-400)' }}>(forthcoming)</em>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 7 — WHO IT'S FOR ═══════════════ */}
      <section id="who" className="relative" style={{ background: 'var(--neutral-50)' }}>
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-span-3 g-sm-full">
            <Reveal>
              <span className="micro-label">built for</span>
            </Reveal>
          </div>
          <div className="g-cell g-span-9 g-sm-full">
            <Reveal delay={1}>
              <h2 className="type-heading" style={{ ...HEADING_STYLE, maxWidth: '20ch' }}>
                Directors and small teams making short-form work.
              </h2>
            </Reveal>
            <Reveal delay={2}>
              <p className="type-body mt-8" style={{ maxWidth: 640 }}>
                Explainers. Ads. Music videos. Short films. Docs. Anyone making a film under five minutes who has been
                juggling four tools and losing a shot&apos;s worth of context at every handoff.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ 8 — FAQ ═══════════════ */}
      <section id="faq" className="relative">
        <GridOverlay />
        <div className="g-row section-rhythm relative z-[2]">
          <div className="g-cell g-span-3 g-sm-full">
            <Reveal>
              <span className="micro-label">faq</span>
            </Reveal>
          </div>
          <div className="g-cell g-span-9 g-sm-full">
            {FAQS.map((item) => (
              <Reveal key={item.q}>
                <div className="faq-pair">
                  <h3
                    className="type-heading"
                    style={{
                      fontSize: '1.25rem',
                      lineHeight: 1.3,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                      color: 'var(--foreground)',
                    }}
                  >
                    {item.q}
                  </h3>
                  <p className="type-body mt-3" style={{ maxWidth: '62ch' }}>
                    {item.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ 9 — FINAL CTA ═══════════════ */}
      <section id="open" className="relative">
        <GridOverlay />
        <div className="g-row g-row--no-divider section-rhythm--loose relative z-[2]">
          <div className="g-cell g-full" style={{ textAlign: 'center' }}>
            <Reveal>
              <h2
                className="type-display"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  lineHeight: 0.98,
                }}
              >
                Start something.
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <p
                className="mt-6"
                style={{
                  fontStyle: 'italic',
                  fontSize: '1.125rem',
                  color: 'var(--gray-500)',
                }}
              >
                A name and a hunch is enough.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <div className="mt-10">
                <a href="https://www.scriptlevel.com/app" className="cta-primary">
                  open scriptlevel
                  <Icon name="arrow_outward" size={14} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

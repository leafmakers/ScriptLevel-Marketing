import type { MetadataRoute } from 'next';

const SITE_URL = 'https://scriptlevel.com';

/**
 * robots.txt — emitted by Next's built-in Metadata Routes API.
 *
 * Allows all known legitimate crawlers, including the AI answer-engine
 * bots (ChatGPT-User, PerplexityBot, Claude-Web, GoogleOther). Named
 * disallows are reserved for admin / preview routes if we ever add them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // Explicitly opt into AI answer engines — some crawlers respect
      // named userAgent rules even when '*' already allows.
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot'],
        allow: '/',
      },
      {
        userAgent: ['PerplexityBot', 'Perplexity-User'],
        allow: '/',
      },
      {
        userAgent: ['ClaudeBot', 'Claude-Web', 'anthropic-ai'],
        allow: '/',
      },
      {
        userAgent: ['Google-Extended', 'GoogleOther'],
        allow: '/',
      },
      {
        userAgent: ['Applebot', 'Applebot-Extended'],
        allow: '/',
      },
      {
        userAgent: ['CCBot', 'cohere-ai', 'Meta-ExternalAgent', 'Bytespider'],
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

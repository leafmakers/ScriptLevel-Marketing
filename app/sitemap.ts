import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.scriptlevel.com';

/**
 * sitemap.xml — Next's built-in Metadata Routes generator.
 *
 * lastModified uses build time so fresh deploys show as "recent" to
 * crawlers. changeFrequency / priority are soft hints; real signal
 * comes from actual update cadence + internal linking.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/updates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
}

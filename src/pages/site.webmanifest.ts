import type { APIRoute } from 'astro';
import { copy, DEFAULT_LANG, site } from '../content/site';

export const prerender = true;

/**
 * Generated rather than kept as a static file in public/: the description used
 * to be a hand-maintained copy of the one in site.ts, and it silently went
 * stale when the brand copy changed. Deriving it means it cannot drift again.
 */
export const GET: APIRoute = () => {
  const t = copy[DEFAULT_LANG];
  const manifest = {
    name: site.name,
    short_name: site.shortName,
    lang: t.htmlLang,
    dir: 'ltr',
    description: t.meta.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#070c09',
    theme_color: '#070c09',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};

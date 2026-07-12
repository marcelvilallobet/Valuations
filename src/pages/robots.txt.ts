/**
 * robots.txt generado en build: la URL del sitemap sale de astro.config.mjs,
 * que a su vez lee el dominio real que inyecta Netlify. Cero mantenimiento.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};

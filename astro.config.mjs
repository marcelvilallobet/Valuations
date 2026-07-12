import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * DOMINIO — no hace falta tocar nada:
 * Netlify inyecta automáticamente la variable de entorno URL con el dominio
 * real del sitio en cada build (incluido cuando cambies a dominio propio).
 * El fallback solo se usa en local, donde el sitemap da igual.
 */
const SITE_URL = process.env.URL || 'http://localhost:4321';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  output: 'static',
});

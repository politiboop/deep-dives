import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Every page is built from data files at build time, so the site is static.
// The adapter is here for Vercel web analytics, as on election-rigging.
export default defineConfig({
  site: 'https://deep-dives-gamma.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
});

import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Every page is built from data files at build time, so the site is static.
// The adapter is here for Vercel web analytics, as on election-rigging.
export default defineConfig({
  site: 'https://deep-dives.vercel.app',
  output: 'static',
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
});

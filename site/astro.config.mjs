import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ryo-solo.github.io',
  base: '/loop-lab',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          ja: 'ja',
        },
      },
    }),
  ],
});

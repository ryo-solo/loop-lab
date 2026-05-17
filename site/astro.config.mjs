import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://loop-lab.pages.dev',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});

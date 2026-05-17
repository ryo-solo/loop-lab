import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ryo-solo.github.io',
  base: '/loop-lab',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});

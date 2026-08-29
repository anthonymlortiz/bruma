// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bruma.do',
  compressHTML: true,
  build: {
    // A single page: inlining the stylesheet removes a render-blocking round trip.
    inlineStylesheets: 'always',
    assets: '_assets',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  devToolbar: { enabled: false },
});

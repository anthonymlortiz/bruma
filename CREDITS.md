# Credits and licences

## Brand artwork

The BRUMA JARABACOA logo in `logos/` is the approved brand artwork, supplied by
the client. All rights reserved.

The ivory lockup and mark in `src/assets/brand/`, the favicons in `public/`, and
the social preview image are derived from that artwork by
`scripts/build-assets.mjs`. The derivation reverses the artwork for dark mode
only — the cream ground is keyed to transparency and the ink is refilled in
ivory. Geometry, typography, letter-spacing and proportions are unchanged.

## Photography

All photographs are client-owned originals of Jarabacoa, Dominican Republic.
No stock or third-party imagery is used anywhere on the site.

| Asset | Source file | Notes |
| --- | --- | --- |
| `hero-ridges.jpg` | `pics/los lalos 4k.jpg` | Aerial, forested ridges |
| `mountain-air.jpg` | `pics/dew-web.jpg` | A dew-covered spider's web suspended over the valley at dawn. Converted from `pics/intimate/IMG_7707.HEIC` with `sips`. Needs no `tone` override — it already grades close to the hero |
| `valley-range.jpg` | `pics/mist-river-dawn.jpg` | A river of mist through the valley at dawn, royal palm in the foreground, layered ridges behind. Converted from `pics/early_morning/IMG_7698.HEIC` with `sips` |
| `rolling-hills.jpg` | `pics/los lalos4 4k.jpg` | Aerial, rolling hills |
| `closing-light.jpg` | `pics/los lalos1 4k.jpg` | The jagged ridge, mist along its flank, that the brand mark was drawn from |

Each is cropped and colour-graded in `scripts/build-assets.mjs`; the originals in
`pics/` are untouched.

Raw HEIC originals live in `pics/newer_pics/`, `pics/early_morning/` and
`pics/intimate/` and are excluded from version control for size. They are not
required to build the site.

## Typefaces

Both are self-hosted in `public/fonts` and used under the
[SIL Open Font License 1.1](https://openfontlicense.org).

- **Cormorant Garamond** — Christian Thalmann, Catharsis Fonts.
  <https://fonts.google.com/specimen/Cormorant+Garamond>
- **Jost*** — Owen Earl, indestructible type*.
  <https://fonts.google.com/specimen/Jost>

## Software

- [Astro](https://astro.build) — MIT
- [sharp](https://sharp.pixelplumbing.com) — Apache-2.0
- [puppeteer-core](https://pptr.dev) — Apache-2.0 (optional, screenshots only;
  not a project dependency)

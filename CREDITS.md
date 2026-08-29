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
The site carries no third-party imagery.

| Asset | Source file | Notes |
| --- | --- | --- |
| `hero-ridges.jpg` | `pics/los lalos 4k.jpg` | Aerial, forested ridges |
| `mountain-air.jpg` | `pics/dew-web.jpg` | A dew-covered spider's web with the bruma lying over the valley behind it at dawn. Converted from `pics/intimate/IMG_7707.HEIC` with `sips`. Cropped to the top-left of the frame to keep the mist and to leave a private red-roofed house outside the right edge; carries a `tone` override to bring the bright mist back to the hero's `L 0.39` |
| `valley-range.jpg` | `pics/mist-river-dawn.jpg` | A river of mist through the valley at dawn, royal palm in the foreground, layered ridges behind. Converted from `pics/early_morning/IMG_7698.HEIC` with `sips` |
| `pinar-valley.jpg` | `pics/pinar-valley.jpg` | Pines framing the hills, which fade into blue haze behind. Converted from `pics/pine/IMG_2024.heic` with `sips`. Cropped below the sky: a band that keeps the sky grades to `L 0.47` with a blue bias of `-0.6`, while this crop lands at `L 0.36 / -22` and needs no `tone` |
| `closing-light.jpg` | `pics/los lalos1 4k.jpg` | The jagged ridge, mist along its flank, that the brand mark was drawn from |

Each is cropped and colour-graded in `scripts/build-assets.mjs`; the originals in
`pics/` are untouched.

Raw HEIC originals live in `pics/newer_pics/`, `pics/early_morning/`,
`pics/intimate/` and `pics/pine/` and are excluded from version control for
size. They are not
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

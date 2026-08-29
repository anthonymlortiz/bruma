# BRUMA JARABACOA

The brand site for **BRUMA JARABACOA** — [bruma.do](https://bruma.do).

A single-page, statically generated site introducing Bruma as an umbrella brand
while its projects are being developed. No booking, no rates, no renderings.

## Stack

[Astro 7](https://astro.build), static output, **zero client framework**. The
only runtime JavaScript is ~40 lines of vanilla script for scroll reveals and
parallax, and everything it does is optional — the page is complete and readable
with JavaScript disabled.

Runtime dependencies are deliberately minimal: `astro` and `sharp`.
`@astrojs/check` and `typescript` are dev-only.

## Commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server on `localhost:4321` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run check` | Astro type/diagnostic check |
| `npm run assets` | Regenerate brand + photography assets (see below) |
| `npm run fonts` | Re-download and self-host the webfonts |

`assets` and `fonts` are **not** part of `build`. Their output is committed, so
a normal build and deploy never needs to touch the source photography.

## Structure

```
scripts/
  build-assets.mjs   Brand marks, favicons, OG image, photography grade + crops
  fetch-fonts.mjs    Downloads Cormorant Garamond + Jost, writes fonts.css
  shoot.mjs          Optional: screenshots at 4 viewports (see Verifying)
src/
  assets/brand/        Derived ivory logo lockup + mark
  assets/photography/  Derived, graded, pre-cropped photographs
  components/          Hero, Intro, Sequence, Plate, Closing, SiteFooter
  content/site.ts      All copy and links — edit here, not in markup
  layouts/Base.astro   <head>, metadata, JSON-LD, fonts, skip link
  pages/index.astro    Page composition + reveal/parallax script
  styles/              Design tokens, baseline, generated @font-face rules
public/                Favicons, OG image, fonts, robots, sitemap, CNAME
logos/                 Approved brand artwork (source of truth — do not edit)
pics/                  Source photography
```

### Editing copy

All wording lives in `src/content/site.ts`. The three sequence captions
("Mountain air", "Unhurried living", "Rooted in Jarabacoa") live in
`src/components/Sequence.astro`.

### Adding a section

Create a component in `src/components/`, then drop it into
`src/pages/index.astro`. Use `data-reveal` on an element to have it fade up on
scroll, and `data-parallax` on a media wrapper to give its image gentle drift.
Both are no-ops under `prefers-reduced-motion`.

## The logo

`logos/` holds the approved artwork and is the source of truth. The site never
ships it directly — `scripts/build-assets.mjs` reverses it for dark mode by
keying the cream ground to alpha and re-inking the result in ivory. The mountain
silhouette, mist, typography, letter-spacing and proportions are preserved
pixel-for-pixel; only the outer clear space is trimmed (and reapplied in CSS).

**Do not redraw or retype the logo.** If the artwork changes, replace the file in
`logos/` and re-run `npm run assets`.

## Photography

`scripts/build-assets.mjs` owns the look. Each photograph is cropped and graded
at build time rather than in CSS — these are wide aerial and phone frames, and
letting the browser crop them leaves far too much bright sky for a dark palette.

Adding a photograph:

```js
{
  src: 'my-photo.jpg',                                  // file in pics/
  out: 'my-photo',                                      // src/assets/photography/
  crop: { left: 0, top: 560, width: 3840, height: 1600 }, // optional, pre-resize
  width: 2600,                                          // longest edge
  tone: { brightness: 0.82 },                           // optional grade override
}
```

Then `npm run assets` and import it in a component. Astro generates the
responsive AVIF/WebP/JPEG variants at build time.

### HEIC sources

`sharp`'s bundled libheif rejects iPhone HEICs from this camera
(*"Number of references in iref box exceeds the security limits"*). Convert once
with macOS `sips` and commit the JPEG, keeping the build portable:

```sh
sips -s format jpeg -s formatOptions best pics/newer_pics/IMG_7702.HEIC \
  --out pics/mist-through-the-hills.jpg
```

## Fonts

Cormorant Garamond (display) and Jost (text) are self-hosted from `public/fonts`
— no Google Fonts request at runtime. Only `latin` and `latin-ext` subsets are
kept: six `woff2` files, ~168 KB total. `npm run fonts` regenerates them and
rewrites `src/styles/fonts.css`.

## Accessibility

- Semantic landmarks and a single `h1`; headings in order.
- Skip link to the main content.
- Every colour pair meets WCAG AA on the `#070c09` ground (body text 16:1,
  quietest tone ~5.6:1).
- Visible `:focus-visible` rings on all interactive elements.
- Decorative images are `alt=""` and `aria-hidden`; photographs describe the
  place, not the brand.
- `prefers-reduced-motion: reduce` disables every animation, reveal and parallax.
- Content is fully visible without JavaScript.

## Verifying

```sh
npm run build && npm run preview
npm i --no-save puppeteer-core   # not a project dependency
node scripts/shoot.mjs           # writes /tmp/bruma_shots
```

`shoot.mjs` captures full-page screenshots at desktop, laptop, tablet and mobile,
scrolling first so lazy images and reveals have fired.

## Deployment

Pushes to `main` build and deploy to GitHub Pages via
`.github/workflows/deploy.yml`. `public/CNAME` pins the custom domain to
`bruma.do`.

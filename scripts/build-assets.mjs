/**
 * Derives the site's brand + photography assets from the originals in `logos/` and `pics/`.
 *
 * The logo is never redrawn. The reversed (ivory) lockup is produced by alpha-keying the
 * approved artwork: the cream ground becomes transparent and the remaining ink — including
 * every soft edge of the mist — is re-inked in a single flat colour. Silhouette, typography,
 * letter-spacing and internal proportions are bit-for-bit the originals.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const p = (...s) => path.join(ROOT, ...s);

const LOGO = p('logos', 'bruma_jarabacoa_logo.png');
const LOGO_SQ = p('logos', 'bruma_logo_social.png');

const INK = { ivory: '#F3EDE1', forest: '#24402F' };
const ICON_GROUND = { r: 16, g: 34, b: 26, alpha: 1 };

// Luminance endpoints measured from the approved artwork: the cream ground sits at 240-245
// and the solid ink body at 60-69, with the mist occupying a smooth ramp in between.
const L_GROUND = 240;
const L_INK = 63;

const hex = (h) => ({
  r: parseInt(h.slice(1, 3), 16),
  g: parseInt(h.slice(3, 5), 16),
  b: parseInt(h.slice(5, 7), 16),
});

/** Alpha-key the approved artwork, returning a trimmed RGBA sharp instance in `colour`. */
async function reink(src, colour, { region } = {}) {
  let base = sharp(src);
  if (region) base = base.extract(region);
  const buf = await base.png().toBuffer();

  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const ink = hex(colour);
  const rgba = Buffer.alloc(width * height * 4);

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let i = 0; i < width * height; i++) {
    const a = Math.round(255 * Math.min(1, Math.max(0, (L_GROUND - data[i]) / (L_GROUND - L_INK))));
    rgba[i * 4] = ink.r;
    rgba[i * 4 + 1] = ink.g;
    rgba[i * 4 + 2] = ink.b;
    rgba[i * 4 + 3] = a;
    if (a > 8) {
      const x = i % width, y = (i / width) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } }).extract({
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  });
}

/** The mark alone (mountain + mist + foothills), measured from the artwork's own ink gap. */
async function markRegion(src) {
  const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rows = [];
  for (let y = 0; y < height; y++) {
    let n = 0;
    for (let x = 0; x < width; x++) if (data[y * width + x] < 200) n++;
    rows.push(n);
  }
  const first = rows.findIndex((n) => n > 0);
  // The lockup separates the mark from the wordmark with a band of empty rows.
  let gapStart = -1;
  for (let y = first + 20; y < height; y++) {
    if (rows[y] === 0) {
      let run = 0;
      while (y + run < height && rows[y + run] === 0) run++;
      if (run >= 12) { gapStart = y; break; }
      y += run;
    }
  }
  if (gapStart < 0) throw new Error('Could not locate the mark/wordmark gap in ' + src);
  return { left: 0, top: 0, width, height: gapStart };
}

/** A cohesive grade: deeper pine greens, softened sky, warmer light, gentle contrast. */
/**
 * Shared look: deepen the pine greens, pull the sky back toward slate, warm the
 * light, and lift a little contrast. `tone` lets an individual frame be pushed
 * further — the phone shots are far brighter and bluer than the drone stills and
 * would otherwise glare against the near-black page.
 */
function grade(instance, tone = {}) {
  const { saturation = 0.82, brightness = 0.97, blue = 0.93, contrast = 1.06, lift = -11, gamma = 1.03 } = tone;
  return instance
    .modulate({ saturation, brightness })
    .recomb([
      [1.03, 0.03, -0.04],
      [0.0, 1.03, -0.01],
      [-0.02, 0.04, blue],
    ])
    .linear(contrast, lift)
    .gamma(gamma);
}

/**
 * Photographs are cropped here rather than in CSS: these are wide aerial and
 * phone frames, and letting the browser crop them leaves far too much bright
 * sky for a dark, misty palette. `crop` is applied before the grade.
 *
 * Crops are chosen against measured targets, not by eye. Every plate is judged
 * on mean relative luminance (the hero sits at ~0.39), blue bias (hero ~-22)
 * and detail density in KB/megapixel (hero ~226); a plate far off those reads
 * as a glare or a smudge against the near-black ground.
 *
 * `mist-river-dawn.jpg` and `dew-web.jpg` are full-resolution JPEG exports of
 * IMG_7698.HEIC and IMG_7707.HEIC (sharp cannot decode those HEICs directly —
 * see CREDITS.md for each original's location).
 *
 * `mist-river-dawn` is a blue-hour frame and carries a `tone` that pulls it
 * back toward the warm, dark grade of the drone stills. Its crop keeps the
 * palm and the near hillside on the left: those hold nearly all of the frame's
 * dark tone and fine detail, and cropping them away leaves only hazy distance
 * (L 0.43, blue +16, 98 KB/MP) where keeping them gives L 0.32, blue +1 and
 * 257 KB/MP.
 *
 * `dew-web` is cropped to the top-left of the frame so the band of bruma lying
 * over the valley reads behind the web, and so the right side, which holds a
 * private red-roofed house, falls outside it. 2900px is the widest crop that
 * still excludes that house, which fixes the height at 1933 for a 3:2 slot.
 * Opening up the mist lifts the frame to L 0.48, far brighter than any other
 * plate, so it carries a tone that brings it back to the hero's L 0.39.
 *
 * `los lalos1 4k` is the ridge the brand mark was drawn from: the jagged range
 * with mist caught along its flank. It backs the closing section, so it also
 * replaces a 1920x1080 source that could not fill a full-bleed retina frame.
 */
const PHOTOS = [
  { src: 'los lalos 4k.jpg', out: 'hero-ridges', width: 3200 },
  {
    src: 'dew-web.jpg',
    out: 'mountain-air',
    crop: { left: 0, top: 0, width: 2900, height: 1933 },
    width: 2000,
    tone: { saturation: 0.84, brightness: 0.86, blue: 0.9, contrast: 1.1, lift: -22, gamma: 1.04 },
  },
  {
    src: 'mist-river-dawn.jpg',
    out: 'valley-range',
    crop: { left: 0, top: 900, width: 4032, height: 2016 },
    width: 2600,
    tone: { saturation: 0.7, brightness: 0.86, blue: 0.8, contrast: 1.08, lift: -20, gamma: 1.04 },
  },
  {
    src: 'pinar-valley.jpg',
    out: 'pinar-valley',
    // Pines framing the valley. The source is an 18MP daylight frame with a
    // large blue sky, and the sky is the whole problem: a band that keeps it
    // grades to L 0.47 with a blue bias of -0.6, nothing like the rest of the
    // site. Cutting the sky and holding the trunks lands at L 0.36 / -22 /
    // 237 KB/MP against the hero's 0.39 / -22 / 226, so it needs no tone.
    crop: { left: 0, top: 1100, width: 3600, height: 1379 },
    width: 2800,
  },
  {
    src: 'los lalos1 4k.jpg',
    out: 'closing-light',
    crop: { left: 0, top: 560, width: 3840, height: 1600 },
    width: 3200,
    tone: { saturation: 0.8, brightness: 1.0, blue: 0.88, contrast: 1.04, lift: -6, gamma: 1.0 },
  },
];

async function main() {
  await mkdir(p('src/assets/brand'), { recursive: true });
  await mkdir(p('src/assets/photography'), { recursive: true });
  await mkdir(p('public'), { recursive: true });

  // --- Reversed lockups -----------------------------------------------------
  const lockup = await reink(LOGO, INK.ivory);
  await lockup.clone().png({ compressionLevel: 9 }).toFile(p('src/assets/brand/bruma-lockup-ivory.png'));

  const region = await markRegion(LOGO);
  const mark = await reink(LOGO, INK.ivory, { region });
  await mark.clone().png({ compressionLevel: 9 }).toFile(p('src/assets/brand/bruma-mark-ivory.png'));

  // --- Favicons: the approved mark, reversed, on a deep forest ground -------
  // The mark is ~5:1, so it only stays legible at 16-32px with full width and
  // maximum contrast. Nothing about the artwork itself is altered.
  const sqRegion = await markRegion(LOGO_SQ);
  const markIcon = await reink(LOGO_SQ, INK.ivory, { region: sqRegion });

  const icon = async (size, pad) => {
    const scaled = await markIcon
      .clone()
      .resize({ width: Math.round(size * (1 - pad * 2)), fit: 'inside', kernel: 'lanczos3' })
      .png()
      .toBuffer();
    const sm = await sharp(scaled).metadata();
    return sharp({ create: { width: size, height: size, channels: 4, background: ICON_GROUND } })
      .composite([{ input: scaled, left: Math.round((size - sm.width) / 2), top: Math.round((size - sm.height) / 2) }])
      .png({ compressionLevel: 9 })
      .toBuffer();
  };

  for (const [size, pad, name] of [
    [180, 0.1, 'apple-touch-icon.png'],
    [512, 0.1, 'icon-512.png'],
    [192, 0.1, 'icon-192.png'],
    [32, 0.05, 'favicon-32.png'],
    [16, 0.04, 'favicon-16.png'],
  ]) {
    await writeFile(p('public', name), await icon(size, pad));
  }

  // --- Photography ----------------------------------------------------------
  for (const photo of PHOTOS) {
    let pipe = sharp(p('pics', photo.src)).rotate();
    if (photo.crop) pipe = pipe.extract(photo.crop);
    await grade(pipe.resize({ width: photo.width, withoutEnlargement: true }), photo.tone)
      .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
      .toFile(p('src/assets/photography', `${photo.out}.jpg`));
  }

  // --- Social preview (1200x630) -------------------------------------------
  const OG_W = 1200, OG_H = 630;
  const plate = await grade(
    sharp(p('pics', 'los lalos 4k.jpg')).resize({ width: OG_W, height: OG_H, fit: 'cover', position: 'centre' }),
  )
    .modulate({ brightness: 0.62, saturation: 0.7 })
    .toBuffer();

  const scrim = await sharp({
    create: { width: OG_W, height: OG_H, channels: 4, background: { r: 7, g: 15, b: 11, alpha: 0.5 } },
  }).png().toBuffer();

  const ogLockup = await lockup
    .clone()
    .resize({ width: Math.round(OG_W * 0.46), kernel: 'lanczos3' })
    .png()
    .toBuffer();
  const ogMeta = await sharp(ogLockup).metadata();

  await sharp(plate)
    .composite([
      { input: scrim, blend: 'over' },
      {
        input: ogLockup,
        left: Math.round((OG_W - ogMeta.width) / 2),
        top: Math.round((OG_H - ogMeta.height) / 2) - 14,
      },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(p('public/og-bruma-jarabacoa.jpg'));

  console.log('assets written.');
}

await main();

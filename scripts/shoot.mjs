/**
 * Visual verification helper (dev only — not part of the site build).
 * Drives the locally installed Chrome to capture the page at several widths.
 */
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL_UNDER_TEST = process.env.URL ?? 'http://localhost:4321/';
const OUT = process.env.OUT ?? '/tmp/bruma_shots';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'laptop', width: 1180, height: 820, dsf: 1 },
  { name: 'tablet', width: 834, height: 1112, dsf: 1 },
  { name: 'mobile', width: 390, height: 844, dsf: 2 },
];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--hide-scrollbars', '--force-color-profile=srgb'],
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf });
  await page.goto(URL_UNDER_TEST, { waitUntil: 'networkidle0', timeout: 60_000 });

  // Walk the page so lazy images load and every reveal fires.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 600));
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 900));

  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });

  const height = await page.evaluate(() => document.body.scrollHeight);
  console.log(`${vp.name.padEnd(8)} ${vp.width}x${vp.height}  page height ${height}px`);
  await page.close();
}

await browser.close();

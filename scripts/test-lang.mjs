/**
 * Exercises the language switcher end to end: default language, switching,
 * persistence across visits, and that a shared /en/ link is never hijacked.
 *
 *   npm i --no-save puppeteer-core && npm run preview
 *   node scripts/test-lang.mjs
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE ?? 'http://localhost:4321';
const CHROME =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const page = await browser.newPage();

const results = [];
const check = (name, actual, expected) => {
  const ok = actual === expected;
  results.push({ name, ok, actual, expected });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n        got ${actual}, want ${expected}`}`);
};

const go = async (path) => {
  await page.goto(BASE + path, { waitUntil: 'networkidle0' });
  return {
    path: new URL(page.url()).pathname,
    lang: await page.$eval('html', (el) => el.lang),
    statement: await page.$eval('.hero__statement', (el) => el.textContent.trim()),
    stored: await page.evaluate(() => localStorage.getItem('bruma:lang')),
  };
};

const clickLang = async (code) => {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click(`.lang__link[data-lang="${code}"]`),
  ]);
};

// 1. A first-time visitor gets Spanish at the root.
let s = await go('/');
check('root defaults to Spanish', s.lang, 'es');
check('root shows Spanish hero', s.statement, 'Desde las montañas.');
check('nothing stored before a choice', s.stored, null);

// 2. /en/ serves English.
s = await go('/en/');
check('/en/ serves English', s.lang, 'en');
check('/en/ shows English hero', s.statement, 'Born in the mountains.');
check('visiting /en/ stores nothing', s.stored, null);

// 3. Choosing EN navigates and records the choice.
await go('/');
await clickLang('en');
check('EN click lands on /en/', new URL(page.url()).pathname, '/en/');
check('EN click switches copy', await page.$eval('.hero__statement', (el) => el.textContent.trim()), 'Born in the mountains.');
check('EN click is remembered', await page.evaluate(() => localStorage.getItem('bruma:lang')), 'en');

// 4. Returning to the root honours that choice.
s = await go('/');
check('root redirects to remembered EN', s.path, '/en/');
check('redirect renders English', s.lang, 'en');

// 5. Choosing ES again switches back and sticks.
await clickLang('es');
check('ES click lands on /', new URL(page.url()).pathname, '/');
check('ES click is remembered', await page.evaluate(() => localStorage.getItem('bruma:lang')), 'es');
s = await go('/');
check('root stays Spanish once chosen', s.path, '/');
check('root renders Spanish', s.statement, 'Desde las montañas.');

// 6. A shared /en/ link still works for someone who prefers Spanish.
s = await go('/en/');
check('shared /en/ link is not hijacked', s.path, '/en/');
check('shared /en/ link renders English', s.lang, 'en');
check('shared /en/ link keeps the ES preference', s.stored, 'es');

// 7. Only one language is ever present in the document.
const spanishInEn = await page.evaluate(() => document.body.innerText.includes('Desde las montañas'));
check('EN page contains no Spanish copy', spanishInEn, false);
await go('/');
const englishInEs = await page.evaluate(() => document.body.innerText.includes('Born in the mountains'));
check('ES page contains no English copy', englishInEs, false);

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);

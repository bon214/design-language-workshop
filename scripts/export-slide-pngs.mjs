import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/Users/kubo_hayato/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const html = fs.readFileSync('out/github-pages/index.html');
const slides = JSON.parse(fs.readFileSync('app/slides.ts', 'utf8').split('export const slides:Slide[]=\n')[1].replace(/;\s*$/, ''));
const output = path.resolve(process.env.PNG_OUTPUT || 'out/slide-pngs-2026-09-14');
fs.mkdirSync(output, { recursive: true });
const server = createServer((_req, res) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
try {
 const page = await browser.newPage({ viewport: { width: 1280, height: 740 }, deviceScaleFactor: 2 });
 const errors = [];
 page.on('pageerror', e => errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/?view=slide#slide-1`);
 await page.evaluate(() => document.fonts.ready);
 const images = [];
 for (const [index, slide] of slides.entries()) {
  const number = index + 1;
  await page.evaluate(n => { location.hash = `slide-${n}`; }, number);
  const article = page.locator(`article[aria-label^="${number}枚目"]`);
  await article.waitFor();
  if (slide.kind === 'role-dialogue') await page.getByRole('button', { name: '対話についてのメッセージを表示', exact: true }).click();
  await article.evaluate(async element => {
   await Promise.all([...element.querySelectorAll('img')].map(image => image.decode()));
   await Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
  });
  assert.deepEqual(await article.evaluate(a => ({ width: a.clientWidth, height: a.clientHeight, scrollWidth: a.scrollWidth, scrollHeight: a.scrollHeight })), { width: 1280, height: 740, scrollWidth: 1280, scrollHeight: 740 }, `slide ${number} must fit`);
  const fileName = `slide-${String(number).padStart(2, '0')}.png`;
  const bytes = await article.screenshot({ path: path.join(output, fileName), animations: 'disabled' });
  assert(bytes.length < 10 * 1024 * 1024, 'Figma asset size limit');
  assert.equal(bytes.readUInt32BE(16), 2560);
  assert.equal(bytes.readUInt32BE(20), 1480);
  images.push({ number, title: slide.title.replaceAll('\n', ''), sourceId: slide.sourceId, fileName, width: 2560, height: 1480, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
 }
 assert.deepEqual(errors, []);
 const manifest = { createdAt: new Date().toISOString(), htmlSha256: createHash('sha256').update(html).digest('hex'), count: images.length, displayWidth: 1280, displayHeight: 740, images };
 fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
 console.log(JSON.stringify({ output, count: images.length, dimensions: '2560 × 1480', totalBytes: images.reduce((sum, image) => sum + image.bytes, 0), errors }));
} finally {
 await browser.close();
 await new Promise(resolve => server.close(resolve));
}

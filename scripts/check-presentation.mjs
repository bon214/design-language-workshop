import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/Users/kubo_hayato/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const html = fs.readFileSync('out/github-pages/index.html');
const server = createServer((_req, res) => { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
try {
 const context = await browser.newContext({ viewport: { width: 1159, height: 777 } });
 const errors = [];
 context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
 const control = await context.newPage();
 await control.goto(`${base}?v=check#slide-55`);
 await control.getByRole('button', { name: '講師メモ', exact: true }).click();
 const popupReady = control.waitForEvent('popup');
 await control.getByRole('button', { name: '全画面表示（別タブ）', exact: true }).click();
 const presentation = await popupReady;
 await presentation.waitForURL(/view=presentation/);
 const frame = presentation.frameLocator('iframe');
 await frame.locator('article[aria-label^="55枚目"]').waitFor();
 assert.equal(await control.evaluate(() => !!document.fullscreenElement), false);
 assert.equal(new URL(control.url()).hash, '#slide-55');
 assert(await control.locator('.speaker-notes').isVisible());
 for (const chrome of ['.toolbar', '.controls', '.progress-track', '.speaker-notes']) {
  assert.equal(await frame.locator(chrome).isVisible(), false, `${chrome} must not be projected`);
 }
 // Exercise the browser's real fullscreen API, without granting automatic fullscreen.
 if (!await presentation.evaluate(() => !!document.fullscreenElement)) {
  await presentation.getByRole('button', { name: '全画面で表示', exact: true }).click();
 }
 await presentation.waitForFunction(() => !!document.fullscreenElement);
 assert.equal(await presentation.locator('.presentation-launch').count(), 0);
 assert.equal(await control.evaluate(() => !!document.fullscreenElement), false);
 const slideFrame = presentation.frames().find(f => new URL(f.url()).searchParams.get('view') === 'slide');
 assert(slideFrame);
 await frame.getByRole('button', { name: '15分のタイマーを開始', exact: true }).click();
 await slideFrame.waitForFunction(() => document.querySelector('article [role="timer"]')?.textContent === '14:59');
 await frame.getByRole('button', { name: 'タイマーを一時停止', exact: true }).click();
 const paused = await frame.locator('article [role="timer"]').textContent();
 await presentation.waitForTimeout(1100);
 assert.equal(await frame.locator('article [role="timer"]').textContent(), paused);
 await frame.getByRole('button', { name: 'タイマーをリセット', exact: true }).click();
 assert.equal(await frame.locator('article [role="timer"]').textContent(), '15:00');
 await frame.locator('article').click({ position: { x: 20, y: 20 } });
 await presentation.keyboard.press('ArrowRight');
 await frame.locator('article[aria-label^="56枚目"]').waitFor();
 await presentation.waitForURL(/#slide-56$/);
 await presentation.keyboard.press('b');
 assert(await frame.locator('.blackout').isVisible());
 await presentation.keyboard.press('b');
 assert.equal(await frame.locator('.blackout').count(), 0);
 // F inside the slide frame controls the presentation tab, never the original.
 await presentation.keyboard.press('f');
 await presentation.waitForFunction(() => !document.fullscreenElement);
 await presentation.keyboard.press('f');
 await presentation.waitForFunction(() => !!document.fullscreenElement);
 const overflow = [];
 fs.mkdirSync('out/presentation-check', { recursive: true });
 for (let n = 1; n <= 68; n++) {
  await slideFrame.evaluate(n => { location.hash = `slide-${n}`; }, n);
  await frame.locator(`article[aria-label^="${n}枚目"]`).waitFor();
  const size = await slideFrame.evaluate(() => ({ w: innerWidth, h: innerHeight, sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight }));
  if (size.sw > size.w || size.sh > size.h) overflow.push({ page: n, ...size });
  if ([1, 55, 60, 68].includes(n)) await presentation.screenshot({ path: `out/presentation-check/slide-${n}.png`, animations: 'disabled' });
 }
 assert.deepEqual(overflow, [], 'every slide must fit the projection viewport');
 // Fit a widescreen, a regular window and a narrow viewport without changing layout.
 for (const viewport of [{ width: 1920, height: 1080 }, { width: 900, height: 900 }, { width: 390, height: 844 }]) {
  await presentation.setViewportSize(viewport);
  await presentation.waitForTimeout(100);
  const rect = await presentation.locator('iframe').boundingBox();
  assert(rect.x >= -1 && rect.y >= -1 && rect.x + rect.width <= viewport.width + 1 && rect.y + rect.height <= viewport.height + 1);
  assert(Math.abs(rect.width / rect.height - 1280 / 740) < 0.01);
 }
 await presentation.evaluate(() => document.exitFullscreen());
 await control.bringToFront();
 await control.keyboard.press('ArrowRight');
 await control.getByRole('button', { name: '全画面表示（別タブ）', exact: true }).click();
 assert.equal(context.pages().length, 2, 'reuse the open presentation tab');
 await frame.locator('article[aria-label^="56枚目"]').waitFor();
 await presentation.close();
 const reopened = control.waitForEvent('popup');
 await control.getByRole('button', { name: '全画面表示（別タブ）', exact: true }).click();
 await (await reopened).close();
 // A blocked popup leaves the current tab intact and provides recovery.
 await control.evaluate(() => { window.open = () => null; });
 await control.getByRole('button', { name: '全画面表示（別タブ）', exact: true }).click();
 assert.match(await control.locator('.status-message').textContent(), /ポップアップを許可/);
 assert.equal(await control.evaluate(() => !!document.fullscreenElement), false);
 assert.deepEqual(errors, []);
 console.log(JSON.stringify({ result: 'passed', checks: ['separate tab at current slide', 'original tab and notes retained', 'slide-only display', 'real fullscreen and iframe F shortcut', 'timer start/pause/reset', 'navigation and blackout', '68 slides fit', 'three viewport sizes', 'reuse and reopen', 'blocked popup recovery'], errors, overflow }, null, 2));
} finally {
 await browser.close();
 await new Promise(resolve => server.close(resolve));
}

const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch();
  const pages = ['index.html', 'archive.html', 'hokkaido.html', 'da-nang-hoi-an.html', 'jeju.html'];
  try {
    for (const width of [375, 430, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 850 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const file of pages) {
        await page.goto('http://127.0.0.1:8765/' + path.basename(process.cwd()) + '/' + file, { waitUntil: 'domcontentloaded' });
        await page.locator('.nav-ready').waitFor();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), file + ' overflow at ' + width);
        const toggle = page.locator('.nav-toggle');
        if (width < 701) {
          await toggle.focus();
          await page.keyboard.press('Enter');
          await page.keyboard.press('Tab');
          assert(await page.locator('#site-nav a').first().evaluate(el => el === document.activeElement));
          await page.keyboard.press('Escape');
          assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
          assert(await toggle.evaluate(el => el === document.activeElement));
          await toggle.click();
        }
        await page.locator('#site-nav a').nth(1).click();
        await page.waitForFunction(() => location.hash === '#destinations' && window.scrollY > 80);
        const header = page.locator('.journal-header.compact');
        await header.waitFor();
        const bounds = await header.boundingBox();
        assert(bounds.y + bounds.height >= 55 && bounds.y + bounds.height <= 65);
        assert(await page.locator('#destinations').evaluate(el => el.getBoundingClientRect().top >= 59));
      }
      assert.deepEqual(errors, []);
      await page.close();
      console.log(width + 'px: five pages checked');
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

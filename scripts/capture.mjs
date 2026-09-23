import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
await mkdir('test-results/screenshots', { recursive: true })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
for (const width of [1440, 375, 768, 1024]) {
  await page.setViewportSize({ width, height: width < 600 ? 850 : 1000 })
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    const images = [...document.images]
    for (const image of images) image.loading = 'eager'
    await Promise.all(images.map((image) => image.decode().catch(() => {})))
    await document.fonts.ready
  })
  await page.screenshot({ path: `test-results/screenshots/home-${width}.png`, fullPage: true })
  console.log(
    JSON.stringify({
      width,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      title: await page.title(),
    }),
  )
}
console.log('Browser errors:', errors)
await browser.close()

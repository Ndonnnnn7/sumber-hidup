import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFile } from 'node:fs/promises'

test('home leads to category and detailed product with correct WhatsApp destination', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hal kecil.')
  await page.locator('.category-card').filter({ hasText: 'Buku catatan' }).click()
  await expect(page).toHaveURL(/category=buku-catatan/)
  await expect(page.locator('.product-card')).toHaveCount(2)
  await page.getByRole('link', { name: 'Buku Catatan Sage', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Buku Catatan Sage')
  await page.getByLabel('Jumlah yang ingin ditanyakan').fill('12')
  const href = await page.getByRole('link', { name: 'Tanyakan via WhatsApp' }).getAttribute('href')
  expect(href).toContain('https://wa.me/6281221097811?text=')
  expect(decodeURIComponent(href!)).toContain('Jumlah: 12 buku')
  expect(decodeURIComponent(href!)).toContain('Warna: Sage')
  await page.getByRole('button', { name: 'Perbesar foto Buku Catatan Sage' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('catalog searches, filters, sorts, paginates, and handles no results', async ({ page }) => {
  await page.goto('/products')
  await expect(page.locator('.product-card')).toHaveCount(8)
  await page.getByRole('button', { name: 'Halaman 2', exact: true }).click()
  await expect(page.locator('.product-card')).toHaveCount(1)
  await page.getByLabel('Cari produk', { exact: true }).fill('sage')
  await expect(page.locator('.product-card')).toHaveCount(2)
  await page.getByLabel('Tersedia saja').check()
  await expect(page.locator('.product-card')).toHaveCount(1)
  await page.getByRole('button', { name: 'Hapus semua filter' }).click()
  await page.getByLabel('Harga', { exact: true }).selectOption('under50')
  await expect(page.locator('.product-card')).toHaveCount(1)
  await expect(page.locator('.product-card')).toContainText('Buku Saku Sage')
  await page.getByRole('button', { name: 'Hapus semua filter' }).click()
  await page.getByLabel('Urutkan produk').selectOption('price-low')
  await expect(page.locator('.product-card').first()).toContainText('Buku Saku Sage')
  await page.getByLabel('Cari produk', { exact: true }).fill('tidak-ada-produk-ini')
  await expect(page.getByRole('heading', { name: 'Belum menemukan yang pas?' })).toBeVisible()
  await page.getByRole('button', { name: 'Lihat semua koleksi' }).click()
  await expect(page.locator('.product-card')).toHaveCount(8)
})

test('favorites persist and create a combined product inquiry', async ({ page }) => {
  await page.goto('/products')
  await page.getByRole('button', { name: 'Simpan Buku Catatan Sage', exact: true }).click()
  await page.reload()
  await page.getByRole('button', { name: 'Buka pilihan tersimpan (1)' }).click()
  const drawer = page.getByRole('dialog')
  await expect(drawer.getByRole('heading', { name: 'Buku Catatan Sage' })).toBeVisible()
  const href = await drawer
    .getByRole('link', { name: 'Tanyakan pilihan saya' })
    .getAttribute('href')
  expect(decodeURIComponent(href!)).toContain('Buku Catatan Sage')
  await drawer.getByRole('button', { name: 'Hapus Buku Catatan Sage dari pilihan' }).click()
  await expect(drawer.getByRole('heading', { name: 'Ruang untuk favoritmu.' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(drawer).not.toBeVisible()
})

test('bulk contact submission is saved privately on the server', async ({ page, request }) => {
  await page.goto('/contact?type=bulk')
  await expect(page.getByLabel('Apa yang ingin kamu tanyakan?')).toHaveValue('Grosir / institusi')
  const name = `Sekolah Test ${Date.now()}`
  await page.getByLabel('Nama lengkap').fill(name)
  await page.getByLabel('Email kamu').fill('sekolah@example.test')
  await page.getByLabel('Pesanmu').fill('Kami membutuhkan 50 buku catatan untuk kegiatan belajar.')
  await page.getByRole('button', { name: 'Kirim pesan', exact: true }).click()
  await expect(page.getByRole('heading', { name: `Terima kasih, ${name}.` })).toBeVisible()
  await expect(page.getByText(/pemberitahuan email belum aktif/)).toBeVisible()
  const { inquiries: messages } = JSON.parse(await readFile('.playwright-data/store.json', 'utf8'))
  expect((await request.get('/api/inquiries')).status()).toBe(404)
  expect((await request.get('/data/store.json')).status()).toBe(404)
  expect(await (await request.get('/api/catalog')).json()).not.toHaveProperty('inquiries')
  expect(
    messages.some(
      (message: { name: string; type: string; emailDelivery: { status: string } }) =>
        message.name === name &&
        message.type === 'Grosir / institusi' &&
        message.emailDelivery.status === 'unconfigured',
    ),
  ).toBeTruthy()
})

test('removed admin page and endpoints return 404 without changing the catalog', async ({
  page,
  request,
}) => {
  const before = await (await request.get('/api/catalog')).json()
  const response = await page.goto('/admin')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Cerita ini belum ditulis.' })).toBeVisible()
  expect((await request.get('/admin/products')).status()).toBe(404)
  for (const [method, endpoint] of [
    ['POST', '/api/admin/login'],
    ['POST', '/api/admin/logout'],
    ['GET', '/api/admin/session'],
    ['GET', '/api/admin/inquiries'],
    ['PUT', '/api/admin/settings'],
    ['PUT', '/api/admin/categories'],
    ['PUT', '/api/admin/products/planner-fokus'],
    ['DELETE', '/api/admin/products/planner-fokus'],
  ]) {
    const result = await request.fetch(endpoint, { method })
    expect(result.status()).toBe(404)
    expect(await result.json()).toEqual({ error: 'Endpoint tidak ditemukan.' })
  }
  expect(await (await request.get('/api/catalog')).json()).toEqual(before)
})

test('API rejects malformed inquiries and cross-origin writes; product metadata is server-rendered', async ({
  request,
}) => {
  expect(
    (
      await request.post('/api/inquiries', {
        data: { name: 'A', contact: 'invalid', message: 'x', type: 'Produk' },
      })
    ).status(),
  ).toBe(400)
  expect(
    (
      await request.post('/api/inquiries', {
        data: {
          name: 'Pengunjung',
          contact: '+6281221097811',
          type: 'Produk',
          message: 'Saya ingin menanyakan buku catatan.',
        },
      })
    ).status(),
  ).toBe(400)
  expect(
    (
      await request.post('/api/inquiries', {
        headers: { Origin: 'https://other.example' },
        data: {},
      })
    ).status(),
  ).toBe(403)
  const product = await request.get('/products/planner/planner-fokus-a5')
  expect(await product.text()).toContain('<title>Planner Fokus — Sumber Hidup</title>')
  expect((await request.get('/products/missing/missing')).status()).toBe(404)
  expect(await (await request.get('/robots.txt')).text()).toContain('Allow: /')
  expect(await (await request.get('/sitemap.xml')).text()).toContain(
    '/products/planner/planner-fokus-a5',
  )
})

for (const width of [375, 768, 1024, 1440]) {
  test(`public pages fit ${width}px and all images load`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const route of [
      '/',
      '/products',
      '/products/planner/planner-fokus-a5',
      '/about',
      '/contact',
    ]) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      for (const img of await page.locator('img:visible').all()) {
        await img.scrollIntoViewIfNeeded()
        await expect(img).toHaveJSProperty('complete', true)
        expect(await img.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(
          0,
        )
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      if (route === '/')
        await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true })
    }
    expect(errors).toEqual([])
    if (width === 375) {
      await page.getByRole('button', { name: 'Buka menu', exact: true }).click()
      await page
        .getByRole('navigation', { name: 'Navigasi utama' })
        .getByRole('link', { name: 'Home', exact: true })
        .click()
      await expect(page).toHaveURL('/')
    }
  })
}

test('public pages meet automated WCAG accessibility checks', async ({ page }) => {
  const issues: unknown[] = []
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of [
      '/',
      '/products',
      '/products/planner/planner-fokus-a5',
      '/about',
      '/contact',
    ]) {
      await page.goto(route)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
      issues.push(
        ...results.violations.map((v) => ({
          width,
          route,
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      )
    }
  }
  expect(issues).toEqual([])
})

test('configured contact details and product gallery render from catalog data', async ({
  page,
  request,
}) => {
  const catalog = await (await request.get('/api/catalog')).json()
  catalog.settings = {
    ...catalog.settings,
    address: 'Alamat toko untuk pengujian',
    hours: 'Senin-Sabtu: 08.00-17.00',
    email: 'toko@example.test',
  }
  const planner = catalog.products.find((p: { id: string }) => p.id === 'planner-fokus')
  planner.images = ['/images/planner-cutout.webp']
  await page.route('**/api/catalog', (route) => route.fulfill({ json: catalog }))
  await page.goto('/contact')
  await expect(page.getByText(catalog.settings.address, { exact: true })).toBeVisible()
  await expect(page.getByText(catalog.settings.hours, { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: catalog.settings.email })).toHaveAttribute(
    'href',
    `mailto:${catalog.settings.email}`,
  )
  await expect(page.getByTitle('Lokasi toko Sumber Hidup')).toHaveAttribute(
    'src',
    /Alamat%20toko%20untuk%20pengujian/,
  )
  await page.goto('/products/planner/planner-fokus-a5')
  await page.getByRole('button', { name: 'Lihat foto 2', exact: true }).click()
  await expect(page.locator('.main-product-image img')).toHaveAttribute(
    'src',
    '/images/planner-cutout.webp',
  )
})

test('honeypot submissions are not persisted', async ({ request }) => {
  const before = JSON.parse(await readFile('.playwright-data/store.json', 'utf8'))
  expect(
    (await request.post('/api/inquiries', { data: { website: 'spam.example' } })).status(),
  ).toBe(200)
  const after = JSON.parse(await readFile('.playwright-data/store.json', 'utf8'))
  expect(after.inquiries).toEqual(before.inquiries)
})

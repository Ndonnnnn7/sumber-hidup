import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test('contact submissions work through Vite development and preview on alternate ports', async ({
  page,
}) => {
  for (const origin of [
    'http://localhost:5190',
    'http://127.0.0.1:5190',
    'http://localhost:4190',
  ]) {
    const name = `Proxy Test ${Date.now()}`
    await page.goto(`${origin}/contact`)
    await page.getByLabel('Nama lengkap').fill(name)
    await page.getByLabel('Email kamu').fill('proxy@example.test')
    await page.getByLabel('Pesanmu').fill('Saya ingin menanyakan pilihan buku catatan.')
    await page.getByRole('button', { name: 'Kirim pesan', exact: true }).click()
    await expect(page.getByRole('heading', { name: `Terima kasih, ${name}.` })).toBeVisible()
    const { inquiries } = JSON.parse(await readFile('.playwright-data/store.json', 'utf8'))
    expect(inquiries).toContainEqual(expect.objectContaining({ name }))
  }
})

test('development proxy continues to reject cross-origin and forged forwarded-host requests', async ({
  request,
}) => {
  for (const origin of ['https://other.example', 'http://localhost:5173', 'null']) {
    const response = await request.post('http://127.0.0.1:5190/api/inquiries', {
      headers: { Origin: origin, 'X-Forwarded-Host': 'other.example' },
      data: {
        name: 'Proxy Test',
        contact: 'proxy@example.test',
        type: 'Produk',
        message: 'Saya ingin menanyakan pilihan buku catatan.',
      },
    })
    expect(response.status()).toBe(403)
    expect(await response.json()).toEqual({ error: 'Asal permintaan tidak diizinkan.' })
  }
})

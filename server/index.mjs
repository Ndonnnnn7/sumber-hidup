import 'dotenv/config'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInquiryMailer } from './email.mjs'
import { createFileStore } from './file-store.mjs'
import { getMissingSupabaseConfig, getSupabase } from './supabase.mjs'
import { createSupabaseStore } from './store.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const missingSupabaseConfig = getMissingSupabaseConfig()
const useFileStore =
  process.env.NODE_ENV === 'test' ||
  (process.env.NODE_ENV !== 'production' && missingSupabaseConfig.length > 0)
if (useFileStore && process.env.NODE_ENV !== 'test')
  console.warn(
    `Supabase belum aktif (${missingSupabaseConfig.join(', ')}). Development memakai data/store.json sementara.`,
  )
const store = useFileStore
  ? await createFileStore(
      root,
      process.env.DATA_DIR || (process.env.NODE_ENV === 'test' ? '.playwright-data' : 'data'),
    )
  : createSupabaseStore(getSupabase())
const mailer = createInquiryMailer()
if (!mailer.configured)
  console.warn(
    `Email formulir belum aktif. Lengkapi konfigurasi: ${mailer.invalidFields.join(', ')}`,
  )
const app = express()
app.disable('x-powered-by')
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'https:', 'data:'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        frameSrc: ['https://www.google.com'],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
      },
    },
    strictTransportSecurity: process.env.NODE_ENV === 'production',
  }),
)
app.use(compression())
app.use(express.json({ limit: '256kb' }))
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.headers.origin
    const expected = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`
    if (origin && origin !== expected)
      return res.status(403).json({ error: 'Asal permintaan tidak diizinkan.' })
    if (req.headers['sec-fetch-site'] === 'cross-site')
      return res.status(403).json({ error: 'Permintaan lintas situs ditolak.' })
  }
  next()
})
app.get('/api/catalog', async (_req, res) => res.json(await store.getCatalog()))
const inquiryLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 12,
  message: { error: 'Batas pesan tercapai. Silakan hubungi kami melalui WhatsApp.' },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})
const inquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  contact: z.email('Masukkan alamat email yang valid.').max(150),
  type: z.enum(['Produk', 'Grosir / institusi', 'Kemitraan', 'Lainnya']),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional(),
})
app.post('/api/inquiries', inquiryLimit, async (req, res) => {
  if (req.body?.website) return res.json({ ok: true })
  const parsed = inquirySchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message })
  const { website: _honeypot, ...details } = parsed.data
  const inquiry = {
    ...details,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    emailDelivery: { status: mailer.configured ? 'pending' : 'unconfigured' },
  }
  await store.insertInquiry(inquiry)
  const delivery = await mailer.notify(inquiry)
  try {
    await store.updateInquiryDelivery(inquiry.id, delivery)
  } catch (error) {
    console.error(
      `Inquiry delivery status update failed: ${inquiry.id} (${error.code || 'DATABASE_ERROR'})`,
    )
  }
  if (delivery.status === 'failed')
    console.error(`Inquiry email failed: ${inquiry.id} (${delivery.errorCode})`)
  res.status(201).json({ ok: true, id: inquiry.id, emailStatus: delivery.status })
})
app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }))
app.use(
  '/assets',
  express.static(path.join(root, 'dist/assets'), { immutable: true, maxAge: '1y' }),
)
app.use(express.static(path.join(root, 'dist'), { index: false, maxAge: '1h' }))
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )
app.get('/robots.txt', (_req, res) =>
  res
    .type('text/plain')
    .send(
      `User-agent: *\nAllow: /\n${process.env.PUBLIC_URL ? `Sitemap: ${process.env.PUBLIC_URL}/sitemap.xml` : ''}`,
    ),
)
app.get('/sitemap.xml', async (req, res) => {
  const { products } = await store.getCatalog()
  const origin = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`
  const urls = [
    '/',
    '/products',
    '/about',
    '/contact',
    ...products.map((p) => `/products/${p.category}/${p.slug}`),
  ]
  res
    .type('application/xml')
    .send(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${escape(origin + url)}</loc></url>`).join('')}</urlset>`,
    )
})
app.get('/{*path}', async (req, res) => {
  let html
  try {
    html = await readFile(path.join(root, 'dist/index.html'), 'utf8')
  } catch {
    return res
      .status(503)
      .send('Run npm run dev for development, or npm run build before npm start.')
  }
  const { products, settings } = await store.getCatalog()
  const product = products.find((p) => req.path === `/products/${p.category}/${p.slug}`)
  const pages = {
    '/': ['Untuk setiap ide, setiap hari.', settings.heroSubtitle],
    '/products': [
      'Katalog alat tulis',
      'Jelajahi planner, buku catatan, alat tulis, dan perlengkapan kantor pilihan.',
    ],
    '/about': ['Tentang kami', 'Kenali Sumber Hidup dan komitmen kami untuk menemani setiap ide.'],
    '/contact': [
      'Hubungi kami',
      'Tanyakan produk, kebutuhan grosir, dan pengadaan kantor kepada Sumber Hidup.',
    ],
  }
  const meta = product
    ? [product.name, product.description.slice(0, 155)]
    : pages[req.path] || ['Halaman tidak ditemukan', 'Kembali ke katalog Sumber Hidup.']
  html = html
    .replace(/<title>.*?<\/title>/, `<title>${escape(meta[0])} — Sumber Hidup</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escape(meta[1])}" />`,
    )
  if (process.env.PUBLIC_URL)
    html = html.replace(
      '</head>',
      `<link rel="canonical" href="${escape(process.env.PUBLIC_URL + req.path)}" /></head>`,
    )
  const exists = product || pages[req.path]
  res
    .status(exists ? 200 : 404)
    .type('html')
    .send(html)
})
app.use((error, _req, res, _next) => {
  const status = error.status || 500
  if (status === 500) console.error('Request failed:', error.message)
  res
    .status(status)
    .json({ error: status === 500 ? 'Terjadi gangguan server. Silakan coba lagi.' : error.message })
})
const port = Number(process.env.PORT || 3001)
const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMainModule)
  app.listen(port, '0.0.0.0', () =>
    console.log(`Sumber Hidup API running on http://localhost:${port}`),
  )

export default app

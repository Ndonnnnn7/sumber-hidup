import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import { getSupabase } from '../server/supabase.mjs'
import { legacyStoreSchema, toInquiryRow } from '../server/store.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.resolve(root, process.env.DATA_DIR || 'data', 'store.json')
const force = process.argv.includes('--force')

const raw = JSON.parse(await readFile(sourcePath, 'utf8'))
const parsed = legacyStoreSchema.safeParse(raw)
if (!parsed.success) {
  const fields = [...new Set(parsed.error.issues.map((issue) => issue.path.join('.')))]
  throw new Error(`Data lama tidak valid pada: ${fields.join(', ')}`)
}

const supabase = getSupabase()
const content = {
  id: 1,
  settings: parsed.data.settings,
  categories: parsed.data.categories,
  products: parsed.data.products,
}

const { data: existing, error: readError } = await supabase
  .from('site_content')
  .select('id, settings, categories, products')
  .eq('id', 1)
  .maybeSingle()
if (readError)
  throw new Error(`Gagal memeriksa site_content (${readError.code || 'DATABASE_ERROR'}).`)

const existingContent = existing
  ? {
      id: existing.id,
      settings: existing.settings,
      categories: existing.categories,
      products: existing.products,
    }
  : null

if (existingContent && !isDeepStrictEqual(existingContent, content) && !force) {
  throw new Error(
    'site_content di Supabase sudah berisi data berbeda. Periksa datanya atau jalankan kembali dengan --force untuk menggantinya.',
  )
}

if (!existingContent || force) {
  const { error } = await supabase.from('site_content').upsert(content, { onConflict: 'id' })
  if (error) throw new Error(`Gagal memigrasikan site_content (${error.code || 'DATABASE_ERROR'}).`)
}

const inquiryRows = parsed.data.inquiries.map(toInquiryRow)
if (inquiryRows.length) {
  const { error } = await supabase
    .from('inquiries')
    .upsert(inquiryRows, { onConflict: 'id', ignoreDuplicates: true })
  if (error) throw new Error(`Gagal memigrasikan inquiries (${error.code || 'DATABASE_ERROR'}).`)
}

console.log(
  `Migrasi selesai: ${content.products.length} produk, ${content.categories.length} kategori, dan ${inquiryRows.length} pesan diproses.`,
)
console.log(`Sumber lokal tetap tersimpan di ${sourcePath}.`)

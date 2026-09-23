import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getMissingSupabaseConfig } from './supabase.mjs'
import { createSupabaseStore, toInquiryRow } from './store.mjs'

const catalog = {
  settings: { heroTitle: 'Sumber Hidup' },
  categories: [{ id: 'buku' }],
  products: [{ id: 'produk-1' }],
}

function createClient({ catalogResult = { data: catalog, error: null } } = {}) {
  const calls = []
  return {
    calls,
    from(table) {
      return {
        select(columns) {
          return {
            eq(column, value) {
              return {
                async single() {
                  calls.push({ operation: 'select', table, columns, column, value })
                  return catalogResult
                },
              }
            },
          }
        },
        async insert(row) {
          calls.push({ operation: 'insert', table, row })
          return { error: null }
        },
        update(values) {
          return {
            async eq(column, value) {
              calls.push({ operation: 'update', table, values, column, value })
              return { error: null }
            },
          }
        },
      }
    },
  }
}

const inquiry = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Pengunjung',
  contact: 'pengunjung@example.test',
  type: 'Produk',
  message: 'Saya ingin menanyakan sebuah produk.',
  createdAt: '2026-09-23T00:00:00.000Z',
  emailDelivery: { status: 'pending' },
}

test('missing Supabase configuration can be detected before startup', () => {
  assert.deepEqual(getMissingSupabaseConfig({ SUPABASE_SECRET_KEY: 'sb_secret_test' }), [
    'SUPABASE_URL',
  ])
  assert.deepEqual(
    getMissingSupabaseConfig({
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_SECRET_KEY: 'sb_secret_test',
    }),
    [],
  )
})

test('catalog is read from the single site_content row', async () => {
  const client = createClient()
  const store = createSupabaseStore(client)
  assert.deepEqual(await store.getCatalog(), catalog)
  assert.deepEqual(client.calls[0], {
    operation: 'select',
    table: 'site_content',
    columns: 'settings, categories, products',
    column: 'id',
    value: 1,
  })
})

test('inquiries use database column names and delivery updates target their id', async () => {
  const client = createClient()
  const store = createSupabaseStore(client)
  await store.insertInquiry(inquiry)
  await store.updateInquiryDelivery(inquiry.id, { status: 'sent', messageId: 'message-1' })

  assert.deepEqual(client.calls[0].row, toInquiryRow(inquiry))
  assert.deepEqual(client.calls[1], {
    operation: 'update',
    table: 'inquiries',
    values: { email_delivery: { status: 'sent', messageId: 'message-1' } },
    column: 'id',
    value: inquiry.id,
  })
})

test('database errors are reported without provider details', async () => {
  const client = createClient({
    catalogResult: { data: null, error: { code: 'PGRST116', message: 'private detail' } },
  })
  await assert.rejects(createSupabaseStore(client).getCatalog(), (error) => {
    assert.equal(error.message, 'Operasi database gagal: membaca katalog.')
    assert.equal(error.code, 'PGRST116')
    assert.doesNotMatch(error.message, /private detail/)
    return true
  })
})

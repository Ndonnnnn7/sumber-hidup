import { z } from 'zod'

const catalogSchema = z.object({
  settings: z.record(z.string(), z.unknown()),
  categories: z.array(z.record(z.string(), z.unknown())),
  products: z.array(z.record(z.string(), z.unknown())),
})

export const legacyStoreSchema = catalogSchema.extend({
  inquiries: z.array(
    z.object({
      id: z.uuid(),
      name: z.string().min(1),
      contact: z.string().min(1),
      type: z.enum(['Produk', 'Grosir / institusi', 'Kemitraan', 'Lainnya']),
      message: z.string().min(1),
      createdAt: z.string().min(1),
      emailDelivery: z.record(z.string(), z.unknown()),
    }),
  ),
})

function databaseError(action, error) {
  const wrapped = new Error(`Operasi database gagal: ${action}.`)
  wrapped.code = /^[A-Z0-9_]{2,20}$/i.test(error?.code || '') ? error.code : 'DATABASE_ERROR'
  return wrapped
}

function assertSuccess(action, error) {
  if (error) throw databaseError(action, error)
}

export function toInquiryRow(inquiry) {
  return {
    id: inquiry.id,
    name: inquiry.name,
    contact: inquiry.contact,
    type: inquiry.type,
    message: inquiry.message,
    created_at: inquiry.createdAt,
    email_delivery: inquiry.emailDelivery,
  }
}

export function createSupabaseStore(client) {
  return {
    async getCatalog() {
      const { data, error } = await client
        .from('site_content')
        .select('settings, categories, products')
        .eq('id', 1)
        .single()
      assertSuccess('membaca katalog', error)

      const parsed = catalogSchema.safeParse(data)
      if (!parsed.success) throw databaseError('memvalidasi katalog')
      return parsed.data
    },

    async insertInquiry(inquiry) {
      const { error } = await client.from('inquiries').insert(toInquiryRow(inquiry))
      assertSuccess('menyimpan pesan', error)
    },

    async updateInquiryDelivery(id, delivery) {
      const { error } = await client
        .from('inquiries')
        .update({ email_delivery: delivery })
        .eq('id', id)
      assertSuccess('memperbarui status email', error)
    },
  }
}

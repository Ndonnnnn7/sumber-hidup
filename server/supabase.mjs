import { createClient } from '@supabase/supabase-js'
import WebSocket from 'ws'

let client

export function getMissingSupabaseConfig(env = process.env) {
  return [
    !env.SUPABASE_URL?.trim() && 'SUPABASE_URL',
    !env.SUPABASE_SECRET_KEY?.trim() && 'SUPABASE_SECRET_KEY',
  ].filter(Boolean)
}

export function getSupabase(env = process.env) {
  if (client) return client

  const url = env.SUPABASE_URL?.trim()
  const secretKey = env.SUPABASE_SECRET_KEY?.trim()
  const missing = getMissingSupabaseConfig(env)

  if (missing.length) {
    throw new Error(`Konfigurasi Supabase belum lengkap: ${missing.join(', ')}`)
  }

  client = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: { transport: WebSocket },
  })
  return client
}

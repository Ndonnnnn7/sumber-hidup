import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import seed from '../server/seed.json'
import type { Catalog, Product, Settings } from './types'

export const money = (price: number | null) =>
  price === null
    ? 'Hubungi untuk harga'
    : new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(price)
export const productUrl = (p: Product) => `/products/${p.category}/${p.slug}`
export const whatsappUrl = (
  settings: Settings,
  message = 'Halo Sumber Hidup, saya ingin bertanya tentang produk alat tulis.',
) => `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`
export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const body = await response
    .json()
    .catch(() => ({ error: 'Layanan belum tersedia. Silakan coba lagi.' }))
  if (!response.ok) throw new Error(body.error || 'Permintaan gagal. Silakan coba lagi.')
  return body as T
}
type Store = Catalog & {
  favorites: string[]
  toggleFavorite: (id: string) => void
}
const StoreContext = createContext<Store | null>(null)
export function StoreProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(seed)
  const [notice, setNotice] = useState('')
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('sh-favorites') || '[]')
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : []
    } catch {
      return []
    }
  })
  useEffect(() => {
    api<Catalog>('/api/catalog')
      .then(setCatalog)
      .catch(() =>
        setNotice('Katalog offline ditampilkan. Hubungi WhatsApp untuk informasi terbaru.'),
      )
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem('sh-favorites', JSON.stringify(favorites))
    } catch {
      /* Favorites remain available for this visit. */
    }
  }, [favorites])
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 4200)
    return () => clearTimeout(timer)
  }, [notice])
  function toggleFavorite(id: string) {
    const saved = favorites.includes(id)
    setFavorites((current) => (saved ? current.filter((item) => item !== id) : [...current, id]))
    setNotice(saved ? 'Produk dihapus dari pilihanmu.' : 'Produk disimpan ke pilihanmu.')
  }
  return (
    <StoreContext.Provider value={{ ...catalog, favorites, toggleFavorite }}>
      {children}
      <div className={`toast ${notice ? 'visible' : ''}`} role="status">
        {notice}
      </div>
    </StoreContext.Provider>
  )
}
export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('StoreProvider is required')
  return store
}
export function useMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} — Sumber Hidup`
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        description ||
          'Alat tulis pilihan untuk belajar, bekerja, dan setiap ide di antaranya. Temukan koleksinya di Sumber Hidup.',
      )
  }, [title, description])
}
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

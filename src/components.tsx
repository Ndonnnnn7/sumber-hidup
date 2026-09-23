import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  X,
  MessageCircle,
  Leaf,
  PackageCheck,
  BookOpen,
  Plus,
} from 'lucide-react'
import { money, productUrl, useStore, whatsappUrl } from './lib'
import type { Product } from './types'

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      to="/"
      className={`brand ${footer ? 'brand-footer' : ''}`}
      aria-label="Sumber Hidup — beranda"
    >
      sumber hidup<span>.</span>
    </Link>
  )
}
export function ArrowLink({
  to,
  children,
  light = false,
  className = '',
}: {
  to: string
  children: ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <Link to={to} className={`button ${light ? 'button-outline' : ''} ${className}`}>
      {children}
      <ArrowRight size={19} />
    </Link>
  )
}
export function WhatsAppLink({
  children = 'Hubungi kami',
  message,
  className = '',
}: {
  children?: ReactNode
  message?: string
  className?: string
}) {
  const { settings } = useStore()
  return (
    <a
      className={`button ${className}`}
      href={whatsappUrl(settings, message)}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={18} />
      {children}
      <ArrowUpRight size={17} />
    </a>
  )
}
export function FavoriteButton({
  product,
  className = '',
}: {
  product: Product
  className?: string
}) {
  const { favorites, toggleFavorite } = useStore()
  const active = favorites.includes(product.id)
  return (
    <button
      className={`icon-button favorite-button ${active ? 'is-saved' : ''} ${className}`}
      aria-label={`${active ? 'Hapus' : 'Simpan'} ${product.name}${active ? ' dari pilihan' : ''}`}
      aria-pressed={active}
      onClick={() => toggleFavorite(product.id)}
    >
      <Heart size={19} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
export function Modal({
  open,
  onClose,
  title,
  children,
  drawer = false,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  drawer?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (open) {
      dialog?.showModal()
      document.body.style.overflow = 'hidden'
    } else {
      dialog?.close()
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  return (
    <dialog
      ref={ref}
      className={`modal ${drawer ? 'drawer' : ''}`}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-label={title}
    >
      <div className="modal-inner">
        <div className="section-heading">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Tutup">
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
export function Header() {
  const [menu, setMenu] = useState(false)
  const [saved, setSaved] = useState(false)
  const { pathname, search } = useLocation()
  const { favorites, products, settings } = useStore()
  const selection = products.filter((p) => favorites.includes(p.id))
  useEffect(() => {
    setMenu(false)
    setSaved(false)
  }, [pathname, search])
  return (
    <>
      <header className="site-header">
        <Brand />
        <nav className={menu ? 'main-nav nav-open' : 'main-nav'} aria-label="Navigasi utama">
          <NavLink to="/" end onClick={() => setMenu(false)}>
            Home
          </NavLink>
          <Link to="/products?sort=newest">
            Koleksi baru <span className="nav-dot" />
          </Link>
          <NavLink to="/about">Tentang kami</NavLink>
          <NavLink to="/contact">Kontak</NavLink>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button saved-trigger"
            aria-label={`Buka pilihan tersimpan (${selection.length})`}
            onClick={() => setSaved(true)}
          >
            <Heart size={21} />
            {selection.length > 0 && <span className="count-badge">{selection.length}</span>}
          </button>
          <a
            className="button header-contact"
            href={whatsappUrl(settings)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} />
            Hubungi kami
            <ArrowUpRight size={15} />
          </a>
          <button
            className="icon-button mobile-menu"
            aria-label={menu ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <Modal
        open={saved}
        onClose={() => setSaved(false)}
        title={`Pilihanmu (${selection.length})`}
        drawer
      >
        {selection.length ? (
          <>
            <p className="muted">Simpan yang kamu suka. Tanyakan semuanya sekaligus.</p>
            <div className="saved-list">
              {selection.map((p) => (
                <div className="saved-item" key={p.id}>
                  <Link to={productUrl(p)} onClick={() => setSaved(false)}>
                    <img src={p.image} alt={p.name} />
                    <div>
                      <h3>{p.name}</h3>
                      <p>{money(p.price)}</p>
                    </div>
                  </Link>
                  <FavoriteButton product={p} />
                </div>
              ))}
            </div>
            <WhatsAppLink
              className="full-width"
              message={`Halo Sumber Hidup, saya tertarik dengan produk berikut:\n${selection.map((p) => `- ${p.name}`).join('\n')}\nBoleh minta informasi harga dan ketersediaannya?`}
            >
              Tanyakan pilihan saya
            </WhatsAppLink>
            <p className="small muted">Pilihan disimpan di perangkat ini.</p>
          </>
        ) : (
          <div className="empty-state">
            <Heart size={42} strokeWidth={1} />
            <h3>Ruang untuk favoritmu.</h3>
            <p>Ketuk ikon hati pada produk yang kamu suka, lalu temukan kembali di sini.</p>
            <button className="button" onClick={() => setSaved(false)}>
              Mulai menjelajah
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card" data-category={product.category}>
      <div className="product-image-wrap">
        <Link to={productUrl(product)} tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt="" loading="lazy" width="400" height="400" />
        </Link>
        {(product.isNew || !product.inStock) && (
          <span className="tag product-tag">{!product.inStock ? 'Segera kembali' : 'Baru'}</span>
        )}
        <FavoriteButton product={product} className="card-favorite" />
      </div>
      <div className="product-info">
        <Link to={productUrl(product)}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.subtitle}</p>
        <div className="product-bottom">
          <span className={`price ${product.price === null ? 'price-inquiry' : ''}`}>
            {money(product.price)}
          </span>
          <Link
            to={productUrl(product)}
            className="icon-button product-view"
            aria-label={`Lihat ${product.name}`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  )
}
export function MiniProduct({ product }: { product: Product }) {
  return (
    <Link className="mini-product" to={productUrl(product)}>
      <span className="tag">Pilihan baru</span>
      <img src={product.image} alt={product.name} width="180" height="180" />
      <span className="mini-name">{product.name}</span>
      <span className="mini-description">Rencanakan hari baikmu.</span>
      <div>
        <strong>{money(product.price)}</strong>
        <span className="mini-plus">
          <Plus size={18} />
        </span>
      </div>
    </Link>
  )
}
export function ValuesStrip() {
  return (
    <div className="values-strip">
      <div>
        <Leaf size={24} strokeWidth={1.3} />
        <span>
          <strong>Dipilih dengan hati</strong>
          <small>Detail kecil, kualitas berarti.</small>
        </span>
      </div>
      <div>
        <BookOpen size={24} strokeWidth={1.3} />
        <span>
          <strong>Untuk setiap cerita</strong>
          <small>Dari ruang kelas ke ruang kerja.</small>
        </span>
      </div>
      <div>
        <PackageCheck size={25} strokeWidth={1.3} />
        <span>
          <strong>Kebutuhan besar? Bisa.</strong>
          <small>Terbuka untuk grosir & institusi.</small>
        </span>
      </div>
    </div>
  )
}
export function Footer() {
  const { settings } = useStore()
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Brand footer />
          <p>Untuk setiap ide, setiap hari.</p>
        </div>
        <div className="footer-links">
          <Link to="/products">Katalog produk</Link>
          <Link to="/about">Cerita kami</Link>
          <Link to="/contact?type=bulk">Grosir & kemitraan</Link>
          <Link to="/contact">
            Hubungi kami
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <a
          className="footer-whatsapp"
          href={whatsappUrl(settings)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={20} />
          <span>
            Mari mulai percakapan<strong>+{settings.whatsapp}</strong>
          </span>
          <ArrowUpRight size={19} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sumber Hidup. Setiap ide punya tempat.</span>
        <span>
          Dirangkai dengan perhatian <Heart size={12} />
        </span>
      </div>
    </footer>
  )
}

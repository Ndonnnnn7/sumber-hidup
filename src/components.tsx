import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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

const MotionLink = motion.create(Link)
const MotionHeart = motion.create(Heart)

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      to="/"
      className={`brand ${footer ? 'brand-footer' : 'brand-navbar'}`}
      aria-label="Sumber Hidup — beranda"
    >
      {footer ? 'sumber hidup' : 'Sumber Hidup'}
      <span>.</span>
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
    <MotionLink
      to={to}
      className={`button ${light ? 'button-outline' : ''} ${className}`}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
    >
      {children}
      <ArrowRight size={19} />
    </MotionLink>
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
    <motion.a
      className={`button ${className}`}
      href={whatsappUrl(settings, message)}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.975 }}
    >
      <MessageCircle size={18} />
      {children}
      <ArrowUpRight size={17} />
    </motion.a>
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
    <motion.button
      className={`icon-button favorite-button ${active ? 'is-saved' : ''} ${className}`}
      aria-label={`${active ? 'Hapus' : 'Simpan'} ${product.name}${active ? ' dari pilihan' : ''}`}
      aria-pressed={active}
      onClick={() => toggleFavorite(product.id)}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.82 }}
    >
      <MotionHeart
        size={19}
        fill={active ? 'currentColor' : 'none'}
        animate={active ? { scale: [1, 1.3, 1], rotate: [0, -8, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.34 }}
      />
    </motion.button>
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
      <motion.div
        className="modal-inner"
        initial={{ opacity: 0, x: drawer ? 28 : 0, y: drawer ? 0 : 14 }}
        animate={open ? { opacity: 1, x: 0, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.24 }}
      >
        <div className="section-heading">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Tutup">
            <X size={22} />
          </button>
        </div>
        {children}
      </motion.div>
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
  const reduceMotion = useReducedMotion()
  return (
    <motion.article
      className="product-card"
      data-category={product.category}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      transition={{ duration: reduceMotion ? 0 : 0.38 }}
    >
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
    </motion.article>
  )
}
export function MiniProduct({ product }: { product: Product }) {
  const reduceMotion = useReducedMotion()
  return (
    <MotionLink
      className="mini-product"
      to={productUrl(product)}
      initial={reduceMotion ? false : { opacity: 0, x: 22, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={reduceMotion ? undefined : { y: -5, rotate: -0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.26 }}
    >
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
    </MotionLink>
  )
}
export function ValuesStrip() {
  const reduceMotion = useReducedMotion()
  const items = [
    {
      icon: <Leaf size={24} strokeWidth={1.3} />,
      title: 'Dipilih dengan hati',
      copy: 'Detail kecil, kualitas berarti.',
    },
    {
      icon: <BookOpen size={24} strokeWidth={1.3} />,
      title: 'Untuk setiap cerita',
      copy: 'Dari ruang kelas ke ruang kerja.',
    },
    {
      icon: <PackageCheck size={25} strokeWidth={1.3} />,
      title: 'Kebutuhan besar? Bisa.',
      copy: 'Terbuka untuk grosir & institusi.',
    },
  ]
  return (
    <motion.div
      className="values-strip"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.09 } },
      }}
    >
      {items.map((item) => (
        <motion.div
          key={item.title}
          variants={{
            hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          {item.icon}
          <span>
            <strong>{item.title}</strong>
            <small>{item.copy}</small>
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}
export function Footer() {
  const { settings } = useStore()
  return (
    <motion.footer
      className="site-footer"
      initial={{ y: 18 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45 }}
    >
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
    </motion.footer>
  )
}

import { useDeferredValue, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Pencil,
  Phone,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react'
import {
  ArrowLink,
  FavoriteButton,
  MiniProduct,
  Modal,
  ProductCard,
  ValuesStrip,
  WhatsAppLink,
} from './components'
import { api, money, productUrl, useMeta, useStore, whatsappUrl } from './lib'
import type { Product } from './types'

const MotionLink = motion.create(Link)
const STORE_LOCATION_URL = 'https://share.google/lAI1WhzWJMVK89rYQ'

export function HomePage() {
  const { settings, products, categories } = useStore()
  useMeta('Untuk setiap ide, setiap hari.', settings.heroSubtitle)
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroImageY = useTransform(heroScroll, [0, 1], [0, 54])
  const featured =
    products.find((p) => p.id === settings.featuredProductId) || products.find((p) => p.featured)
  const popular = [
    ...products.filter((p) => p.featured && p.id !== featured?.id),
    ...(featured ? [featured] : []),
  ].slice(0, 5)
  return (
    <div className="home-page">
      <motion.section
        ref={heroRef}
        className="hero"
        aria-labelledby="hero-title"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.992 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.55 }}
      >
        <motion.img
          className="hero-image"
          src={settings.heroImage}
          alt="Koleksi buku, pensil, dan perlengkapan menulis untuk menemani setiap ide"
          fetchPriority="high"
          width="1536"
          height="1024"
          style={{ y: reduceMotion ? 0 : heroImageY, scale: reduceMotion ? 1 : 1.045 }}
        />
        <div className="hero-shade" />
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : 0.12 }}
        >
          <h1 id="hero-title">
            {settings.heroTitle.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < settings.heroTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p>{settings.heroSubtitle}</p>
          <ArrowLink to="/products">Jelajahi koleksi</ArrowLink>
          <div className="hero-note">
            <div className="mini-circles">
              <span>
                <Pencil size={16} />
              </span>
              <span>
                <BookOpen size={16} />
              </span>
              <span>
                <Heart size={16} />
              </span>
            </div>
            <span>
              Dari catatan kecil,
              <br />
              jadi sesuatu yang berarti.
            </span>
          </div>
        </motion.div>
        {featured && <MiniProduct product={featured} />}
        <a className="hero-scroll" href="#collections" aria-label="Jelajahi kategori">
          <ArrowDown size={18} />
        </a>
      </motion.section>
      <motion.section
        className="collections-section"
        id="collections"
        aria-label="Cerita dan kategori produk"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <div className="mission-copy">
          <span className="eyebrow">LEBIH DARI ALAT TULIS</span>
          <h2>
            Teman kecil.
            <br /> Untuk langkah besar.
          </h2>
          <p>
            Kami percaya, ide yang baik dimulai dari hal sederhana. Alat tulis yang nyaman, meja
            yang rapi, dan ruang untuk berimajinasi.
          </p>
          <ArrowLink to="/about" light>
            Cerita kami
          </ArrowLink>
        </div>
        <div className="category-grid">
          {categories.slice(0, 4).map((category) => (
            <MotionLink
              className={`category-card category-${category.id}`}
              data-category={category.id}
              to={`/products?category=${category.id}`}
              key={category.id}
              whileHover={reduceMotion ? undefined : { y: -7 }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              <div>
                <h3>{category.name}</h3>
                <ArrowUpRight size={19} />
              </div>
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                width="300"
                height="300"
              />
              <span className="category-explore">
                Temukan koleksi <ArrowRight size={14} />
              </span>
            </MotionLink>
          ))}
        </div>
      </motion.section>
      {featured && (
        <motion.section
          className="feature-banner"
          aria-label="Produk pilihan"
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: reduceMotion ? 0 : 0.52 }}
        >
          <div className="feature-tags">
            <span>Estetik</span>
            <span>Fungsional</span>
            <span>Sepenuh hati</span>
          </div>
          <span className="feature-wordmark" aria-hidden="true">
            sumber hidup.
          </span>
          <div className="feature-copy">
            <span className="tag">PILIHAN SUMBER HIDUP</span>
            <h2>
              {featured.name}.<br />
              Ruang untuk rencana besarmu.
            </h2>
            <p>
              Tulis niatmu. Temukan fokusmu.
              <br />
              Jalani hari dengan lebih berarti.
            </p>
            <strong className="feature-price">{money(featured.price)}</strong>
            <div className="feature-actions">
              <ArrowLink to={productUrl(featured)}>Kenali lebih dekat</ArrowLink>
              <FavoriteButton product={featured} />
            </div>
          </div>
          <MotionLink
            to={productUrl(featured)}
            className="feature-image-link"
            tabIndex={-1}
            aria-hidden="true"
            whileHover={reduceMotion ? undefined : { rotate: -7, scale: 1.025 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
          >
            <img
              src={
                featured.image === '/images/planner.webp'
                  ? '/images/planner-cutout.webp'
                  : featured.image
              }
              alt=""
              loading="lazy"
              width="900"
              height="900"
            />
          </MotionLink>
          <span className="feature-side-note">YOUR IDEAS, BEAUTIFULLY KEPT.</span>
        </motion.section>
      )}
      <motion.section
        className="popular-section"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">DIPILIH UNTUKMU</span>
            <h2>Favorit sehari-hari</h2>
          </div>
          <ArrowLink to="/products" light>
            Lihat semua
          </ArrowLink>
        </div>
        <div className="products-grid home-products">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <p className="catalog-note">
          Koleksi inspirasi untuk harimu. Konfirmasi harga dan ketersediaan melalui WhatsApp.
        </p>
      </motion.section>
      <ValuesStrip />
      <motion.section
        className="bulk-banner"
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: reduceMotion ? 0 : 0.46 }}
      >
        <div>
          <span className="eyebrow">TUMBUH BERSAMA</span>
          <h2>Ide besar, kebutuhan lebih banyak?</h2>
          <p>Untuk sekolah, kantor, atau usahamu. Mari temukan pilihan yang tepat bersama.</p>
        </div>
        <ArrowLink to="/contact?type=bulk">Bicarakan kebutuhanmu</ArrowLink>
      </motion.section>
    </div>
  )
}

export function CatalogPage() {
  const { products, categories } = useStore()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') || '')
  const deferredSearch = useDeferredValue(search)
  const category = params.get('category') || ''
  const subcategory = params.get('subcategory') || ''
  const sort = params.get('sort') || 'popular'
  const price = params.get('price') || ''
  const stockParam = params.get('stock') === 'true'
  const [inStock, setInStock] = useState(stockParam)
  useEffect(() => setInStock(stockParam), [stockParam])
  const currentPage = Math.max(1, Number(params.get('page')) || 1)
  const perPage = 8
  useEffect(() => {
    setSearch(params.get('q') || '')
  }, [params])
  function update(values: Record<string, string>) {
    const next = new URLSearchParams(params)
    next.delete('page')
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    setParams(next, { replace: true })
  }
  const filtered = useMemo(() => {
    const query = deferredSearch.toLocaleLowerCase('id').trim()
    const result = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!subcategory || p.subcategory === subcategory) &&
        (!query ||
          `${p.name} ${p.subtitle} ${p.description}`.toLocaleLowerCase('id').includes(query)) &&
        (!inStock || p.inStock) &&
        (!price ||
          (p.price !== null &&
            (price === 'under50'
              ? p.price < 50000
              : price === '50to100'
                ? p.price >= 50000 && p.price <= 100000
                : p.price > 100000))),
    )
    return result.sort((a, b) =>
      sort === 'price-low'
        ? (a.price ?? Infinity) - (b.price ?? Infinity)
        : sort === 'price-high'
          ? (b.price ?? -1) - (a.price ?? -1)
          : sort === 'newest'
            ? Number(b.isNew) - Number(a.isNew)
            : Number(b.featured) - Number(a.featured),
    )
  }, [products, category, subcategory, deferredSearch, sort, price, inStock])
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(currentPage, totalPages)
  const shown = filtered.slice((page - 1) * perPage, page * perPage)
  const activeCategory = categories.find((c) => c.id === category)
  const activeFilters = Boolean(category || subcategory || price || inStock || search)
  return (
    <div className="inner-page catalog-page">
      <div className="page-heading">
        <span className="eyebrow">TEMUKAN TEMAN UNTUK IDEMU</span>
        <h1>{activeCategory?.name || 'Hal kecil yang kamu suka.'}</h1>
        <p>Untuk catatan pertama, rencana berikutnya, dan semua yang ingin kamu ciptakan.</p>
      </div>
      <div className="catalog-tools">
        <div className="search-field">
          <Search size={20} />
          <label className="sr-only" htmlFor="product-search">
            Cari produk
          </label>
          <input
            id="product-search"
            type="search"
            placeholder="Cari planner, buku, atau teman menulismu…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              update({ q: event.target.value })
            }}
          />
          {search && (
            <button
              className="icon-button"
              onClick={() => {
                setSearch('')
                update({ q: '' })
              }}
              aria-label="Hapus pencarian"
            >
              <X size={17} />
            </button>
          )}
        </div>
        <div className="sort-field">
          <SlidersHorizontal size={17} />
          <label className="sr-only" htmlFor="sort">
            Urutkan produk
          </label>
          <select id="sort" value={sort} onChange={(event) => update({ sort: event.target.value })}>
            <option value="popular">Pilihan populer</option>
            <option value="newest">Koleksi terbaru</option>
            <option value="price-low">Harga terendah</option>
            <option value="price-high">Harga tertinggi</option>
          </select>
        </div>
      </div>
      <div className="category-chips" aria-label="Filter kategori">
        <button
          className={!category ? 'chip active' : 'chip'}
          onClick={() => update({ category: '', subcategory: '' })}
        >
          Semua koleksi <span>{products.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            data-category={c.id}
            className={category === c.id ? 'chip active' : 'chip'}
            onClick={() => update({ category: c.id, subcategory: '' })}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <div>
          <label htmlFor="price-filter">Harga</label>
          <select
            id="price-filter"
            value={price}
            onChange={(event) => update({ price: event.target.value })}
          >
            <option value="">Semua harga</option>
            <option value="under50">Di bawah Rp50.000</option>
            <option value="50to100">Rp50.000–Rp100.000</option>
            <option value="over100">Di atas Rp100.000</option>
          </select>
          {activeCategory && (
            <>
              <label className="sr-only" htmlFor="subcategory">
                Subkategori
              </label>
              <select
                id="subcategory"
                value={subcategory}
                onChange={(event) => update({ subcategory: event.target.value })}
              >
                <option value="">Semua subkategori</option>
                {activeCategory.subcategories.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </>
          )}
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => {
                setInStock(event.target.checked)
                update({ stock: event.target.checked ? 'true' : '' })
              }}
            />
            Tersedia saja
          </label>
        </div>
        <span className="result-count" aria-live="polite">
          {filtered.length} produk ditemukan
        </span>
      </div>
      {activeFilters && (
        <button
          className="text-button reset-filter"
          onClick={() => {
            setSearch('')
            setParams({})
          }}
        >
          <X size={14} />
          Hapus semua filter
        </button>
      )}
      {shown.length ? (
        <div className="products-grid catalog-products">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state catalog-empty">
          <Search size={40} strokeWidth={1} />
          <h2>Belum menemukan yang pas?</h2>
          <p>Coba kata kunci lain atau hapus filter untuk melihat lebih banyak pilihan.</p>
          <button
            className="button"
            onClick={() => {
              setSearch('')
              setParams({})
            }}
          >
            Lihat semua koleksi
            <ArrowRight size={17} />
          </button>
        </div>
      )}
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Halaman katalog">
          <button
            className="icon-button"
            disabled={page === 1}
            aria-label="Halaman sebelumnya"
            onClick={() => {
              const next = new URLSearchParams(params)
              next.set('page', String(page - 1))
              setParams(next)
            }}
          >
            <ChevronLeft size={19} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((n) => (
            <button
              className={`icon-button ${n === page ? 'active' : ''}`}
              key={n}
              aria-label={`Halaman ${n}`}
              aria-current={n === page ? 'page' : undefined}
              onClick={() => {
                const next = new URLSearchParams(params)
                next.set('page', String(n))
                setParams(next)
              }}
            >
              {n}
            </button>
          ))}
          <button
            className="icon-button"
            disabled={page === totalPages}
            aria-label="Halaman berikutnya"
            onClick={() => {
              const next = new URLSearchParams(params)
              next.set('page', String(page + 1))
              setParams(next)
            }}
          >
            <ChevronRight size={19} />
          </button>
        </nav>
      )}
      <div className="catalog-assistance">
        <MessageCircle size={23} />
        <span>Butuh rekomendasi atau penawaran untuk jumlah besar?</span>
        <Link to="/contact?type=bulk">
          Kami siap membantu <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  )
}

export function ProductPage() {
  const { category, slug } = useParams()
  const { products, categories } = useStore()
  const product = products.find((p) => p.slug === slug && p.category === category)
  useMeta(product?.name || 'Produk tidak ditemukan', product?.description)
  if (!product) return <NotFoundPage />
  return (
    <ProductDetail
      key={product.id}
      product={product}
      categoryName={categories.find((c) => c.id === product.category)?.name || ''}
      related={products
        .filter((p) => p.id !== product.id)
        .sort(
          (a, b) =>
            Number(b.category === product.category) - Number(a.category === product.category),
        )
        .slice(0, 4)}
    />
  )
}
function ProductDetail({
  product,
  categoryName,
  related,
}: {
  product: Product
  categoryName: string
  related: Product[]
}) {
  const [color, setColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image)
  const [zoom, setZoom] = useState(false)
  const images = [product.image, ...product.images]
  return (
    <div className="inner-page product-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Beranda</Link>
        <ChevronRight size={13} />
        <Link to="/products">Katalog</Link>
        <ChevronRight size={13} />
        <Link to={`/products?category=${product.category}`}>{categoryName}</Link>
        <ChevronRight size={13} />
        <span>{product.name}</span>
      </nav>
      <div className="product-detail-grid">
        <div className="product-gallery">
          <button
            className="main-product-image"
            onClick={() => setZoom(true)}
            aria-label={`Perbesar foto ${product.name}`}
          >
            <img src={selectedImage} alt={product.name} width="900" height="900" />
            <span>
              <ZoomIn size={20} />
            </span>
          </button>
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  className={selectedImage === src ? 'selected' : ''}
                  onClick={() => setSelectedImage(src)}
                  aria-label={`Lihat foto ${index + 1}`}
                  aria-pressed={selectedImage === src}
                >
                  <img src={src} alt={`${product.name}, foto ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
          <p className="small muted">Warna pada layar dapat sedikit berbeda dari produk asli.</p>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{categoryName}</span>
          <h1>{product.name}</h1>
          <p className="detail-subtitle">{product.subtitle}</p>
          <strong className="detail-price">
            {money(product.price)}
            {product.price !== null && <small> / {product.unit}</small>}
          </strong>
          <span className={`stock-label ${!product.inStock ? 'out-of-stock' : ''}`}>
            {product.inStock ? <CheckCircle2 size={15} /> : <PackageCheck size={15} />}
            {product.inStock
              ? 'Tersedia untuk ditanyakan'
              : 'Stok habis · tanyakan jadwal tersedia'}
          </span>
          <p className="detail-description">{product.description}</p>
          <fieldset className="variant-options">
            <legend>
              Warna <span>— {color}</span>
            </legend>
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${color === c ? 'active' : ''}`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
              >
                {c}
                {color === c && <Check size={14} />}
              </button>
            ))}
          </fieldset>
          <div className="quantity-row">
            <label htmlFor="quantity">Jumlah yang ingin ditanyakan</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10000"
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Math.min(10000, Number(event.target.value) || 1)))
              }
            />
            <span>{product.unit}</span>
          </div>
          <div className="detail-actions">
            <WhatsAppLink
              message={`Halo Sumber Hidup, saya ingin ${product.inStock ? 'bertanya tentang' : 'menanyakan jadwal stok'} ${product.name}.\nWarna: ${color}\nJumlah: ${quantity} ${product.unit}\nBoleh minta informasi harga dan ketersediaannya?`}
            >
              {product.inStock ? 'Tanyakan via WhatsApp' : 'Tanyakan ketersediaan'}
            </WhatsAppLink>
            <FavoriteButton product={product} />
          </div>
          <p className="small muted">
            Harga dan ketersediaan dikonfirmasi oleh tim kami sebelum pemesanan.
          </p>
          <details className="specifications" open>
            <summary>
              Detail yang perlu kamu tahu <PlusMinus />
            </summary>
            <dl>
              <div>
                <dt>Bahan</dt>
                <dd>{product.material}</dd>
              </div>
              <div>
                <dt>Ukuran</dt>
                <dd>{product.size}</dd>
              </div>
              <div>
                <dt>Satuan</dt>
                <dd>Per {product.unit}</dd>
              </div>
              <div>
                <dt>Kategori</dt>
                <dd>{categoryName}</dd>
              </div>
            </dl>
          </details>
          <details className="specifications">
            <summary>
              Pemesanan & pengiriman <PlusMinus />
            </summary>
            <p>
              Hubungi kami melalui WhatsApp untuk konfirmasi jumlah, alamat tujuan, ongkir, dan
              pilihan pembayaran. Untuk kebutuhan sekolah, kantor, atau reseller, kami dapat
              menyiapkan penawaran sesuai kebutuhan.
            </p>
          </details>
        </div>
      </div>
      <section className="related-section">
        <div className="section-heading">
          <h2>Mungkin kamu juga suka</h2>
          <ArrowLink to="/products" light>
            Lihat koleksi
          </ArrowLink>
        </div>
        <div className="products-grid related-products">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <Modal open={zoom} onClose={() => setZoom(false)} title={product.name}>
        <img className="zoom-image" src={selectedImage} alt={product.name} />
      </Modal>
    </div>
  )
}
function PlusMinus() {
  return <span aria-hidden="true">+</span>
}

export function AboutPage() {
  const { settings } = useStore()
  return (
    <div className="inner-page about-page">
      <section className="about-hero">
        <div>
          <span className="eyebrow">CERITA SUMBER HIDUP</span>
          <h1>
            Ide yang berarti,
            <br />
            berawal dari
            <br />
            <em>hal sederhana.</em>
          </h1>
          <p>Selembar kertas. Sebuah pena. Dan keberanian untuk memulai.</p>
          <ArrowLink to="/products">Temukan teman menulismu</ArrowLink>
        </div>
        <img
          src={settings.heroImage}
          alt="Koleksi alat tulis untuk belajar, bekerja, dan mengembangkan ide"
          width="768"
          height="900"
        />
      </section>
      <section className="story-section">
        <span className="eyebrow">ALASAN KAMI ADA</span>
        <div>
          <h2>
            Memberi ruang bagi setiap ide
            <br />
            untuk tumbuh.
          </h2>
          <p>
            Sumber Hidup hadir untuk menemani kegiatan belajar, bekerja, dan berkarya melalui alat
            tulis yang fungsional dan menyenangkan untuk digunakan. Kami percaya bahwa perlengkapan
            sederhana yang dipilih dengan baik dapat membuat rutinitas terasa lebih berarti.
          </p>
          <p>
            Dari buku catatan untuk hari pertama sekolah hingga perlengkapan untuk sebuah tim, kami
            ingin menjadi tempat menemukan kebutuhan alat tulis dengan mudah. Kualitas, kenyamanan,
            dan perhatian pada detail menjadi dasar setiap pilihan kami.
          </p>
        </div>
      </section>
      <div className="about-values">
        <article>
          <Leaf size={28} strokeWidth={1.3} />
          <h3>Dipilih dengan perhatian.</h3>
          <p>
            Kami mengutamakan produk yang berguna, nyaman, dan hadir dengan detail yang
            menyenangkan.
          </p>
        </article>
        <article>
          <BookOpen size={28} strokeWidth={1.3} />
          <h3>Belajar tanpa batas.</h3>
          <p>
            Setiap orang layak punya ruang untuk belajar, mencoba, dan menuliskan cerita mereka
            sendiri.
          </p>
        </article>
        <article>
          <Sparkles size={28} strokeWidth={1.3} />
          <h3>Tumbuh bersama.</h3>
          <p>
            Kami terbuka untuk bekerja sama dengan sekolah, kantor, komunitas, dan usaha lainnya.
          </p>
        </article>
      </div>
      <section className="about-quote">
        <span className="eyebrow">SEDERHANA. FUNGSIONAL. BERARTI.</span>
        <p>
          “Karena setiap ide kecil
          <br />
          bisa menjadi awal sesuatu yang besar.”
        </p>
        <span className="brand">Sumber Hidup.</span>
      </section>
      <section className="bulk-banner">
        <div>
          <h2>Mari menulis cerita berikutnya.</h2>
          <p>Punya pertanyaan atau ingin menjadi mitra? Kami senang mendengarnya.</p>
        </div>
        <ArrowLink to="/contact">Mulai percakapan</ArrowLink>
      </section>
    </div>
  )
}

export function ContactPage() {
  const { settings } = useStore()
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    name: '',
    contact: '',
    type: params.get('type') === 'bulk' ? 'Grosir / institusi' : 'Produk',
    message: '',
    website: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')
  const [error, setError] = useState('')
  const [inquiryId, setInquiryId] = useState('')
  const [emailStatus, setEmailStatus] = useState<'sent' | 'failed' | 'unconfigured'>('unconfigured')
  useEffect(() => {
    if (params.get('type') === 'bulk')
      setForm((current) => ({ ...current, type: 'Grosir / institusi' }))
  }, [params])
  const setField = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))
  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const result = await api<{ id?: string; emailStatus?: 'sent' | 'failed' | 'unconfigured' }>(
        '/api/inquiries',
        {
          method: 'POST',
          body: JSON.stringify(form),
        },
      )
      setInquiryId(result.id || '')
      setEmailStatus(result.emailStatus || 'unconfigured')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pesan belum terkirim. Silakan coba kembali.')
      setStatus('idle')
    }
  }
  return (
    <div className="inner-page contact-page">
      <div className="page-heading">
        <span className="eyebrow">KAMI SIAP MENDENGARKAN</span>
        <h1>
          Percakapan baik
          <br />
          dimulai dari sini.
        </h1>
        <p>Tentang produk, kebutuhan tim, atau ide kerja sama. Mari bicarakan.</p>
      </div>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-whatsapp-card">
            <MessageCircle size={30} strokeWidth={1.3} />
            <h2>Sapa kami di WhatsApp.</h2>
            <p>Untuk informasi produk dan penawaran, hubungi tim Sumber Hidup langsung.</p>
            <WhatsAppLink>Mulai percakapan</WhatsAppLink>
            <a className="phone-text" href={`tel:+${settings.whatsapp}`}>
              +{settings.whatsapp}
            </a>
          </div>
          <div className="contact-details">
            <div>
              <Phone size={20} />
              <span>
                <strong>Telepon</strong>
                <a href={`tel:+${settings.whatsapp}`}>+{settings.whatsapp}</a>
              </span>
            </div>
            {settings.email && (
              <div>
                <Mail size={20} />
                <span>
                  <strong>Email</strong>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </span>
              </div>
            )}
            <div>
              <MapPin size={20} />
              <span>
                <strong>Kunjungi kami</strong>
                {settings.address && <p>{settings.address}</p>}
                <a href={STORE_LOCATION_URL} target="_blank" rel="noreferrer">
                  Lihat lokasi di Google Maps <ArrowUpRight size={14} />
                </a>
              </span>
            </div>
            <div>
              <BookOpen size={20} />
              <span>
                <strong>Jam operasional</strong>
                {settings.hours ? (
                  <p className="preserve-lines">{settings.hours}</p>
                ) : (
                  <a
                    href={whatsappUrl(
                      settings,
                      'Halo Sumber Hidup, boleh minta informasi jam operasional toko?',
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tanyakan jam kunjungan <ArrowUpRight size={14} />
                  </a>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="contact-form-panel">
          {status === 'success' ? (
            <div className="form-success" role="status">
              <CheckCircle2 size={52} strokeWidth={1.3} />
              <span className="eyebrow">
                {emailStatus === 'sent' ? 'PESAN TERKIRIM' : 'PESAN TERSIMPAN'}
              </span>
              <h2>Terima kasih, {form.name}.</h2>
              <p>
                {emailStatus === 'sent'
                  ? 'Pesanmu sudah diteruskan ke email tim Sumber Hidup. Kami dapat membalas melalui kontak yang kamu cantumkan.'
                  : emailStatus === 'unconfigured'
                    ? 'Pesanmu tersimpan, tetapi pemberitahuan email belum aktif. Silakan lanjutkan melalui WhatsApp agar tim kami menerima pesanmu.'
                    : 'Pesanmu tersimpan, tetapi pemberitahuan email gagal dikirim. Silakan lanjutkan melalui WhatsApp agar tim kami menerima pesanmu.'}
              </p>
              {inquiryId && <p className="small muted">Referensi: {inquiryId.slice(0, 8)}</p>}
              <WhatsAppLink
                message={`Halo Sumber Hidup, saya ${form.name}. Saya baru mengirim pertanyaan ${form.type} melalui website (ref: ${inquiryId.slice(0, 8)}).\n${form.message}`}
              >
                Lanjutkan di WhatsApp
              </WhatsAppLink>
              <button
                className="text-button"
                onClick={() => {
                  setStatus('idle')
                  setForm({ name: '', contact: '', type: 'Produk', message: '', website: '' })
                }}
              >
                Kirim pesan lain
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2>Atau tinggalkan pesan.</h2>
              <p className="muted">Ceritakan kebutuhanmu, kami bantu menemukan pilihannya.</p>
              <label htmlFor="contact-name">
                Nama lengkap <span>*</span>
              </label>
              <input
                id="contact-name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Nama kamu"
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
              />
              <label htmlFor="contact-info">
                Email kamu <span>*</span>
              </label>
              <input
                id="contact-info"
                type="email"
                autoComplete="email"
                required
                minLength={7}
                maxLength={150}
                placeholder="nama@gmail.com"
                value={form.contact}
                onChange={(event) => setField('contact', event.target.value)}
              />
              <label htmlFor="contact-type">Apa yang ingin kamu tanyakan?</label>
              <select
                id="contact-type"
                value={form.type}
                onChange={(event) => setField('type', event.target.value)}
              >
                <option>Produk</option>
                <option>Grosir / institusi</option>
                <option>Kemitraan</option>
                <option>Lainnya</option>
              </select>
              <label htmlFor="contact-message">
                Pesanmu <span>*</span>
              </label>
              <textarea
                id="contact-message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                placeholder="Tuliskan produk, jumlah, atau kebutuhan yang ingin kamu diskusikan…"
                value={form.message}
                onChange={(event) => setField('message', event.target.value)}
              />
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => setField('website', event.target.value)}
                />
              </div>
              {error && (
                <p className="error-message" role="alert">
                  {error}
                </p>
              )}
              <button className="button full-width" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Mengirim pesan…' : 'Kirim pesan'}
                <ArrowRight size={18} />
              </button>
              <p className="form-privacy">
                Emailmu hanya digunakan untuk membalas pertanyaan ini. Tidak perlu login Google.
              </p>
            </form>
          )}
        </div>
      </div>
      {settings.address && (
        <section className="map-section">
          <h2>Temukan Sumber Hidup</h2>
          <iframe
            title="Lokasi toko Sumber Hidup"
            src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}
    </div>
  )
}
export function NotFoundPage() {
  useMeta('Halaman tidak ditemukan')
  return (
    <div className="empty-state not-found">
      <span className="eyebrow">404 · SEBUAH HALAMAN KOSONG</span>
      <h1>Cerita ini belum ditulis.</h1>
      <p>
        Halaman atau produk yang kamu cari tidak tersedia. Masih ada banyak ide untuk dijelajahi.
      </p>
      <ArrowLink to="/products">Kembali ke koleksi</ArrowLink>
    </div>
  )
}

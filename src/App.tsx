import { Route, Routes } from 'react-router-dom'
import { StoreProvider, ScrollToTop } from './lib'
import { Footer, Header } from './components'
import { AboutPage, CatalogPage, ContactPage, HomePage, NotFoundPage, ProductPage } from './pages'

export default function App() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      <div className="site-shell">
        <Header />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<CatalogPage />} />
            <Route path="/products/:category/:slug" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}

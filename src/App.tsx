import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider, ScrollToTop } from './lib'
import { Footer, Header } from './components'
import { AboutPage, CatalogPage, ContactPage, HomePage, NotFoundPage, ProductPage } from './pages'

export default function App() {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
      <StoreProvider>
        <ScrollToTop />
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <div className="site-shell">
          <Header />
          <main id="main-content">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </StoreProvider>
    </MotionConfig>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="route-stage"
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: reduceMotion ? 0 : 0.24 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:category/:slug" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export type Product = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  category: string
  subcategory: string
  price: number | null
  image: string
  images: string[]
  material: string
  size: string
  unit: string
  colors: string[]
  inStock: boolean
  featured: boolean
  isNew: boolean
}
export type Category = { id: string; name: string; image: string; subcategories: string[] }
export type Settings = {
  whatsapp: string
  email: string
  address: string
  hours: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  featuredProductId: string
}
export type Catalog = { products: Product[]; categories: Category[]; settings: Settings }

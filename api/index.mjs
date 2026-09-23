import app from '../server/index.mjs'

const allowedApiRoutes = new Set(['/api/catalog', '/api/inquiries'])

export function getRoutedUrl(requestUrl) {
  const url = new URL(requestUrl, 'http://vercel.internal')
  const route = url.searchParams.get('route') || '/api/unknown'
  url.searchParams.delete('route')
  const query = url.searchParams.toString()
  const pathname =
    route.startsWith('/api/') && !allowedApiRoutes.has(route) ? '/api/unknown' : route
  return `${pathname}${query ? `?${query}` : ''}`
}

export default function handler(req, res) {
  req.url = getRoutedUrl(req.url)
  return app(req, res)
}

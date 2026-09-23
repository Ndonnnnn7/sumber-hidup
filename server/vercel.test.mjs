import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getRoutedUrl } from '../api/index.mjs'

test('Vercel rewrite routes only known public endpoints', () => {
  assert.equal(getRoutedUrl('/api/index?route=/api/catalog'), '/api/catalog')
  assert.equal(
    getRoutedUrl('/api/index?route=/api/inquiries&source=contact'),
    '/api/inquiries?source=contact',
  )
  assert.equal(getRoutedUrl('/api/index?route=/sitemap.xml'), '/sitemap.xml')
  assert.equal(getRoutedUrl('/api/index?route=/products/notebook/item-1'), '/products/notebook/item-1')
  assert.equal(getRoutedUrl('/api/index?route=/api/private'), '/api/unknown')
})

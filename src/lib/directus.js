import { createDirectus, rest, staticToken } from '@directus/sdk'

const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN
const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL

if (!DIRECTUS_URL && !import.meta.env.DEV) {
  throw new Error('Missing VITE_DIRECTUS_URL for Directus client configuration')
}

if (!DIRECTUS_TOKEN) {
  // Client-side tokens are public by nature; keep this token read-only in Directus.
  if (!import.meta.env.DEV) {
    console.warn('VITE_DIRECTUS_TOKEN is missing; requests to protected collections may fail')
  }
}

const client = createDirectus(DIRECTUS_URL || 'http://localhost:8055')
  .with(DIRECTUS_TOKEN ? staticToken(DIRECTUS_TOKEN) : (directus) => directus)
  .with(rest())

export default client

export function assetUrl(value) {
  if (!value) return ''
  if (typeof value === 'object' && value.id) {
    return `${DIRECTUS_URL}/assets/${value.id}`
  }
  if (typeof value === 'string') {
    if (value.startsWith('http') || value.startsWith('assets/') || value.startsWith('/')) {
      return value
    }
    return `${DIRECTUS_URL}/assets/${value}`
  }
  return ''
}

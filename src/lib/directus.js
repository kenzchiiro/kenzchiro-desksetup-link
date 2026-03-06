import { createDirectus, rest, staticToken } from '@directus/sdk'

const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN

// ใช้ /directus เสมอ (relative path)
// dev  → Vite proxy (/directus → VITE_DIRECTUS_URL) ใน vite.config.js
// prod → Nginx proxy (/directus → Directus server) ใน nginx.conf
const DIRECTUS_URL = '/directus'

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest())

export default client

/**
 * แปลง file UUID จาก Directus → URL สำหรับแสดงรูป
 * - ถ้าเป็น UUID → `/directus/assets/${id}`
 * - ถ้าเป็น object { id } (จาก relation) → ใช้ id นั้น
 * - ถ้าเป็น absolute URL อยู่แล้ว → คืนค่าเดิม
 */
export function assetUrl(value) {
  if (!value) return ''
  if (typeof value === 'object' && value.id) {
    return `/directus/assets/${value.id}`
  }
  if (typeof value === 'string') {
    if (value.startsWith('http')) return value   // absolute URL → ไม่แตะ
    if (value.startsWith('/')) return value       // local path → ไม่แตะ
    // ถือว่าเป็น UUID
    return `/directus/assets/${value}`
  }
  return ''
}

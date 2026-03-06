import { createDirectus, rest, staticToken } from '@directus/sdk'

const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN

// dev → ใช้ Vite proxy (/directus) เพื่อหลีกเลี่ยง SSL cert issue
// prod → ใช้ URL จริงโดยตรง (Let's Encrypt cert ทำงานได้ปกติใน browser จริง)
const DIRECTUS_URL = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/directus`
  : import.meta.env.VITE_DIRECTUS_URL

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(DIRECTUS_TOKEN))
  .with(rest())

export default client

/**
 * แปลง file UUID จาก Directus → URL สำหรับแสดงรูป
 * - ถ้าเป็น UUID → `${DIRECTUS_URL}/assets/${id}`
 * - ถ้าเป็น object { id } (จาก relation) → ใช้ id นั้น
 * - ถ้าเป็น URL / local path อยู่แล้ว → คืนค่าเดิม
 */
export function assetUrl(value) {
  if (!value) return ''
  if (typeof value === 'object' && value.id) {
    return `${DIRECTUS_URL}/assets/${value.id}`
  }
  if (typeof value === 'string') {
    if (value.startsWith('http') || value.startsWith('assets/') || value.startsWith('/')) {
      return value
    }
    // ถือว่าเป็น UUID
    return `${DIRECTUS_URL}/assets/${value}`
  }
  return ''
}

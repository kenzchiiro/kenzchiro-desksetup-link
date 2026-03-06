import { useState, useEffect } from 'react'
import { readItems, readSingleton } from '@directus/sdk'
import client, { assetUrl } from '../lib/directus'

// ─── ชื่อ Collection ใน Directus ─────────────────────────────────────────────
const COLLECTIONS = {
  profile:    'profile',     // singleton
  contacts:   'contacts',
  highlights: 'highlights',
  items:      'products',    // ชื่อ collection ใน Directus คือ products
}

// ─── Helper: แปลง item.img / item.icon → URL ─────────────────────────────────
function mapItemImages(item) {
  if (!item) return item
  return {
    ...item,
    img: item.img ? assetUrl(item.img) : item.img,
    icon: item.icon ? assetUrl(item.icon) : item.icon,
    // group_items อาจเป็น JSON array หรือ relation array
    group_items: Array.isArray(item.group_items)
      ? item.group_items.map((gi) => ({
          ...gi,
          img: gi.img ? assetUrl(gi.img) : gi.img,
        }))
      : item.group_items,
  }
}

// ─── useProfile ───────────────────────────────────────────────────────────────
export function useProfile() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .request(
        readSingleton(COLLECTIONS.profile, {
          fields: ['*', 'socials.*'],
        })
      )
      .then((res) => {
        setData({
          ...res,
          avatar: assetUrl(res.avatar),
          cover: assetUrl(res.cover),
          // socials อาจเป็น JSON array หรือ relation — รองรับทั้งสอง
          socials: Array.isArray(res.socials)
            ? res.socials.map((s) => ({
                ...s,
                icon: s.icon ? assetUrl(s.icon) : s.icon,
              }))
            : [],
        })
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// ─── useContacts ──────────────────────────────────────────────────────────────
export function useContacts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .request(
        readItems(COLLECTIONS.contacts, {
          fields: ['*'],
          sort: ['sort', 'id'],
          filter: { status: { _eq: 'published' } },
        })
      )
      .then((res) => {
        setData(res.map(mapItemImages))
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// ─── useHighlights ────────────────────────────────────────────────────────────
export function useHighlights() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .request(
        readItems(COLLECTIONS.highlights, {
          fields: ['*', 'group_items.*'],
          sort: ['sort', 'id'],
          filter: { status: { _eq: 'published' } },
        })
      )
      .then((res) => {
        setData(res.map(mapItemImages))
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

// ─── useItems ─────────────────────────────────────────────────────────────────
export function useItems() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .request(
        readItems(COLLECTIONS.items, {
          fields: ['*', 'group_items.*'],
          sort: ['sort', 'id'],
          limit: -1,
          filter: { status: { _eq: 'published' } },
        })
      )
      .then((res) => {
        setData(res.map(mapItemImages))
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

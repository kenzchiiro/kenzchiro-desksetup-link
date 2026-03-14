import { useState, useEffect } from 'react'
import { readItems, readSingleton } from '@directus/sdk'
import client, { assetUrl } from '../lib/directus'
import profileJson from '../data/profile.json'
import contactsJson from '../data/contacts.json'
import highlightsJson from '../data/highlights.json'
import itemsJson from '../data/items.json'

const COLLECTIONS = {
  profile:    'profile',
  contacts:   'contacts',
  highlights: 'highlights',
  items:      'products',
}

function mapItemImages(item) {
  if (!item) return item
  return {
    ...item,
    img: item.img ? assetUrl(item.img) : item.img,
    icon: item.icon ? assetUrl(item.icon) : item.icon,
    group_items: Array.isArray(item.group_items)
      ? item.group_items.map((gi) => ({
          ...gi,
          img: gi.img ? assetUrl(gi.img) : gi.img,
        }))
      : item.group_items,
  }
}

export function useProfile() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      setData(profileJson)
      setLoading(false)
      return
    }
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

export function useContacts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      setData(contactsJson.contacts ?? [])
      setLoading(false)
      return
    }
    client
      .request(
        readItems(COLLECTIONS.contacts, {
          fields: ['*'],
          sort: ['sort', '-date_created'],
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

export function useHighlights() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      setData(highlightsJson.highlights ?? [])
      setLoading(false)
      return
    }
    client
      .request(
        readItems(COLLECTIONS.highlights, {
          fields: ['*', 'group_items.*'],
          sort: ['-date_created'],
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

export function useItems() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      setData(itemsJson.items ?? [])
      setLoading(false)
      return
    }
    client
      .request(
        readItems(COLLECTIONS.items, {
          fields: ['*', 'group_items.*'],
          sort: ['-date_created'],
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

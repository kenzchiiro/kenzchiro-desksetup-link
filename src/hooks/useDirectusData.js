import { useState, useEffect, useMemo } from 'react'
import { readItems, readSingleton } from '@directus/sdk'
import client, { assetUrl } from '../lib/directus'

const COLLECTIONS = {
  profile:       'profile',
  contacts:      'contacts',
  items:         'products',
  collaborations: 'collaboration',
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

export function useProducts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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

  const highlights = useMemo(
    () =>
      data
        .filter((i) => i.highlight)
        .sort((a, b) => new Date(b.date_updated) - new Date(a.date_updated)),
    [data]
  )

  return { data, highlights, loading, error }
}

export function useCollaborations() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    client
      .request(
        readItems(COLLECTIONS.collaborations, {
          fields: ['*'],
          sort: ['sort', '-date_created'],
          filter: { status: { _eq: 'published' } },
        })
      )
      .then((res) => {
        setData(
          res.map((item) => ({
            ...item,
            logo: item.logo ? assetUrl(item.logo) : null,
          }))
        )
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}

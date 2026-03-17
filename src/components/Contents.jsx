import React, { useMemo, useState, useCallback, memo } from 'react'
import './Contents.css'
import Modal from './Modal'

const ItemCard = memo(function ItemCard({ item, category, index, onOpen }) {
  return (
    <article
      className="card"
      onClick={() => onOpen(item)}
    >
      <div className="card-media">
        <img src={item.img} alt={item.title} loading="lazy" />
      </div>
    </article>
  )
})

export default function Contents({ items: ITEMS = [], loading }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalItem, setModalItem] = useState(null)
  const [copied, setCopied] = useState(false)

  const copyCode = useCallback(async (code) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        const ta = document.createElement('textarea')
        ta.value = code
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.warn('copy failed', e)
    }
  }, [])

  const handleOpen = useCallback((item) => {
    setModalItem(item)
    setModalOpen(true)
  }, [])

  const handleClose = useCallback(() => setModalOpen(false), [])

  const categories = useMemo(() => {
    const allCategories = []
    ITEMS.forEach((i) => {
      if (Array.isArray(i.category)) {
        allCategories.push(...i.category)
      } else if (i.category) {
        allCategories.push(i.category)
      }
    })
    const set = new Set(allCategories)
    const sortedCategories = Array.from(set).sort()
    return ['all', ...sortedCategories]
  }, [ITEMS])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ITEMS.filter((it) => {
      if (active !== 'all') {
        const itemCategories = Array.isArray(it.category)
          ? it.category
          : [it.category]
        if (!itemCategories.includes(active)) return false
      }
      if (!q) return true
      const categoryText = Array.isArray(it.category)
        ? it.category.join(' ')
        : it.category
      return (
        it.title.toLowerCase().includes(q) ||
        categoryText.toLowerCase().includes(q)
      )
    })
  }, [query, active, ITEMS])

  const groupedByCategory = useMemo(() => {
    const groups = {}
    filtered.forEach((item) => {
      const firstCategory = Array.isArray(item.category)
        ? item.category[0]
        : item.category
      if (!groups[firstCategory]) {
        groups[firstCategory] = []
      }
      groups[firstCategory].push(item)
    })
    return groups
  }, [filtered])

  const sortedEntries = useMemo(() => {
    return Object.entries(groupedByCategory).sort(([a], [b]) => a.localeCompare(b))
  }, [groupedByCategory])

  return (
    <section className="contents-root">
      <div className="contents-controls">
        <div className="search-wrapper">
          <svg
            className="icon-search"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="6" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
          />
        </div>

        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${active === c ? 'active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="category-sections">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="category-section">
              <div className="category-title skeleton" style={{ width: 120, height: 24, borderRadius: 6 }} />
              <div className="grid">
                {[...Array(4)].map((_, j) => (
                  <article key={j} className="card skeleton" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="category-sections">
          {sortedEntries.map(([category, items]) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="grid">
                {items.map((item, index) => (
                  <ItemCard
                    key={item.id ?? `${category}-${index}`}
                    item={item}
                    category={category}
                    index={index}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={handleClose}
        item={modalItem}
        copied={copied}
        onCopy={copyCode}
      />
    </section>
  )
}

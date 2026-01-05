import React, { useMemo, useState } from 'react'
import './Contents.css'
import itemsData from '../data/items.json'
import Modal from './Modal'

export default function Contents() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalItem, setModalItem] = useState(null)
  const [copied, setCopied] = useState(false)

  const ITEMS = itemsData.items

  const copyCode = async (code) => {
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
  }

  const categories = useMemo(() => {
    const allCategories = []
    ITEMS.forEach((i) => {
      if (Array.isArray(i.category)) {
        allCategories.push(...i.category)
      } else {
        allCategories.push(i.category)
      }
    })
    const set = new Set(allCategories)
    const sortedCategories = Array.from(set).sort()
    return ['all', ...sortedCategories]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ITEMS.filter((it) => {
      // Check category filter
      if (active !== 'all') {
        const itemCategories = Array.isArray(it.category) ? it.category : [it.category]
        if (!itemCategories.includes(active)) return false
      }
      // Check search query
      if (!q) return true
      const categoryText = Array.isArray(it.category) ? it.category.join(' ') : it.category
      return it.title.toLowerCase().includes(q) || categoryText.toLowerCase().includes(q)
    })
  }, [query, active])

  const groupedByCategory = useMemo(() => {
    const groups = {}
    filtered.forEach((item) => {
      const firstCategory = Array.isArray(item.category) ? item.category[0] : item.category
      if (!groups[firstCategory]) {
        groups[firstCategory] = []
      }
      groups[firstCategory].push(item)
    })
    return groups
  }, [filtered])

  return (
    <section className="contents-root">
      <div className="contents-controls">
        <div className="search-wrapper">
          <svg className="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6"/><path d="M21 21l-4.3-4.3"/></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
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

      <div className="category-sections">
        {Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            <div className="grid">
              {items.map((item, index) => (
                <article key={`${category}-${index}`} className="card" onClick={() => { setModalItem(item); setModalOpen(true) }}>
                  <div className="card-media">
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        item={modalItem} 
        copied={copied} 
        onCopy={copyCode}
      />
    </section>
  )
}

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
    const set = new Set(ITEMS.map((i) => i.category))
    return ['all', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ITEMS.filter((it) => {
      if (active !== 'all' && it.category !== active) return false
      if (!q) return true
      return it.title.toLowerCase().includes(q) || it.category.toLowerCase().includes(q)
    })
  }, [query, active])

  const groupedByCategory = useMemo(() => {
    const groups = {}
    filtered.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
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
                    <img src={item.img} alt={item.title} />
                  </div>
                  {/* <div className="card-body">
                    <h3>{item.title}</h3>
                    <p className="cat">{item.category}</p>
                  </div> */}
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && modalItem && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal modal-flat" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
            <h2 className="modal-title">{modalItem.title}</h2>

            {modalItem.description && <p className="modal-desc">{modalItem.description}</p>}
            <br/>

            {modalItem.code && (
              <div className="modal-code">
                <div className="code-label">Discount code</div>
                <div className="code-row">
                  <div className="code-box">{modalItem.code}</div>
                  <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={(e) => { e.stopPropagation(); copyCode(modalItem.code) }} aria-label="Copy code">{copied ? 'COPIED' : 'COPY'}</button>
                </div>
              </div>
            )}
                        <br/>

            <p className="modal-sub">Order the way that’s easiest for you.</p>

            <div className="channel-grid">
              <a className="channel" href={modalItem.links?.shopee || `https://shopee.co.th/search?keyword=${encodeURIComponent(modalItem.title)}`} target="_blank" rel="noreferrer" onClick={(e) => {
                const actualUrl = e.currentTarget.href;
                if (window.gtag) {
                  window.gtag('event', 'click_product_link', {
                    event_category: 'product_interaction',
                    event_label: modalItem.title,
                    item_name: modalItem.title,
                    item_brand: modalItem.brand || 'unknown',
                    item_category: modalItem.category || 'unknown',
                    platform: 'shopee',
                    link_url: actualUrl
                  });
                }
                setModalOpen(false);
              }}>
                <div className="ch-icon shopee">
                  <img src="assets/icon-shopee.svg" alt="Shopee" />
                </div>
                <div className="ch-label">Shopee</div>
              </a>

              <a className="channel" href={modalItem.links?.tiktok || `https://www.tiktok.com/search?q=${encodeURIComponent(modalItem.title)}`} target="_blank" rel="noreferrer" onClick={(e) => {
                const actualUrl = e.currentTarget.href;
                if (window.gtag) {
                  window.gtag('event', 'click_product_link', {
                    event_category: 'product_interaction',
                    event_label: modalItem.title,
                    item_name: modalItem.title,
                    item_brand: modalItem.brand || 'unknown',
                    item_category: modalItem.category || 'unknown',
                    platform: 'tiktok',
                    link_url: actualUrl
                  });
                }
                setModalOpen(false);
              }}>
                <div className="ch-icon tiktok">
                  <img src="assets/icon-tiktok.svg" alt="TikTok" />
                </div>
                <div className="ch-label">TikTok</div>
              </a>

              <a className="channel" href={modalItem.links?.lazada || `https://www.lazada.co.th/catalog/?q=${encodeURIComponent(modalItem.title)}`} target="_blank" rel="noreferrer" onClick={(e) => {
                const actualUrl = e.currentTarget.href;
                if (window.gtag) {
                  window.gtag('event', 'click_product_link', {
                    event_category: 'product_interaction',
                    event_label: modalItem.title,
                    item_name: modalItem.title,
                    item_brand: modalItem.brand || 'unknown',
                    item_category: modalItem.category || 'unknown',
                    platform: 'lazada',
                    link_url: actualUrl
                  });
                }
                setModalOpen(false);
              }}>
                <div className="ch-icon lazada">
                  <img src="assets/icon-lazada.svg" alt="Lazada" />
                </div>
                <div className="ch-label">Lazada</div>
              </a>

              {modalItem.links?.other && (
                <a className="channel" href={modalItem.links.other} target="_blank" rel="noreferrer" onClick={(e) => {
                  const actualUrl = e.currentTarget.href;
                  if (window.gtag) {
                    window.gtag('event', 'click_product_link', {
                      event_category: 'product_interaction',
                      event_label: modalItem.title,
                      item_name: modalItem.title,
                      item_brand: modalItem.brand || 'unknown',
                      item_category: modalItem.category || 'unknown',
                      platform: 'other',
                      link_url: actualUrl
                    });
                  }
                  setModalOpen(false);
                }}>
                  <div className="ch-icon other">
                  <img src="assets/icon-external-link.svg" alt="Other" />
                  </div>
                  <div className="ch-label">Other</div>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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

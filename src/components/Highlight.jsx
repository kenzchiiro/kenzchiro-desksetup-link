import React, { useState, useCallback, memo } from 'react'
import './Highlight.css'
import { useHighlights } from '../hooks/useDirectusData'
import Modal from './Modal'

const HighlightCard = memo(function HighlightCard({ item, index, onOpen }) {
  return (
    <div
      className="highlight-card"
      onClick={() => onOpen(item)}
    >
      <div className="highlight-image-wrapper">
        {item.tag && (
          <div className="highlight-tag">
            <svg
              className="highlight-pin-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
            </svg>
            {item.tag}
          </div>
        )}
        <img
          src={item.img}
          alt={item.title}
          className="highlight-image"
          loading="lazy"
        />
      </div>
      <div className="highlight-content">
        <h3 className="highlight-title">{item.title}</h3>
      </div>
    </div>
  )
})

export default function Highlight() {
  const { data: highlights, loading } = useHighlights()
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

  if (loading) {
    return (
      <section className="highlight-section">
        <h2 className="highlight-header">Highlight</h2>
        <div className="highlight-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="highlight-card skeleton" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="highlight-section">
      <h2 className="highlight-header">Highlight</h2>
      <div className="highlight-grid">
        {highlights.map((item, index) => (
          <HighlightCard
            key={item.id ?? index}
            item={item}
            index={index}
            onOpen={handleOpen}
          />
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

import React from 'react'
import './Highlight.css'
import highlightsData from '../data/highlights.json'

export default function Highlight() {
  const highlights = highlightsData.highlights

  return (
    <section className="highlight-section">
      <h2 className="highlight-header">
        {/* <span className="highlight-icon"></span> */}
        Highlight
      </h2>
      <div className="highlight-grid">
        {highlights.map((item, index) => (
          <div key={index} className="highlight-card">
            <div className="highlight-image-wrapper">
              {item.tag && <div className="highlight-tag">{item.tag}</div>}
              <img src={item.img} alt={item.title} className="highlight-image" />
              {item.description && <div className="highlight-desc">{item.description}</div>}
            </div>
            <div className="highlight-content">
              <h3 className="highlight-title">{item.title}</h3>
              {item.subtitle && <p className="highlight-subtitle">{item.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

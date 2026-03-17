import React from 'react'
import './BrandMarquee.css'

function BrandItem({ name, logo }) {
  return (
    <div className="brand-item">
      {logo
        ? <img src={logo} alt={name} className="brand-logo" />
        : <span className="brand-name">{name}</span>
      }
    </div>
  )
}

export default function BrandMarquee({ brands = [] }) {
  if (!brands.length) return null

  return (
    <div className="brand-marquee-wrapper">
      <span className="brand-label">Past<br/>Collaborations</span>
      <div className="brand-track-outer">
        <div className="brand-track">
          {brands.map((b) => <BrandItem key={b.name} name={b.name} logo={b.logo} />)}
          {brands.map((b) => <BrandItem key={b.name + '-dup'} name={b.name} logo={b.logo} />)}
        </div>
      </div>
    </div>
  )
}

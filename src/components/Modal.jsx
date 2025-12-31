import React from 'react'
import './Modal.css'

export default function Modal({ open, onClose, item, copied, onCopy }) {
  if (!open || !item) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-flat" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        
        <div className="modal-content">
          {item.img && (
            <div className="modal-image-wrapper">
              <img src={item.img} alt={item.title} className="modal-image" />
              {item.brand && (
                <div className="modal-brand-chip">{item.brand}</div>
              )}
            </div>
          )}
          
          <div className="modal-body">
            <h2 className="modal-title">{item.title}</h2>

            {(item.subtitle || item.description) && (
              <p className="modal-desc">{item.subtitle || item.description}</p>
            )}

            {item.code && (
              <div className="modal-code">
                <div className="code-label">Discount code</div>
                <div className="code-row">
                  <div className="code-box">{item.code}</div>
                  <button 
                    className={`copy-btn ${copied ? 'copied' : ''}`} 
                    onClick={(e) => { e.stopPropagation(); onCopy(item.code) }} 
                    aria-label="Copy code"
                  >
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            )}

            <p className="modal-sub">Order the way that's easiest for you.</p>

            <div className="channel-grid">
              {item.links?.shopee && (
                <a 
                  className="channel" 
                  href={item.links.shopee} 
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'click_product_link', {
                        event_category: 'product_interaction',
                        event_label: item.title,
                        item_name: item.title,
                        item_brand: item.brand || 'unknown',
                        item_category: item.category || 'unknown',
                        platform: 'shopee',
                        link_url: item.links.shopee
                      });
                    }
                    onClose();
                  }}
                >
                  <div className="ch-icon shopee">
                    <img src="assets/icon-shopee.svg" alt="Shopee" />
                  </div>
                  <div className="ch-label">Shopee</div>
                </a>
              )}

              {item.links?.tiktok && (
                <a 
                  className="channel" 
                  href={item.links.tiktok} 
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'click_product_link', {
                        event_category: 'product_interaction',
                        event_label: item.title,
                        item_name: item.title,
                        item_brand: item.brand || 'unknown',
                        item_category: item.category || 'unknown',
                        platform: 'tiktok',
                        link_url: item.links.tiktok
                      });
                    }
                    onClose();
                  }}
                >
                  <div className="ch-icon tiktok">
                    <img src="assets/icon-tiktok.svg" alt="TikTok" />
                  </div>
                  <div className="ch-label">TikTok</div>
                </a>
              )}

              {item.links?.lazada && (
                <a 
                  className="channel" 
                  href={item.links.lazada} 
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'click_product_link', {
                        event_category: 'product_interaction',
                        event_label: item.title,
                        item_name: item.title,
                        item_brand: item.brand || 'unknown',
                        item_category: item.category || 'unknown',
                        platform: 'lazada',
                        link_url: item.links.lazada
                      });
                    }
                    onClose();
                  }}
                >
                  <div className="ch-icon lazada">
                    <img src="assets/icon-lazada.svg" alt="Lazada" />
                  </div>
                  <div className="ch-label">Lazada</div>
                </a>
              )}

              {item.links?.other && (
                <a 
                  className="channel" 
                  href={item.links.other} 
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={() => {
                    if (window.gtag) {
                      window.gtag('event', 'click_product_link', {
                        event_category: 'product_interaction',
                        event_label: item.title,
                        item_name: item.title,
                        item_brand: item.brand || 'unknown',
                        item_category: item.category || 'unknown',
                        platform: 'other',
                        link_url: item.links.other
                      });
                    }
                    onClose();
                  }}
                >
                  <div className="ch-icon other">
                    <img src="assets/icon-external-link.svg" alt="Other" />
                  </div>
                  <div className="ch-label">Other</div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import './Modal.css'

export default function Modal({ open, onClose, item, copied, onCopy }) {
  const [selectedItem, setSelectedItem] = useState(null)
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  
  if (!open || !item) return null

  // Check if this is a group item
  const isGroupItem = item.group_items && Array.isArray(item.group_items) && item.group_items.length > 0
  const displayItem = selectedItem || item
  const showingGroupList = isGroupItem && !selectedItem

  const handleBack = () => {
    setSelectedItem(null)
  }

  const handleItemSelect = (groupItem) => {
    setSelectedItem(groupItem)
  }

  const handleClose = () => {
    setSelectedItem(null)
    onClose()
  }

  const trackProductClick = (itemTitle, category, platform, url) => {
    // Use Google Tag Manager (GTM handles both GTM and GA4)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'select_item',
        event_category: 'product_interaction',
        event_label: itemTitle,
        item_name: itemTitle,
        item_category: category,
        platform: platform,
        link_url: url
      })
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal modal-flat" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close">×</button>
        {selectedItem && (
          <button className="modal-back" onClick={handleBack} aria-label="Back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        )}
        
        {showingGroupList ? (
          <div className="modal-content modal-group">
            <div className="modal-group-left">
              {(item.img || (item.group_items && item.group_items[0]?.img)) && (
                <div className="modal-group-image-wrapper">
                  <img src={item.img || item.group_items[0]?.img} alt={item.title} className="modal-group-image" loading="lazy" />
                </div>
              )}
            </div>
            <div className="modal-group-right">
              <div className="modal-body">
                <h2 className="modal-title">{item.title}</h2>
                {item.description && (
                  <p className="modal-desc">{item.description}</p>
                )}
                
                <div className="group-items-list">
                {item.group_items.map((groupItem, idx) => (
                  <div 
                    key={idx} 
                    className="group-item-row"
                    onClick={() => handleItemSelect(groupItem)}
                  >
                    {groupItem.img && (
                      <div className="group-item-image">
                        <img src={groupItem.img} alt={groupItem.title} loading="lazy" />
                      </div>
                    )}
                    <div className="group-item-info">
                      <h3 className="group-item-title">{groupItem.title}</h3>
                      {groupItem.subtitle && (
                        <p className="group-item-subtitle">{groupItem.subtitle}</p>
                      )}
                    </div>
                    <div className="group-item-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        ) : (
          <div className="modal-content">
            {displayItem.img && (
              <div className="modal-image-wrapper">
                <img src={displayItem.img} alt={displayItem.title} className="modal-image" loading="lazy" />
                {(displayItem.brand || displayItem.category) && (
                  <div className="modal-category-overlay">
                    {displayItem.brand && <span className="modal-category-chip">{displayItem.brand}</span>}
                    {displayItem.category && (Array.isArray(displayItem.category) ? displayItem.category : [displayItem.category]).map((cat, idx) => (
                      <span key={idx} className="modal-category-chip">{cat}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="modal-body">
              <h2 className="modal-title">{displayItem.title}</h2>

              {(displayItem.subtitle || displayItem.description) && (
                <p className="modal-desc">{displayItem.subtitle || displayItem.description}</p>
              )}

              {displayItem.code && (
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

            <div className="channel-grid">
              <p className="modal-sub">Available on</p>
              <div className="channel-links">
                {displayItem.links?.shopee && (
                  <a 
                    className="channel" 
                    href={displayItem.links.shopee} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={() => {
                      const firstCategory = Array.isArray(displayItem.category) ? displayItem.category[0] : (displayItem.category || 'unknown');
                      trackProductClick(displayItem.title, firstCategory, 'shopee', displayItem.links.shopee);
                      handleClose();
                    }}
                  >
                  <div className="ch-icon shopee">
                    <img src="assets/icon-shopee.svg" alt="Shopee" />
                  </div>
                  <div className="ch-label">Shopee</div>
                </a>
              )}

                {displayItem.links?.tiktok && (
                  <a 
                    className="channel" 
                    href={displayItem.links.tiktok} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={() => {
                      const firstCategory = Array.isArray(displayItem.category) ? displayItem.category[0] : (displayItem.category || 'unknown');
                      trackProductClick(displayItem.title, firstCategory, 'tiktok', displayItem.links.tiktok);
                      handleClose();
                    }}
                  >
                  <div className="ch-icon tiktok">
                    <img src="assets/icon-tiktok.svg" alt="TikTok" />
                  </div>
                  <div className="ch-label">TikTok</div>
                </a>
              )}

                {displayItem.links?.lazada && (
                  <a 
                    className="channel" 
                    href={displayItem.links.lazada} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={() => {
                      const firstCategory = Array.isArray(displayItem.category) ? displayItem.category[0] : (displayItem.category || 'unknown');
                      trackProductClick(displayItem.title, firstCategory, 'lazada', displayItem.links.lazada);
                      handleClose();
                    }}
                  >
                  <div className="ch-icon lazada">
                    <img src="assets/icon-lazada.svg" alt="Lazada" />
                  </div>
                  <div className="ch-label">Lazada</div>
                </a>
              )}

                {displayItem.links?.other && (
                  <a 
                    className="channel" 
                    href={displayItem.links.other} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={() => {
                      const firstCategory = Array.isArray(displayItem.category) ? displayItem.category[0] : (displayItem.category || 'unknown');
                      trackProductClick(displayItem.title, firstCategory, 'other', displayItem.links.other);
                      handleClose();
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
        )}
      </div>
    </div>
  )
}

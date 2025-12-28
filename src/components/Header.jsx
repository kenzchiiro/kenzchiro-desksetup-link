import React from 'react'
import './Header.css'
import avatar from '../assets/avatar.jpg'
import cover from '../assets/cover.jpg'
import emailIcon from '../assets/icon-email.png'
import facebookIcon from '../assets/icon-facebook.png'
import tiktokIcon from '../assets/icon-tiktok.png'
import instagramIcon from '../assets/icon-instagram.png'

export default function Header() {
  return (
    <header className="profile-header">
      <div className="cover" aria-hidden="true" style={{backgroundImage:`url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>

      <div className="header-content">
        <div className="avatar-column">
          <div className="avatar-wrap">
            <img
              className="avatar"
              alt="avatar"
              src={avatar}
            />
          </div>
        </div>

        <div className="main-column">
          <div className="profile-info">
            <h1 className="display-name">kenzchiro 🪴</h1>
            <p className="email">🖥️ Desk setup • 🎧 Gadgets • 🎮 Gaming</p>
            <div className="socials" aria-label="social links">
              <a className="social" href="#" aria-label="YouTube">
                <img src={emailIcon} alt="email" className="social-icon" />
              </a>
              <a className="social" href="#" aria-label="Pinterest">
                <img src={facebookIcon} alt="facebook" className="social-icon" />
              </a>
              <a className="social" href="#" aria-label="TikTok">
                <img src={tiktokIcon} alt="tiktok" className="social-icon" />
              </a>
              <a className="social" href="#" aria-label="Instagram">
                <img src={instagramIcon} alt="instagram" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

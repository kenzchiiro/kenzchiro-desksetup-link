import React from 'react'
import './Header.css'
import contactsData from '../data/contacts.json'
import profileData from '../data/profile.json'

export default function Header() {
  const contacts = contactsData.contacts
  const profile = profileData

  return (
    <header className="profile-header">
      <div className="cover" aria-hidden="true" style={{backgroundImage:`url(${profile.cover})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>

      <div className="header-content">
        <div className="avatar-column">
          <div className="avatar-wrap">
            <img
              className="avatar"
              alt="avatar"
              src={profile.avatar}
            />
          </div>
        </div>

        <div className="main-column">
          <div className="profile-info">
            <h1 className="display-name">{profile.displayName}</h1>
            <p className="email">{profile.bio}</p>
            <div className="socials" aria-label="social links">
              {profile.socials.map((social) => (
                <a key={social.id} className="social" href={social.url} aria-label={social.ariaLabel} target="_blank" rel="noopener noreferrer">
                  <img src={social.icon} alt={social.name} className="social-icon" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="contact-cards">
        {contacts.map((contact) => (
          <a key={contact.id} className="contact-card" href={contact.url} role="button" target="_blank" rel="noopener noreferrer">
            <div className="contact-icon">
              <img src={contact.icon} alt={contact.title} />
            </div>
            <div className="contact-body">
              <div className="contact-title">{contact.title}</div>
              <div className="contact-sub">{contact.subtitle}</div>
            </div>
          </a>
        ))}
      </div>
    </header>
  )
}

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { theme } from '../styles/theme'
import sydLogo from '../assets/syd-hero.png'
import { Heart, Send } from 'lucide-react'

export const Footer: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  const sections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Shop', to: '/shop' },
        { label: 'About Us', to: '#' },
        { label: 'Blog', to: '#' },
        { label: 'FAQ', to: '#' },
      ],
    },
    {
      title: 'Customer Service',
      links: [
        { label: 'Contact Us', to: '#' },
        { label: 'Returns & Exchanges', to: '#' },
        { label: 'Shipping Info', to: '#' },
        { label: 'Track Order', to: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
        { label: 'Cookie Policy', to: '#' },
      ],
    },
  ]

 const socials = [
		{ icon: "📸", href: "#", label: "Instagram" },
		{ icon: "𝕏", href: "#", label: "Twitter" },
		{ icon: "👤", href: "#", label: "Facebook" },
 ];

  return (
    <>
      <footer style={{
        background: isDark
          ? `linear-gradient(135deg, ${t.backgroundSecondary} 0%, ${t.background} 100%)`
          : `linear-gradient(135deg, #fff0f7 0%, #ffe4f2 50%, #ffd6ec 100%)`,
        borderTop: `1px solid ${t.border}`,
        marginTop: '80px',
      }}>
        {/* Newsletter Banner */}
        <div style={{
          background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
          padding: '40px 24px',
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            <h3 style={{
              color: '#fff', fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 800, marginBottom: '8px',
            }}>
              Join the Syd & Co Family ✨
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>
              Get exclusive deals, new arrivals & style tips straight to your inbox
            </p>
            {subscribed ? (
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px', padding: '14px 24px',
                color: '#fff', fontWeight: 600, fontSize: '15px',
              }}>
                🎉 Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{
                display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto',
                flexWrap: 'wrap', justifyContent: 'center',
              }}>
                <input
                  type="email" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={{
                    flex: 1, minWidth: '200px', padding: '12px 18px',
                    borderRadius: '10px', border: 'none',
                    fontSize: '14px', outline: 'none',
                    background: 'rgba(255,255,255,0.95)',
                    color: '#333',
                  }}
                />
                <button type="submit" style={{
                  padding: '12px 20px', borderRadius: '10px',
                  border: '2px solid rgba(255,255,255,0.5)',
                  background: 'transparent', color: '#fff',
                  cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s',
                }}>
                  <Send size={16} /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 24px 40px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}>
            {/* Brand */}
            <div style={{ maxWidth: '280px' }}>
              <img
                src={sydLogo}
                alt="Syd & Co"
                style={{ height: '82px', width: 'auto', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px' }}
              />
              <p style={{
                color: t.textSecondary, fontSize: '14px',
                lineHeight: 1.7, marginBottom: '20px',
              }}>
                Your favorite destination for quality beauty & fashion products.
                Curated with love for every queen. 👑
              </p>
              {/* Socials */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {socials.map(({ icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} style={{
                    width: '38px', height: '38px',
                    borderRadius: '10px',
                    border: `1px solid ${t.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.primaryDark,
                    background: isDark ? 'rgba(230,91,168,0.1)' : 'rgba(255,182,217,0.15)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = t.primaryDark
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark ? 'rgba(230,91,168,0.1)' : 'rgba(255,182,217,0.15)'
                      e.currentTarget.style.color = t.primaryDark
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                <span style={{ fontSize: '16px' }}>{icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Link Sections */}
            {sections.map((section) => (
              <div key={section.title}>
                <h4 style={{
                  color: t.text, fontWeight: 700,
                  fontSize: '15px', marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: `2px solid ${t.primaryDark}`,
                  display: 'inline-block',
                }}>
                  {section.title}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {section.links.map(({ label, to }) => (
                    <li key={label}>
                      <Link to={to} style={{
                        color: t.textSecondary, textDecoration: 'none',
                        fontSize: '14px', transition: 'all 0.2s',
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = t.primaryDark
                          e.currentTarget.style.paddingLeft = '4px'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = t.textSecondary
                          e.currentTarget.style.paddingLeft = '0'
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: `1px solid ${t.border}`,
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <p style={{ color: t.textSecondary, fontSize: '13px' }}>
              © {currentYear} Syd & Co. All rights reserved.
            </p>
            <p style={{
              color: t.textSecondary, fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              Made with <Heart size={13} fill={t.primaryDark} color={t.primaryDark} /> by TushClouds
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

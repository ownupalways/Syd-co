import React, { useState, useEffect } from 'react'
import { Link, useNavigate, } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react'
import { useTheme } from '../context/useTheme'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { theme } from '../styles/theme'
import sydLogo from '../assets/syd-logo.png'

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const { isAuthenticated, user, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount())
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

	

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
  ]

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <>
      <nav style={{
        background: scrolled
          ? isDark ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)'
          : isDark ? t.background : t.gradientPrimary,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: `1px solid ${t.border}`,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? `0 4px 20px ${t.shadow}` : 'none',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <img
              src={sydLogo}
              alt="Syd & Co"
              style={{ height: '42px', objectFit: 'contain', borderRadius: '8px' }}
            />
          </Link>

          {/* Desktop Nav */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
            className="desktop-nav"
          >
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '15px',
                color: isActive(to) ? t.primaryDark : t.text,
                background: isActive(to)
                  ? isDark ? 'rgba(230,91,168,0.15)' : 'rgba(230,91,168,0.1)'
                  : 'transparent',
                transition: 'all 0.2s',
                borderBottom: isActive(to) ? `2px solid ${t.primaryDark}` : '2px solid transparent',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}>
            {/* Search — desktop only */}
            <Link to="/shop" style={{
              textDecoration: 'none',
              padding: '8px',
              borderRadius: '10px',
              border: `1px solid ${t.border}`,
              background: 'transparent',
              color: t.textSecondary,
              display: 'flex',
              alignItems: 'center',
            }}
              className="desktop-only"
            >
              <Search size={18} />
            </Link>

            {/* Cart */}
            <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
              <div style={{
                padding: '8px',
                borderRadius: '10px',
                border: `1px solid ${t.border}`,
                background: isDark ? 'rgba(230,91,168,0.1)' : 'rgba(255,182,217,0.15)',
                color: isDark ? t.primaryLight : t.primaryDark,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px', right: '-6px',
                    background: t.primaryDark,
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px', height: '20px',
                    fontSize: '11px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 8px ${t.shadow}`,
                  }}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                className="desktop-only"
              >
                <span style={{
                  color: t.text, fontSize: '14px', fontWeight: 600,
                  padding: '6px 12px',
                  background: isDark ? 'rgba(230,91,168,0.1)' : 'rgba(255,182,217,0.15)',
                  borderRadius: '8px',
                }}>
                  {user?.name.split(' ')[0]}
                </span>
                <button onClick={handleLogout} style={{
                  padding: '8px', borderRadius: '10px',
                  border: `1px solid ${t.border}`,
                  background: 'transparent', color: t.text,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none' }}
                className="desktop-only"
              >
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '10px',
                  border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  boxShadow: `0 4px 15px ${t.shadow}`,
                }}>
                  <User size={15} /> Sign In
                </button>
              </Link>
            )}

            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '10px',
              border: `1px solid ${t.border}`,
              background: isDark
                ? 'rgba(230,91,168,0.1)'
                : 'rgba(230,91,168,0.1)',
              cursor: 'pointer', fontSize: '18px',
              transition: 'all 0.2s',
            }}>
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                padding: '8px', borderRadius: '10px',
                border: `1px solid ${t.border}`,
                background: 'transparent', color: t.text,
                cursor: 'pointer', alignItems: 'center',
              }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            borderTop: `1px solid ${t.border}`,
            padding: '16px 20px',
            background: isDark ? t.background : '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {navLinks.map(({ to, label }) => (
  <Link key={to} to={to}
    onClick={() => setMenuOpen(false)}
    style={{
      textDecoration: 'none',
      padding: '12px 16px',
      borderRadius: '10px',
      fontWeight: 600, fontSize: '15px',
      color: isActive(to) ? t.primaryDark : t.text,
      background: isActive(to)
        ? isDark ? 'rgba(230,91,168,0.15)' : 'rgba(230,91,168,0.08)'
        : 'transparent',
    }}>
    {label}
  </Link>
))}
            <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />
            {isAuthenticated ? (
              <button onClick={handleLogout} style={{
                padding: '12px 16px', borderRadius: '10px',
                border: `1px solid ${t.border}`, background: 'transparent',
                color: t.text, cursor: 'pointer',
                fontWeight: 600, fontSize: '15px', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <LogOut size={16} /> Sign Out ({user?.name.split(' ')[0]})
              </button>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
                  color: '#fff', fontWeight: 700, fontSize: '15px',
                }}>
                  Sign In
                </button>
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}

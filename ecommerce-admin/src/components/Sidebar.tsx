import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, ClipboardList, FileText,
  UserCheck, ChevronLeft, ChevronRight, Bell, X,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import sydLogo from '../assets/syd-logo.png'

const superAdminLinks = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  { to: '/users', icon: <Users size={18} />, label: 'Users' },
  { to: '/approvals', icon: <ClipboardList size={18} />, label: 'Approvals' },
  { to: '/sub-admins', icon: <UserCheck size={18} />, label: 'Sub-Admins' },
  { to: '/audit', icon: <FileText size={18} />, label: 'Audit Logs' },
]

const subAdminLinks = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  { to: '/users', icon: <Users size={18} />, label: 'Users' },
  { to: '/my-actions', icon: <ClipboardList size={18} />, label: 'My Actions' },
]

interface SidebarProps {
  onNotifClick: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

const SidebarContent: React.FC<{
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  onNotifClick: () => void
  onLinkClick?: () => void
}> = ({ collapsed, setCollapsed, onNotifClick, onLinkClick }) => {
  const { admin, logout } = useAuthStore()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const navigate = useNavigate()
  const isSuperAdmin = admin?.role === 'super-admin'
  const links = isSuperAdmin ? superAdminLinks : subAdminLinks

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{
      height: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '68px',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={sydLogo} alt="Syd & Co" style={{
              width: '34px', height: '34px',
              borderRadius: '8px', objectFit: 'cover', flexShrink: 0,
            }} />
            <div>
              <p style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text)', lineHeight: 1.2 }}>
                Sydney Admin
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {isSuperAdmin ? 'Super Admin' : 'Sub Admin'}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <img src={sydLogo} alt="Syd & Co" style={{
            width: '32px', height: '32px',
            borderRadius: '8px', objectFit: 'cover',
          }} />
        )}
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1, padding: '10px 8px',
        display: 'flex', flexDirection: 'column', gap: '2px',
        overflowY: 'auto',
      }}>
        {links.map((link) => (
          <NavLink
            key={link.to} to={link.to} end={link.to === '/'}
            onClick={onLinkClick}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: collapsed ? '10px 0' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: '10px', textDecoration: 'none',
              fontWeight: 600, fontSize: '13px',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(255,45,120,0.3), rgba(191,0,255,0.3))'
                : 'transparent',
              borderLeft: isActive ? '2px solid var(--pink)' : '2px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            <span style={{ flexShrink: 0 }}>{link.icon}</span>
            {!collapsed && (
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {link.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {/* Notifications */}
        <button onClick={onNotifClick} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: collapsed ? '10px 0' : '10px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: '10px', border: 'none', background: 'transparent',
          color: 'var(--text-secondary)', cursor: 'pointer',
          position: 'relative', marginBottom: '4px',
        }}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: '6px',
              left: collapsed ? '26px' : '22px',
              background: 'var(--pink)', color: '#fff',
              borderRadius: '50%', width: '16px', height: '16px',
              fontSize: '10px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {!collapsed && <span style={{ fontSize: '13px', fontWeight: 600 }}>Notifications</span>}
        </button>

        {/* Admin info */}
        {!collapsed && (
          <div style={{
            padding: '10px 12px', borderRadius: '10px',
            background: 'var(--glass)', border: '1px solid var(--glass-border)',
            marginBottom: '8px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>{admin?.name}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {admin?.email}
            </p>
            <span style={{
              display: 'inline-block', marginTop: '6px',
              padding: '2px 8px', borderRadius: '20px',
              fontSize: '10px', fontWeight: 700,
              background: isSuperAdmin ? 'var(--gradient)' : 'rgba(155,48,255,0.2)',
              color: isSuperAdmin ? '#fff' : 'var(--purple-mid)',
            }}>
              {admin?.role}
            </span>
          </div>
        )}

        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: collapsed ? '10px 0' : '10px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: '10px', border: 'none', background: 'transparent',
          color: 'var(--error)', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
        }}>
          <LogOut size={18} />
          {!collapsed && 'Logout'}
        </button>

        {/* Collapse toggle — desktop only */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '8px', marginTop: '4px',
          borderRadius: '10px', border: '1px solid var(--border)',
          background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
        }}
          className="desktop-collapse-btn"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ onNotifClick, mobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          position: 'fixed', left: 0, top: 0, bottom: 0,
          zIndex: 50, flexShrink: 0,
        }}
        className="desktop-sidebar"
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onNotifClick={onNotifClick}
        />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 998,
              }}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0,
                width: '260px', zIndex: 999,
              }}
            >
              {/* Close button on mobile */}
              <button
                onClick={onMobileClose}
                style={{
                  position: 'absolute', top: '16px', right: '-44px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text)', zIndex: 1000,
                }}
              >
                <X size={16} />
              </button>
              <SidebarContent
                collapsed={false}
                setCollapsed={() => {}}
                onNotifClick={() => { onNotifClick(); onMobileClose() }}
                onLinkClick={onMobileClose}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .desktop-collapse-btn { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
        }
      `}</style>
    </>
  )
}

export default Sidebar

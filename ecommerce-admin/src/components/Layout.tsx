import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Bell } from 'lucide-react'
import Sidebar from './Sidebar'
import NotificationPanel from './NotificationPanel'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useSocket } from '../hooks/useSocket'
import sydLogo from '../assets/syd-logo.png'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, admin } = useAuthStore()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  useSocket()

  if (!isAuthenticated || !admin) return <Navigate to="/login" replace />

  if (admin.status !== 'active') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', padding: '24px',
      }}>
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ color: 'var(--warning)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
            Account Pending
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Your account is awaiting super-admin approval.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar
        onNotifClick={() => setNotifOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: '240px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
        className="main-content"
      >
        {/* Mobile Header */}
        <div
          className="mobile-header"
          style={{
            display: 'none',
            position: 'sticky', top: 0, zIndex: 100,
            background: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border)',
            padding: '12px 16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                background: 'none', border: 'none',
                color: 'var(--text)', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                padding: '6px',
              }}
            >
              <Menu size={22} />
            </button>
            <img src={sydLogo} alt="Syd & Co" style={{ height: '28px', objectFit: 'contain' }} />
          </div>
          <button
            onClick={() => setNotifOpen(true)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              position: 'relative', padding: '6px',
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '2px', right: '2px',
                background: 'var(--pink)', color: '#fff',
                borderRadius: '50%', width: '14px', height: '14px',
                fontSize: '9px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ flex: 1, padding: 'clamp(16px, 3vw, 32px)' }}
        >
          {children}
        </motion.main>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; }
          .mobile-header { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

export default Layout

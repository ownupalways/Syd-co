import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import NotificationPanel from './NotificationPanel'
import { useAuthStore } from '../store/authStore'
import { useSocket } from '../hooks/useSocket'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, admin } = useAuthStore()
  const [notifOpen, setNotifOpen] = useState(false)
  useSocket()

  if (!isAuthenticated || !admin) return <Navigate to="/login" replace />
  if (admin.status !== 'active') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar onNotifClick={() => setNotifOpen(true)} />
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          marginLeft: '240px',
          flex: 1,
          padding: '32px',
          background: 'var(--bg)',
          minHeight: '100vh',
        }}
      >
        {children}
      </motion.main>
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  )
}

export default Layout

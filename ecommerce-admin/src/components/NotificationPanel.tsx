import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, UserCheck, CheckCircle, Clock } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'

const NotificationPanel: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { notifications, markAllRead, markRead } = useNotificationStore()

  const icons = {
    'new-registration': <UserCheck size={16} color="var(--info)" />,
    'action-reviewed': <CheckCircle size={16} color="var(--success)" />,
    'pending-action': <Clock size={16} color="var(--warning)" />,
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 99,
            }}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0,
              width: '360px',
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border)',
              zIndex: 100,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={20} color="var(--pink)" />
                <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text)' }}>
                  Notifications
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={markAllRead} style={{
                  fontSize: '12px', color: 'var(--pink)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}>
                  Mark all read
                </button>
                <button onClick={onClose} style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--text-secondary)',
                }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {notifications.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  color: 'var(--text-secondary)',
                }}>
                  <Bell size={40} style={{ opacity: 0.2, marginBottom: '12px' }} />
                  <p style={{ fontSize: '14px' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => markRead(n.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      marginBottom: '8px',
                      background: n.read ? 'transparent' : 'var(--glass)',
                      border: `1px solid ${n.read ? 'var(--border)' : 'var(--glass-border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ marginTop: '2px', flexShrink: 0 }}>{icons[n.type]}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                          {n.title}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {n.message}
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {!n.read && (
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: 'var(--pink)', flexShrink: 0, marginTop: '4px',
                        }} />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel

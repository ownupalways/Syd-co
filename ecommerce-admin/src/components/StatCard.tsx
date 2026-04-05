import React from 'react'
import { motion } from 'framer-motion'

interface Props {
  icon: React.ReactNode
  label: string
  value: string | number
  change?: string
  gradient: string
  delay?: number
}

const StatCard: React.FC<Props> = ({ icon, label, value, change, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
    }}
  >
    {/* Glow background */}
    <div style={{
      position: 'absolute', top: '-20px', right: '-20px',
      width: '100px', height: '100px',
      borderRadius: '50%',
      background: gradient,
      opacity: 0.15,
      filter: 'blur(30px)',
    }} />

    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '16px', color: '#fff',
    }}>
      {icon}
    </div>

    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
      {label}
    </p>
    <p style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
      {value}
    </p>
    {change && (
      <p style={{ fontSize: '12px', color: 'var(--success)', marginTop: '8px' }}>
        {change}
      </p>
    )}
  </motion.div>
)

export default StatCard

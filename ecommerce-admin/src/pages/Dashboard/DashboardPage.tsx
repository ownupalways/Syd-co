import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Package, Users, ShoppingBag, Clock, TrendingUp } from 'lucide-react'
import { getProductsApi } from '../../api/products'
import { getPendingActionsApi } from '../../api/pending'
import { useAuthStore } from '../../store/authStore'
import StatCard from '../../components/StatCard'

const DashboardPage: React.FC = () => {
  const { admin } = useAuthStore()
  const isSuperAdmin = admin?.role === 'super-admin'

  const { data: productsData } = useQuery({
    queryKey: ['dash-products'],
    queryFn: () => getProductsApi({ limit: 1 }),
  })

  const { data: pendingData } = useQuery({
    queryKey: ['dash-pending'],
    queryFn: () => getPendingActionsApi({ status: 'pending', limit: 1 }),
    enabled: isSuperAdmin,
  })

 const totalProducts =
		productsData?.data?.pagination?.total ?? 0;

  const pendingCount = pendingData?.data?.data?.pagination?.total ?? 0

  const stats = [
    {
      icon: <Package size={22} />,
      label: 'Total Products',
      value: totalProducts,
      gradient: 'linear-gradient(135deg, #FF2D78, #FF6EC7)',
      delay: 0,
    },
    {
      icon: <ShoppingBag size={22} />,
      label: 'Total Orders',
      value: 0,
      gradient: 'linear-gradient(135deg, #BF00FF, #9B30FF)',
      delay: 0.1,
    },
    {
      icon: <Users size={22} />,
      label: 'Total Users',
      value: 0,
      gradient: 'linear-gradient(135deg, #00CFFF, #007AFF)',
      delay: 0.2,
    },
    ...(isSuperAdmin ? [{
      icon: <Clock size={22} />,
      label: 'Pending Approvals',
      value: pendingCount,
      gradient: 'linear-gradient(135deg, #FFB800, #FF6B00)',
      delay: 0.3,
      change: pendingCount > 0 ? `${pendingCount} need review` : undefined,
    }] : []),
  ]

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="gradient-text">{admin?.name.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Role badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
        style={{ padding: '24px', marginBottom: '24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '8px 16px', borderRadius: '30px',
            background: isSuperAdmin ? 'var(--gradient)' : 'rgba(155,48,255,0.2)',
            color: isSuperAdmin ? '#fff' : 'var(--purple-mid)',
            fontSize: '13px', fontWeight: 700,
          }}>
            {admin?.role}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {isSuperAdmin
              ? 'You have full access to all features and can approve sub-admin actions.'
              : 'Your actions are reviewed by a super-admin before taking effect.'}
          </p>
        </div>
      </motion.div>

      {/* Revenue placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
        style={{ padding: '32px', textAlign: 'center' }}
      >
        <TrendingUp size={40} color="var(--pink)" style={{ opacity: 0.4, marginBottom: '12px' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Revenue analytics coming after orders are implemented
        </p>
      </motion.div>
    </div>
  )
}

export default DashboardPage

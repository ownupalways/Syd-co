import React from 'react'
import { ShoppingBag } from 'lucide-react'

const OrdersPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginBottom: '24px' }}>Orders</h1>
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '60px', textAlign: 'center',
        color: 'var(--text-secondary)',
      }}>
        <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
        <p style={{ fontSize: '16px' }}>Orders management coming soon</p>
        <p style={{ fontSize: '13px', marginTop: '8px' }}>Will be available after checkout is implemented</p>
      </div>
    </div>
  )
}

export default OrdersPage

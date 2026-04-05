import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UserCheck, UserX, Clock, CheckCircle, XCircle, Shield } from 'lucide-react'
import { getSubAdminsApi, reviewSubAdminApi } from '../../api/auth'
import type { AdminUser } from '../../types'
import toast from 'react-hot-toast'

const statusColors: Record<string, string> = {
  active: 'var(--success)',
  pending: 'var(--warning)',
  rejected: 'var(--error)',
  suspended: 'var(--text-secondary)',
}

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle size={14} />,
  pending: <Clock size={14} />,
  rejected: <XCircle size={14} />,
  suspended: <UserX size={14} />,
}

const SubAdminsPage: React.FC = () => {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<string>('all')
  const [reviewTarget, setReviewTarget] = useState<AdminUser | null>(null)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'suspend'>('approve')
  const [reason, setReason] = useState('')
  const [permissions, setPermissions] = useState<string[]>([
    'products:read', 'orders:read', 'users:read', 'reports:read',
  ])

  const { data, isLoading } = useQuery({
    queryKey: ['sub-admins', filter],
    queryFn: () => getSubAdminsApi(filter === 'all' ? undefined : filter),
  })

  const admins = data?.data?.data ?? []

  const reviewMutation = useMutation({
    mutationFn: ({ id, ...rest }: { id: string; action: 'approve' | 'reject' | 'suspend'; reason?: string; permissions?: string[] }) =>
      reviewSubAdminApi(id, rest),
    onSuccess: (_, vars) => {
      toast.success(`Sub-admin ${vars.action}d`)
      qc.invalidateQueries({ queryKey: ['sub-admins'] })
      setReviewTarget(null)
      setReason('')
    },
    onError: () => toast.error('Action failed'),
  })

  const allPermissions = [
    'products:read', 'products:write', 'products:delete',
    'orders:read', 'orders:write',
    'users:read', 'users:write',
    'reports:read', 'coupons:write',
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>
          Sub-Admins
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Manage access and permissions for all sub-admins
        </p>
      </motion.div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'pending', 'active', 'rejected', 'suspended'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
            border: '1px solid var(--border)', cursor: 'pointer',
            background: filter === f ? 'var(--gradient)' : 'transparent',
            color: filter === f ? '#fff' : 'var(--text-secondary)',
            textTransform: 'capitalize',
          }}>
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading...</div>
      ) : admins.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <UserCheck size={48} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--pink)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No sub-admins found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {admins.map((admin, i) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '16px', padding: '20px',
              }}
            >
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'var(--gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 800, color: '#fff',
                }}>
                  {admin.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{admin.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{admin.email}</p>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                  background: `${statusColors[admin.status]}20`,
                  color: statusColors[admin.status],
                }}>
                  {statusIcons[admin.status]}
                  {admin.status}
                </div>
              </div>

              {/* Permissions */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  PERMISSIONS
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {admin.permissions.slice(0, 4).map((p) => (
                    <span key={p} style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
                      background: 'rgba(255,45,120,0.1)', color: 'var(--pink-light)',
                    }}>
                      {p}
                    </span>
                  ))}
                  {admin.permissions.length > 4 && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      +{admin.permissions.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Last login */}
              {admin.lastLogin && (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Last login: {new Date(admin.lastLogin).toLocaleString()}
                </p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {admin.status === 'pending' && (
                  <>
                    <button onClick={() => { setReviewTarget(admin); setReviewAction('approve') }} style={{
                      flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                      border: 'none', background: 'rgba(0,229,160,0.15)',
                      color: 'var(--success)', cursor: 'pointer',
                    }}>
                      Approve
                    </button>
                    <button onClick={() => { setReviewTarget(admin); setReviewAction('reject') }} style={{
                      flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                      border: 'none', background: 'rgba(255,69,96,0.15)',
                      color: 'var(--error)', cursor: 'pointer',
                    }}>
                      Reject
                    </button>
                  </>
                )}
                {admin.status === 'active' && (
                  <button onClick={() => { setReviewTarget(admin); setReviewAction('suspend') }} style={{
                    flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--warning)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <Shield size={13} /> Suspend
                  </button>
                )}
                {(admin.status === 'rejected' || admin.status === 'suspended') && (
                  <button onClick={() => { setReviewTarget(admin); setReviewAction('approve') }} style={{
                    flex: 1, padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    border: 'none', background: 'rgba(0,229,160,0.15)',
                    color: 'var(--success)', cursor: 'pointer',
                  }}>
                    Reinstate
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setReviewTarget(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '24px',
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px', padding: '32px',
              width: '100%', maxWidth: '480px',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px', textTransform: 'capitalize' }}>
              {reviewAction} {reviewTarget.name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              {reviewTarget.email}
            </p>

            {reviewAction === 'approve' && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>
                  SET PERMISSIONS
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allPermissions.map((p) => (
                    <button key={p} onClick={() => {
                      setPermissions((prev) =>
                        prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                      )
                    }} style={{
                      padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                      border: '1px solid var(--border)', cursor: 'pointer',
                      background: permissions.includes(p) ? 'rgba(255,45,120,0.2)' : 'transparent',
                      color: permissions.includes(p) ? 'var(--pink-light)' : 'var(--text-secondary)',
                    }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {reviewAction !== 'approve' && (
              <textarea
                placeholder="Reason (optional)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '12px',
                  borderRadius: '10px', border: '1px solid var(--border)',
                  background: 'var(--bg-hover)', color: 'var(--text)',
                  fontSize: '13px', outline: 'none', resize: 'vertical',
                  marginBottom: '20px',
                }}
              />
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setReviewTarget(null)} style={{
                flex: 1, padding: '12px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text)', cursor: 'pointer', fontWeight: 600,
              }}>
                Cancel
              </button>
              <button
                onClick={() => reviewMutation.mutate({
                  id: reviewTarget.id,
                  action: reviewAction,
                  reason,
                  permissions: reviewAction === 'approve' ? permissions : undefined,
                })}
                className="gradient-btn"
                style={{ flex: 1, padding: '12px', borderRadius: '10px', textTransform: 'capitalize' }}
              >
                {reviewAction}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default SubAdminsPage

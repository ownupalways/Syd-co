import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import { getPendingActionsApi, reviewPendingActionApi } from '../../api/pending'
import type { PendingAction } from '../../types'
import toast from 'react-hot-toast'

const ApprovalsPage: React.FC = () => {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<PendingAction | null>(null)
  const [note, setNote] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['pending-actions'],
    queryFn: () => getPendingActionsApi({ status: 'pending' }),
  })

  const actions = data?.data?.data?.data ?? []

  const reviewMutation = useMutation({
    mutationFn: ({ id, action, note }: { id: string; action: 'approve' | 'reject'; note?: string }) =>
      reviewPendingActionApi(id, { action, note }),
    onSuccess: (_, vars) => {
      toast.success(`Action ${vars.action}d successfully`)
      qc.invalidateQueries({ queryKey: ['pending-actions'] })
      setSelected(null)
      setNote('')
    },
    onError: () => toast.error('Review failed'),
  })

  const resourceColors: Record<string, string> = {
    Product: 'var(--pink)',
    Order: 'var(--purple-mid)',
    User: 'var(--info)',
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>
          Approval Queue
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Review and approve sub-admin actions before they take effect
        </p>
      </motion.div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Loading...
        </div>
      ) : actions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-card"
          style={{ padding: '60px', textAlign: 'center' }}
        >
          <CheckCircle size={48} color="var(--success)" style={{ opacity: 0.4, marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>All caught up! No pending actions.</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {actions.map((action, i) => (
            <motion.div
              key={action._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              {/* Resource badge */}
              <div style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                background: `${resourceColors[action.resource] ?? 'var(--pink)'}20`,
                color: resourceColors[action.resource] ?? 'var(--pink)',
                flexShrink: 0,
              }}>
                {action.resource}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                  {action.action.replace(/_/g, ' ')}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '12px', color: 'var(--pink-light)', fontWeight: 600,
                  }}>
                    by {action.adminName}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(action.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setSelected(action)} style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Eye size={14} /> View
                </button>
                <button onClick={() => reviewMutation.mutate({ id: action._id, action: 'approve' })} style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  border: 'none', background: 'rgba(0,229,160,0.15)',
                  color: 'var(--success)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <CheckCircle size={14} /> Approve
                </button>
                <button onClick={() => { setSelected(action); setNote('') }} style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                  border: 'none', background: 'rgba(255,69,96,0.15)',
                  color: 'var(--error)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 200, padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px', padding: '32px',
                width: '100%', maxWidth: '500px',
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
                {selected.action.replace(/_/g, ' ')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                Submitted by <span style={{ color: 'var(--pink-light)', fontWeight: 600 }}>{selected.adminName}</span>
                {' '}· {new Date(selected.createdAt).toLocaleString()}
              </p>

              <div style={{
                background: 'var(--bg-hover)', borderRadius: '12px',
                padding: '16px', marginBottom: '20px',
              }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  PAYLOAD
                </p>
                <pre style={{
                  fontSize: '12px', color: 'var(--text)',
                  overflow: 'auto', maxHeight: '200px',
                  fontFamily: 'monospace',
                }}>
                  {JSON.stringify(selected.payload, null, 2)}
                </pre>
              </div>

              <textarea
                placeholder="Add a note (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                style={{
                  width: '100%', padding: '12px',
                  borderRadius: '10px', border: '1px solid var(--border)',
                  background: 'var(--bg-hover)', color: 'var(--text)',
                  fontSize: '13px', outline: 'none', resize: 'vertical',
                  marginBottom: '16px',
                }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setSelected(null)} style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text)', cursor: 'pointer', fontWeight: 600,
                }}>
                  Cancel
                </button>
                <button
                  onClick={() => reviewMutation.mutate({ id: selected._id, action: 'reject', note })}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '10px',
                    border: 'none', background: 'rgba(255,69,96,0.15)',
                    color: 'var(--error)', cursor: 'pointer', fontWeight: 700,
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => reviewMutation.mutate({ id: selected._id, action: 'approve', note })}
                  className="gradient-btn"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px' }}
                >
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApprovalsPage

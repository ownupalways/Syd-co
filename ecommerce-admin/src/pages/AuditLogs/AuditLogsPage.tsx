import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FileText, Download, Filter } from 'lucide-react'
import { getAuditLogsApi } from '../../api/audit'
import type { AuditLog } from '../../types'

const statusColors: Record<string, string> = {
  success: 'var(--success)',
  pending: 'var(--warning)',
  rejected: 'var(--error)',
  failed: 'var(--error)',
}

const AuditLogsPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [resource, setResource] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, resource, status],
    queryFn: () => getAuditLogsApi({
      page,
      limit: 20,
      resource: resource || undefined,
      status: status || undefined,
    }),
  })

  const logs: AuditLog[] = data?.data?.data?.data ?? []
  const pagination = data?.data?.data?.pagination

  const exportCSV = () => {
    const headers = ['Admin', 'Role', 'Action', 'Resource', 'Status', 'IP', 'Date']
    const rows = logs.map((l) => [
      l.adminName, l.adminRole, l.action, l.resource,
      l.status, l.ipAddress, new Date(l.createdAt).toLocaleString(),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${Date.now()}.csv`
    a.click()
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>
              Audit Logs
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Complete record of all admin actions
            </p>
          </div>
          <button onClick={exportCSV} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '10px',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
          }}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={16} color="var(--text-secondary)" />
        {['', 'Product', 'Order', 'User', 'AdminUser'].map((r) => (
          <button key={r} onClick={() => { setResource(r); setPage(1) }} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            border: '1px solid var(--border)', cursor: 'pointer',
            background: resource === r ? 'var(--gradient)' : 'transparent',
            color: resource === r ? '#fff' : 'var(--text-secondary)',
          }}>
            {r || 'All'}
          </button>
        ))}
        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} />
        {['', 'success', 'pending', 'rejected', 'failed'].map((s) => (
          <button key={s} onClick={() => { setStatus(s); setPage(1) }} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
            border: `1px solid ${s ? statusColors[s] + '40' : 'var(--border)'}`,
            cursor: 'pointer',
            background: status === s && s ? `${statusColors[s]}20` : status === s ? 'var(--bg-hover)' : 'transparent',
            color: s ? statusColors[s] : 'var(--text-secondary)',
          }}>
            {s || 'All Status'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}>
                {['Admin', 'Action', 'Resource', 'Status', 'IP Address', 'Date'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 700,
                    color: 'var(--text-secondary)', letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>
                    <FileText size={40} style={{ opacity: 0.2, marginBottom: '12px', color: 'var(--pink)' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No logs found</p>
                  </td>
                </tr>
              ) : logs.map((log, i) => (
                <motion.tr
                  key={log._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{log.adminName}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.adminRole}</p>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--pink-light)', fontWeight: 600 }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: 'rgba(255,45,120,0.1)', color: 'var(--pink)',
                    }}>
                      {log.resource}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '12px', fontWeight: 600,
                      color: statusColors[log.status] ?? 'var(--text-secondary)',
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: statusColors[log.status] ?? 'var(--text-secondary)',
                        flexShrink: 0,
                      }} />
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    {log.ipAddress}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: '8px 14px', borderRadius: '8px',
              border: '1px solid var(--border)',
              background: page === p ? 'var(--gradient)' : 'transparent',
              color: page === p ? '#fff' : 'var(--text)',
              cursor: 'pointer', fontWeight: 600, fontSize: '13px',
            }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuditLogsPage

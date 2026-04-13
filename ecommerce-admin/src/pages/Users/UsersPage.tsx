import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, UserCheck, UserX } from 'lucide-react'
import { getUsersApi, toggleUserStatusApi } from '../../api/users'
import type { User } from '../../types'
import toast from 'react-hot-toast'

const UsersPage: React.FC = () => {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users-list', search, page],
    queryFn: () => getUsersApi({ search: search || undefined, page, limit: 10 }),
  })

  const users = (data?.data?.data as { data?: User[] } | undefined)?.data ?? []
  const pagination = (data?.data?.data as { pagination?: { pages?: number } } | undefined)?.pagination

  const toggleMutation = useMutation({
    mutationFn: toggleUserStatusApi,
    onSuccess: () => {
      toast.success('User status updated')
      qc.invalidateQueries({ queryKey: ['admin-users-list'] })
    },
    onError: () => toast.error('Failed to update status'),
  })

  return (
    <div>
      <h1 style={{
        fontSize: 'clamp(20px, 3vw, 26px)',
        fontWeight: 800, color: 'var(--text)', marginBottom: '20px',
      }}>
        Users
      </h1>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '20px' }}>
        <Search size={16} style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-secondary)',
        }} />
        <input
          type="text" placeholder="Search users..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{
            width: '100%', padding: '10px 10px 10px 38px',
            borderRadius: '10px', border: '1px solid var(--border)',
            background: 'var(--bg)', color: 'var(--text)',
            fontSize: '14px', outline: 'none',
          }}
        />
      </div>

      {/* Table — scrollable on mobile */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '14px', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    color: 'var(--text-secondary)', fontSize: '11px',
                    fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No users found
                  </td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} style={{
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'var(--gradient)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0,
                      }}>
                        {u.name.charAt(0)}
                      </div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                        {u.name}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: u.role === 'admin' ? 'rgba(255,45,120,0.15)' : 'rgba(59,130,246,0.15)',
                      color: u.role === 'admin' ? 'var(--pink)' : '#3b82f6',
                      whiteSpace: 'nowrap',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: u.isActive ? 'rgba(0,229,160,0.12)' : 'rgba(255,69,96,0.12)',
                      color: u.isActive ? 'var(--success)' : 'var(--error)',
                      whiteSpace: 'nowrap',
                    }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => toggleMutation.mutate(u.id)}
                      style={{
                        padding: '6px 12px', borderRadius: '8px',
                        fontSize: '11px', fontWeight: 600,
                        border: `1px solid ${u.isActive ? 'rgba(255,69,96,0.3)' : 'rgba(0,229,160,0.3)'}`,
                        background: 'transparent', cursor: 'pointer',
                        color: u.isActive ? 'var(--error)' : 'var(--success)',
                        display: 'flex', alignItems: 'center', gap: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {u.isActive ? <><UserX size={12} /> Deactivate</> : <><UserCheck size={12} /> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (pagination.pages ?? 0) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          {Array.from({ length: pagination.pages ?? 0 }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: '7px 14px', borderRadius: '8px',
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

export default UsersPage

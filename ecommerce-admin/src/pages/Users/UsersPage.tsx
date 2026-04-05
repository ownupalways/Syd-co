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
    onSuccess: () => { toast.success('User status updated'); qc.invalidateQueries({ queryKey: ['admin-users-list'] }) },
    onError: () => toast.error('Failed to update status'),
  })

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginBottom: '24px' }}>Users</h1>

      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input type="text" placeholder="Search users..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{
            width: '100%', padding: '10px 10px 10px 38px',
            borderRadius: '8px', border: '1px solid var(--border)',
            background: 'var(--bg)', color: 'var(--text)',
            fontSize: '14px', outline: 'none',
          }} />
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text)', fontWeight: 600, fontSize: '14px' }}>{u.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: u.role === 'admin' ? 'var(--accent)20' : '#3b82f620',
                    color: u.role === 'admin' ? 'var(--accent)' : '#3b82f6',
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                    background: u.isActive ? '#22c55e20' : '#ef444420',
                    color: u.isActive ? '#22c55e' : '#ef4444',
                  }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => toggleMutation.mutate(u.id)} style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    border: `1px solid ${u.isActive ? '#ef444440' : '#22c55e40'}`,
                    background: 'transparent', cursor: 'pointer',
                    color: u.isActive ? '#ef4444' : '#22c55e',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    {u.isActive ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Activate</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (pagination.pages ?? 0) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {Array.from({ length: pagination.pages ?? 0 }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: '6px 14px', borderRadius: '8px',
              border: '1px solid var(--border)',
              background: page === p ? 'var(--accent)' : 'var(--bg-secondary)',
              color: page === p ? '#fff' : 'var(--text)',
              cursor: 'pointer', fontWeight: 600,
            }}>{p}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default UsersPage

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { FileText, Download, Filter, Globe, Shield } from 'lucide-react'
import { getAuditLogsApi } from '../../api/audit'
import type { AuditLog } from '../../types'

const statusColors: Record<string, string> = {
  success: 'text-emerald-500 bg-emerald-500/10',
  pending: 'text-amber-500 bg-amber-500/10',
  rejected: 'text-rose-500 bg-rose-500/10',
  failed: 'text-rose-600 bg-rose-600/10',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A comprehensive trail of all administrative system actions.
          </p>
        </div>
        <button 
          onClick={exportCSV} 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm"
        >
          <Download size={18} /> Export CSV
        </button>
      </motion.div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={18} />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Filters</span>
        </div>
        
        {/* Resource Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {['', 'Product', 'Order', 'User', 'AdminUser'].map((r) => (
            <button 
              key={r} 
              onClick={() => { setResource(r); setPage(1) }} 
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                resource === r 
                ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {r || 'All Resources'}
            </button>
          ))}
        </div>

        <div className="hidden lg:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {['', 'success', 'pending', 'rejected', 'failed'].map((s) => (
            <button 
              key={s} 
              onClick={() => { setStatus(s); setPage(1) }} 
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                status === s 
                ? 'bg-indigo-600 border-indigo-600 text-white' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-bottom border-slate-200 dark:border-slate-700">
                {['Admin / Role', 'Action', 'Resource', 'Status', 'IP Address', 'Timestamp'].map((h) => (
                  <th key={h} className="px-6 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">Synchronizing logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileText size={48} className="text-slate-200 dark:text-slate-700" />
                      <p className="text-slate-500 font-medium">No activity records match your current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : logs.map((log, i) => (
                <motion.tr
                  key={log._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                        <Shield size={14} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{log.adminName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{log.adminRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-600">
                      {log.resource}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[log.status] || 'text-slate-400 bg-slate-100'}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {log.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <Globe size={12} className="opacity-50" />
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button 
              key={p} 
              onClick={() => setPage(p)} 
              className={`min-w-10 h-10 rounded-xl text-sm font-bold transition-all border ${
                page === p 
                ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuditLogsPage

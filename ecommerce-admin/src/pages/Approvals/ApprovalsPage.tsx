import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, Eye, Clock, User, Box } from 'lucide-react'
import { getPendingActionsApi, reviewPendingActionApi } from '../../api/pending'
import type { PendingAction } from '../../types'
import toast from 'react-hot-toast'

const resourceColors: Record<string, string> = {
  Product: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  Order: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  User: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
}

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.header 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-10"
      >
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Approval Queue
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Peer-review sub-admin requests to maintain system integrity.
        </p>
      </motion.header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          <p className="text-sm font-medium">Fetching pending requests...</p>
        </div>
      ) : actions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 mb-4">
            <CheckCircle size={32} className="text-emerald-500 opacity-80" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">All caught up!</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">No actions currently require your review.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {actions.map((action, i) => (
            <motion.div
              key={action._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-all"
            >
              {/* Resource & Icon */}
              <div className={`flex flex-col items-center justify-center w-full md:w-24 px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest ${resourceColors[action.resource] || 'text-slate-500 bg-slate-50'}`}>
                <Box size={16} className="mb-1 opacity-70" />
                {action.resource}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {action.action.replace(/_/g, ' ')}
                </h3>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[12px]">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                    <User size={12} className="opacity-50" />
                    {action.adminName}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={12} className="opacity-50" />
                    {new Date(action.createdAt).toLocaleDateString()} at {new Date(action.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                <button 
                  onClick={() => setSelected(action)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Eye size={14} /> View
                </button>
                <button 
                  onClick={() => reviewMutation.mutate({ id: action._id, action: 'approve' })}
                  disabled={reviewMutation.isPending}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button 
                  onClick={() => { setSelected(action); setNote('') }}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                >
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {selected.action.replace(/_/g, ' ')}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 italic">
                      Reviewing request from {selected.adminName}
                    </p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Changeset Payload</span>
                  <pre className="text-[12px] font-mono text-indigo-600 dark:text-indigo-400 overflow-auto max-h-62.5 leading-relaxed">
                    {JSON.stringify(selected.payload, null, 2)}
                  </pre>
                </div>

                <textarea
                  placeholder="Reason for approval or rejection..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-4 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  rows={3}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                  <button 
                    onClick={() => setSelected(null)}
                    className="order-3 sm:order-1 px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => reviewMutation.mutate({ id: selected._id, action: 'reject', note })}
                    className="order-1 sm:order-2 px-4 py-3 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                  >
                    Confirm Reject
                  </button>
                  <button
                    onClick={() => reviewMutation.mutate({ id: selected._id, action: 'approve', note })}
                    className="order-2 sm:order-3 px-4 py-3 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 rounded-xl transition-colors shadow-lg"
                  >
                    Confirm Approve
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApprovalsPage

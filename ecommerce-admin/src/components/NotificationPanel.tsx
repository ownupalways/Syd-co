import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, UserCheck, CheckCircle, Clock, Inbox } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const { notifications, markAllRead, markRead } = useNotificationStore()

  const icons = {
    'new-registration': <UserCheck size={16} className="text-blue-500" />,
    'action-reviewed': <CheckCircle size={16} className="text-emerald-500" />,
    'pending-action': <Clock size={16} className="text-amber-500" />,
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-99"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-95 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-100 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg">
                  <Bell size={18} className="text-rose-500" />
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white">Notifications</h2>
              </div>
              
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <Inbox size={48} className="text-slate-300 mb-4" />
                  <p className="text-sm font-medium text-slate-500">Your inbox is empty</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => markRead(n.id)}
                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                      n.read 
                        ? 'bg-transparent border-slate-100 dark:border-slate-800 opacity-60' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1 italic">
                        {icons[n.type as keyof typeof icons] || <Bell size={16} className="text-slate-400" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight mb-1 truncate">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-3 block uppercase tracking-wider">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationPanel

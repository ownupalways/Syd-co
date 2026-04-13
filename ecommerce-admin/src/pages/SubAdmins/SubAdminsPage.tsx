import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, UserX, Clock, CheckCircle, XCircle, Shield, Mail, Calendar } from 'lucide-react';
import { getSubAdminsApi, reviewSubAdminApi } from '../../api/auth';
import type { AdminUser } from '../../types';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  active: { color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle },
  pending: { color: 'text-amber-500 bg-amber-500/10', icon: Clock },
  rejected: { color: 'text-rose-500 bg-rose-500/10', icon: XCircle },
  suspended: { color: 'text-slate-400 bg-slate-400/10', icon: UserX },
};

const ALL_PERMISSIONS = [
  'products:read', 'products:write', 'products:delete',
  'orders:read', 'orders:write', 'users:read', 'users:write',
  'reports:read', 'coupons:write',
];

const SubAdminsPage: React.FC = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>('all');
  const [reviewTarget, setReviewTarget] = useState<AdminUser | null>(null);
  const [reviewAction, setReviewAction] =
		useState<"approve" | "reject" | "suspend">(
			"approve",
		);
  const [reason, setReason] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['products:read', 'orders:read']);

  const { data, isLoading } = useQuery({
    queryKey: ['sub-admins', filter],
    queryFn: () => getSubAdminsApi(filter === 'all' ? undefined : filter),
  });

  const admins = data?.data?.data ?? [];

  const reviewMutation = useMutation({
		// Update the type of 'action' from string to the specific union
		mutationFn: ({
			id,
			...rest
		}: {
			id: string;
			action: "approve" | "reject" | "suspend"; // Change this line
			reason?: string;
			permissions?: string[];
		}) => reviewSubAdminApi(id, rest),

		onSuccess: (_, vars) => {
			toast.success(
				`Sub-admin ${vars.action}ed successfully`,
			);
			qc.invalidateQueries({
				queryKey: ["sub-admins"],
			});
			closeModal();
		},
		onError: () =>
			toast.error(
				"Action failed. Please try again.",
			),
	});
  const closeModal = () => {
    setReviewTarget(null);
    setReason('');
  };

  const handleAction = (admin: AdminUser, action: 'approve' | 'reject' | 'suspend') => {
    setReviewTarget(admin);
    setReviewAction(action);
    if (action === 'approve') setSelectedPermissions(admin.permissions || []);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <header className="mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sub-Admin Management
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Audit, approve, and manage access levels for your team members.
          </p>
        </motion.div>
      </header>

      {/* Responsive Filter Tabs */}
      <nav className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'pending', 'active', 'rejected', 'suspended'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border
              ${filter === f 
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
            <UserCheck className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No sub-admins found</h3>
          <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or checking back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {admins.map((admin, i) => {
            const Config = STATUS_CONFIG[admin.status as keyof typeof STATUS_CONFIG];
            return (
              <motion.div
                key={admin.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-30 sm:max-w-none">
                        {admin.name}
                      </h4>
                      <div className="flex items-center text-xs text-slate-500 gap-1">
                        <Mail size={12} /> {admin.email}
                      </div>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${Config.color}`}>
                    <Config.icon size={12} /> {admin.status}
                  </span>
                </div>

                {/* Permissions Chips */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-3 tracking-widest">PERMISSIONS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {admin.permissions.slice(0, 3).map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-600">
                        {p}
                      </span>
                    ))}
                    {admin.permissions.length > 3 && (
                      <span className="text-[11px] text-slate-400 self-center">+{admin.permissions.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Footer Info & Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-col gap-4">
                  <div className="flex items-center text-[11px] text-slate-400 gap-1">
                    <Calendar size={12} /> Last active: {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                  </div>
                  
                  <div className="flex gap-2">
                    {admin.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => handleAction(admin, 'approve')}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAction(admin, 'reject')}
                          className="flex-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 py-2 rounded-lg text-xs font-bold transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleAction(admin, admin.status === 'active' ? 'suspend' : 'approve')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-2
                          ${admin.status === 'active' 
                            ? 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/30' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 border-transparent'
                          }`}
                      >
                        {admin.status === 'active' ? <><Shield size={14} /> Suspend</> : 'Reinstate'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {reviewTarget && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white capitalize mb-1">
                {reviewAction} {reviewTarget.name}
              </h2>
              <p className="text-sm text-slate-500 mb-8">{reviewTarget.email}</p>

              {reviewAction === 'approve' ? (
                <div className="space-y-4 mb-8">
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Configure Permissions</p>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {ALL_PERMISSIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPermissions(prev => 
                          prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                        )}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                          ${selectedPermissions.includes(p)
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-400'
                            : 'border-slate-100 dark:border-slate-700 text-slate-500'
                          }`}
                      >
                        {p.replace(':', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <label className="block text-xs font-bold text-slate-400 tracking-widest uppercase mb-3">Reason for Action</label>
                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide a reason for this status change..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-colors">
                  Cancel
                </button>
                <button
                  disabled={reviewMutation.isPending}
                  onClick={() => reviewMutation.mutate({
                    id: reviewTarget.id,
                    action: reviewAction,
                    reason,
                    permissions: reviewAction === 'approve' ? selectedPermissions : undefined,
                  })}
                  className="flex-1 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-sm font-bold rounded-2xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {reviewMutation.isPending ? 'Processing...' : `Confirm ${reviewAction}`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubAdminsPage;

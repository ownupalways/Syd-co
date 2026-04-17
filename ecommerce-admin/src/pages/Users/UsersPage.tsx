import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Search,
	UserCheck,
	UserX,
	Mail,
	Calendar,
	MoreHorizontal,
} from "lucide-react";
import { getUsersApi, toggleUserStatusApi } from '../../api/users';
import type { User } from '../../types';
import toast from 'react-hot-toast';

const UsersPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users-list', search, page],
    queryFn: () => getUsersApi({ search: search || undefined, page, limit: 12 }),
  });

  const users = (data?.data?.data as { data?: User[] } | undefined)?.data ?? [];
  const pagination = (data?.data?.data as { pagination?: { pages?: number } } | undefined)?.pagination;

  const toggleMutation = useMutation({
    mutationFn: toggleUserStatusApi,
    onSuccess: () => {
      toast.success('User status updated');
      qc.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-200">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Community</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor SydneyShopping members.</p>
        </div>
        
        <div className="relative group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full md:w-96 bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton Loader placeholder
          [...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-900/50 rounded-3xl animate-pulse border border-slate-800" />
          ))
        ) : users.map((u) => (
          <div key={u.id} className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-rose-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/5">
            {/* Top Row: Avatar & Role */}
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-xl font-black text-rose-500 shadow-lg">
                  {u.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-slate-900 ${u.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>
              <div className="flex flex-col items-end gap-2">
                 <button className="p-2 text-slate-600 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                 </button>
                 <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                  u.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {u.role}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                {u.name}
              </h3>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Mail size={12} />
                <span className="truncate">{u.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-[11px] font-medium uppercase tracking-wider">
                <Calendar size={12} />
                Joined {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Action Area */}
            <button
              disabled={toggleMutation.isPending}
              onClick={() => toggleMutation.mutate(u.id)}
              className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                u.isActive 
                  ? 'bg-slate-800 text-rose-500 hover:bg-rose-500/10 border border-slate-700 hover:border-rose-500/30' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20'
              }`}
            >
              {u.isActive ? <><UserX size={14} /> Deactivate Account</> : <><UserCheck size={14} /> Enable Access</>}
            </button>
          </div>
        ))}
      </div>

      {/* Modern Pagination */}
      {pagination && (pagination.pages ?? 0) > 1 && (
        <div className="flex justify-center items-center gap-3 pt-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold disabled:opacity-30"
          >
            Prev
          </button>
          <div className="flex gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  page === i + 1 ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={page === pagination.pages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

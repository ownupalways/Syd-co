import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with entrance animation */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Orders
        </h1>
      </motion.header>

      {/* Empty State Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-center min-h-100 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 text-center transition-all"
      >
        <div className="p-5 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-6">
          <ShoppingBag 
            size={48} 
            className="text-slate-400 dark:text-slate-500 opacity-80" 
          />
        </div>

        <div className="max-w-xs space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Orders management coming soon
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            This module will be fully accessible once the checkout integration is complete.
          </p>
        </div>

        {/* Progress indicator or placeholder button */}
        <div className="mt-8 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Module in Development
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default OrdersPage;

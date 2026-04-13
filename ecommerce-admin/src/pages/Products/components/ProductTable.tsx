import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Star } from 'lucide-react';
import type { Product } from '../../../types'; 

interface Props {
  products: Product[];
  isLoading: boolean;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

const ProductTable: React.FC<Props> = ({ products, isLoading, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-200">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/20">
              {['Image', 'Name', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              <tr><td colSpan={7} className="p-20 text-center text-slate-500 animate-pulse">Loading items...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="p-20 text-center text-slate-500">No products found.</td></tr>
            ) : (
              products.map((p, i) => (
                <motion.tr 
                  key={p._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/3 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-12">
                      <img src={p.image} className="w-full h-full object-cover rounded-lg border border-slate-700" alt={p.name} />
                      {p.images && p.images.length > 0 && (
                        <span className="absolute -bottom-1 -right-1 bg-rose-500 text-[9px] font-bold px-1 rounded-md">+{p.images.length}</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-white truncate max-w-37.5">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.seller}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {p.category}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">${p.price}</span>
                      {p.originalPrice && <span className="text-[10px] text-slate-500 line-through">${p.originalPrice}</span>}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {p.stock > 0 ? `${p.stock} In Stock` : 'Out of Stock'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {p.isBestSeller && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded-lg">
                        <Star size={10} fill="currentColor" /> Best Seller
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(p)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDelete(p)} className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-500/60 hover:text-rose-500 transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;

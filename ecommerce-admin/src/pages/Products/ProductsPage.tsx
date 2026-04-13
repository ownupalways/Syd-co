import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { getProductsApi } from '../../api/products';
import type { Product } from '../../types';

// Refactored Component Imports
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const ProductsPage: React.FC = () => {
  // --- State Management ---
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  // Modal Visibility & Target States
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // --- Data Fetching ---
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products-list', search, page],
    queryFn: () => getProductsApi({ search: search || undefined, page, limit: 10 }),
  });

  const products = Array.isArray(data?.data?.data) ? (data.data.data as Product[]) : [];
  const pagination = data?.data?.pagination;

  // --- Handlers ---
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseModals = () => {
    setShowForm(false);
    setEditingProduct(null);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Products</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage {pagination?.total ?? 0} items in the SydneyShopping catalog
            </p>
          </div>
          
          <button 
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-rose-500 to-pink-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative mb-8 max-w-md group">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" 
            size={18} 
          />
          <input 
            type="text" 
            value={search}
            placeholder="Search by name, category, or seller..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 outline-none transition-all placeholder:text-slate-600"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset to first page on new search
            }}
          />
        </div>

        {/* Main Table Component */}
        <ProductTable 
          products={products} 
          isLoading={isLoading} 
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
        />

        {/* Pagination Controls */}
        {pagination && (pagination.pages ?? 0) > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {Array.from({ length: pagination.pages ?? 0 }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  page === p 
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Modals */}
        <ProductFormModal 
          isOpen={showForm} 
          editing={editingProduct} 
          onClose={handleCloseModals} 
        />

        <DeleteConfirmModal 
          target={deleteTarget} 
          onClose={handleCloseModals} 
        />
      </div>
    </div>
  );
};

export default ProductsPage;

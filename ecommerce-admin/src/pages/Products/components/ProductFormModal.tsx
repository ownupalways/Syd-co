import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Star, Save } from 'lucide-react'; // Removed unused 'Plus'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// 1. Updated to use your new path aliases
import { createProductApi, updateProductApi, uploadImageApi } from '@api/products';
import type { Product } from '@typings/index'; // Or just '@typings' depending on your file name

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editing: Product | null;
}

const CATEGORIES = ['Electronics', 'Fashion', 'Footwear', 'Sports', 'Home & Living', 'Beauty', 'Other'];

const EMPTY_FORM = {
  name: '', description: '', price: '', originalPrice: '',
  category: '', stock: '', seller: '', image: '',
  images: [] as string[], isBestSeller: false,
};

// 2. Defined a type for the payload to fix "Unexpected any"
interface ProductPayload extends Omit<typeof EMPTY_FORM, 'price' | 'originalPrice' | 'stock'> {
  price: number;
  originalPrice?: number;
  stock: number;
}

const ProductFormModal: React.FC<Props> = ({ isOpen, onClose, editing }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState({ main: false, extra: false });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description,
        price: String(editing.price),
        originalPrice: String(editing.originalPrice ?? ''),
        category: editing.category,
        stock: String(editing.stock),
        seller: editing.seller,
        image: editing.image,
        images: editing.images ?? [],
        // 3. Fixed the "any" cast here
        isBestSeller: editing.isBestSeller ?? false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editing, isOpen]);

 const { mutate: saveProduct, isPending } =
		useMutation({
			mutationFn: (payload: ProductPayload) =>
				editing
					? updateProductApi(editing._id, payload)
					: createProductApi(payload),
			onSuccess: (res) => {
				toast.success(res.data.message);
				qc.invalidateQueries({
					queryKey: ["admin-products-list"],
				});
				onClose();
			},
		});

  const handleImageUpload = async (file: File, type: 'main' | 'extra') => {
    if (type === 'extra' && form.images.length >= 4) return toast.error('Max 4 extra images');
    
    setUploading(prev => ({ ...prev, [type === 'main' ? 'main' : 'extra']: true }));
    try {
      const res = await uploadImageApi(file);
      const url = res.data.data!.url;
      
      setForm(f => type === 'main' 
        ? { ...f, image: url } 
        : { ...f, images: [...f.images, url] }
      );
      toast.success('Upload complete');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [type === 'main' ? 'main' : 'extra']: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return toast.error('Main image is required');
    
    saveProduct({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black bg-linear-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
                {editing ? 'Edit Product' : 'New Product'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Name</label>
                  <input 
                    required type="text" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="e.g. Velvet Lip Kit"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                  <select 
                    required value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
  {/* We define the keys as a constant to tell TS these are valid properties of our form */}
  {(['price', 'originalPrice', 'stock'] as const).map((key) => {
    const labels = { price: 'Price', originalPrice: 'Original', stock: 'Stock' };
    
    return (
      <div key={key} className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {labels[key]}
        </label>
        <input 
          type="number" 
          required={key !== 'originalPrice'}
          // No "as any"! TS knows 'key' exists on 'form' because of 'as const'
          value={form[key] as string | number}
          onChange={e => setForm({...form, [key]: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
        />
      </div>
    );
  })}
</div>
              <div 
                onClick={() => setForm(f => ({ ...f, isBestSeller: !f.isBestSeller }))}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  form.isBestSeller ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800/30 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star size={20} className={form.isBestSeller ? 'text-amber-400' : 'text-slate-600'} fill={form.isBestSeller ? 'currentColor' : 'none'} />
                  <div>
                    <p className="text-sm font-bold text-white">Best Seller Status</p>
                    <p className="text-[11px] text-slate-500">Feature this on the home page</p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${form.isBestSeller ? 'bg-amber-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.isBestSeller ? 'left-6' : 'left-1'}`} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Display Image</label>
                <div 
                  className={`relative group h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                    form.image ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-800/20'
                  }`}
                  onClick={() => !uploading.main && document.getElementById('main-upload')?.click()}
                >
                  {form.image ? (
                    <img src={form.image} className="h-full w-full object-contain rounded-xl p-2" alt="Preview" />
                  ) : (
                    <>
                      <Upload className={`mb-2 ${uploading.main ? 'animate-bounce text-rose-500' : 'text-slate-500'}`} />
                      <p className="text-xs text-slate-500 font-medium">{uploading.main ? 'Uploading...' : 'Drop main image here'}</p>
                    </>
                  )}
                  <input id="main-upload" type="file" hidden onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'main')} />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button 
                  disabled={isPending || uploading.main || uploading.extra}
                  className="flex-2 py-4 bg-linear-to-r from-rose-500 to-pink-600 rounded-xl text-white text-sm font-black shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                  {editing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;

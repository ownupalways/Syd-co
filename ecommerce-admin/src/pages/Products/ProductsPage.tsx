import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Search, Upload, X, Star } from 'lucide-react'
import { getProductsApi, deleteProductApi, updateProductApi, uploadImageApi, createProductApi } from '../../api/products'
import type { Product } from '../../types'
import toast from 'react-hot-toast'

const CATEGORIES = ['Electronics', 'Fashion', 'Footwear', 'Sports', 'Home & Living', 'Beauty', 'Other']

const emptyForm = {
  name: '', description: '', price: '', originalPrice: '',
  category: '', stock: '', seller: '', image: '',
  images: [] as string[], isBestSeller: false,
}

const ProductsPage: React.FC = () => {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [uploadingExtra, setUploadingExtra] = useState(false)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products-list', search, page],
    queryFn: () => getProductsApi({ search: search || undefined, page, limit: 10 }),
  })


 const products = Array.isArray(data?.data?.data)
		? (data.data.data as Product[])
		: [];
 const pagination = data?.data?.pagination;
  
 const createMutation = useMutation({
		mutationFn: (
			payload: Record<string, unknown>,
		) => createProductApi(payload),
		onSuccess: (res) => {
			const message = res.data.message;
			if (message.includes("approval")) {
				toast.success(
					"Product submitted for super-admin approval! ⏳",
				);
			} else {
				toast.success("Product created!");
			}
			qc.invalidateQueries({
				queryKey: ["admin-products-list"],
			});
			resetForm();
		},
		onError: () =>
			toast.error("Failed to create product"),
 });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => updateProductApi(id, data),
    onSuccess: () => {
      toast.success('Product updated!')
      qc.invalidateQueries({ queryKey: ['admin-products-list'] })
      resetForm()
    },
    onError: () => toast.error('Update failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      toast.success('Product deleted')
      qc.invalidateQueries({ queryKey: ['admin-products-list'] })
      setDeleteTarget(null)
    },
    onError: () => toast.error('Delete failed'),
  })

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      originalPrice: String(p.originalPrice ?? ''),
      category: p.category,
      stock: String(p.stock),
      seller: p.seller,
      image: p.image,
      images: p.images ?? [],
      isBestSeller: (p as Product & { isBestSeller?: boolean }).isBestSeller ?? false,
    })
    setShowForm(true)
  }

  const handleMainImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const res = await uploadImageApi(file)
      setForm((f) => ({ ...f, image: res.data.data!.url }))
      toast.success('Main image uploaded!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleExtraImageUpload = async (file: File) => {
    if (form.images.length >= 4) {
      toast.error('Maximum 4 additional images allowed')
      return
    }
    setUploadingExtra(true)
    try {
      const res = await uploadImageApi(file)
      setForm((f) => ({ ...f, images: [...f.images, res.data.data!.url] }))
      toast.success('Image added!')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploadingExtra(false)
    }
  }

  const removeExtraImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image) {
      toast.error('Please upload a main product image')
      return
    }
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      stock: Number(form.stock),
      seller: form.seller,
      image: form.image,
      images: form.images,
      isBestSeller: form.isBestSeller,
    }
    if (editing) {
      updateMutation.mutate({ id: editing._id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px',
    borderRadius: '10px', border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.04)', color: 'var(--text)',
    fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text)' }}>Products</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
            {pagination?.total ?? 0} total products
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="gradient-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', fontSize: '14px' }}
        >
          <Plus size={18} /> Add Product
        </motion.button>
      </motion.div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '24px' }}>
        <Search size={16} style={{
          position: 'absolute', left: '12px', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-secondary)',
        }} />
        <input
          type="text" placeholder="Search products..." value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ ...inputStyle, paddingLeft: '38px' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                {['Image', 'Name', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '13px 16px', textAlign: 'left',
                    color: 'var(--text-secondary)', fontSize: '11px',
                    fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>No products found</td></tr>
              ) : products.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ position: 'relative', width: '48px' }}>
                      <img src={p.image} alt={p.name} style={{
                        width: '48px', height: '48px',
                        objectFit: 'cover', borderRadius: '10px',
                        border: '1px solid var(--border)',
                      }} />
                      {p.images?.length > 0 && (
                        <span style={{
                          position: 'absolute', bottom: '-4px', right: '-4px',
                          background: 'var(--pink)', color: '#fff',
                          borderRadius: '50%', width: '16px', height: '16px',
                          fontSize: '9px', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          +{p.images.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{p.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.seller}</p>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                      background: 'rgba(255,45,120,0.1)', color: 'var(--pink)',
                    }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--pink-light)' }}>${p.price}</p>
                    {p.originalPrice && (
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ${p.originalPrice}
                      </p>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      background: p.stock > 0 ? 'rgba(0,229,160,0.12)' : 'rgba(255,69,96,0.12)',
                      color: p.stock > 0 ? 'var(--success)' : 'var(--error)',
                    }}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {(p as Product & { isBestSeller?: boolean }).isBestSeller && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                        background: 'rgba(255,184,0,0.15)', color: 'var(--warning)',
                      }}>
                        <Star size={11} fill="var(--warning)" /> Best Seller
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEdit(p)} style={{
                        padding: '7px', borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'transparent', cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        transition: 'all 0.2s',
                      }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(p)} style={{
                        padding: '7px', borderRadius: '8px',
                        border: '1px solid rgba(255,69,96,0.3)',
                        background: 'transparent', cursor: 'pointer',
                        color: 'var(--error)',
                      }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (pagination.pages ?? 0) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {Array.from({ length: pagination.pages ?? 0 }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: '7px 14px', borderRadius: '8px',
              border: '1px solid var(--border)',
              background: page === p ? 'var(--gradient)' : 'transparent',
              color: page === p ? '#fff' : 'var(--text)',
              cursor: 'pointer', fontWeight: 600, fontSize: '13px',
            }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-card)', border: '1px solid rgba(255,69,96,0.3)',
                borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(255,69,96,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Trash2 size={24} color="var(--error)" />
              </div>
              <h2 style={{ color: 'var(--text)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Delete Product?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                "{deleteTarget.name}" will be deactivated and hidden from the store.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setDeleteTarget(null)} style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text)', cursor: 'pointer', fontWeight: 600,
                }}>
                  Cancel
                </button>
                <button onClick={() => deleteMutation.mutate(deleteTarget._id)} style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: 'none', background: 'var(--error)',
                  color: '#fff', cursor: 'pointer', fontWeight: 700,
                }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={resetForm}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px', padding: '32px',
                width: '100%', maxWidth: '600px',
                maxHeight: '92vh', overflowY: 'auto',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="gradient-text" style={{ fontSize: '22px', fontWeight: 800 }}>
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={resetForm} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', padding: '4px',
                }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Name + Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      PRODUCT NAME *
                    </label>
                    <input
                      type="text" value={form.name} required
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={inputStyle} placeholder="e.g. Lip Gloss Set"
                      onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                      CATEGORY *
                    </label>
                    <select
                      value={form.category} required
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price + Original Price + Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    { key: 'price', label: 'PRICE ($) *', placeholder: '29.99' },
                    { key: 'originalPrice', label: 'ORIGINAL PRICE ($)', placeholder: '49.99' },
                    { key: 'stock', label: 'STOCK *', placeholder: '100' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                        {f.label}
                      </label>
                      <input
                        type="number" value={form[f.key as keyof typeof form] as string}
                        required={f.key !== 'originalPrice'}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        style={inputStyle} placeholder={f.placeholder}
                        onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  ))}
                </div>

                {/* Seller */}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    SELLER *
                  </label>
                  <input
                    type="text" value={form.seller} required
                    onChange={(e) => setForm({ ...form, seller: e.target.value })}
                    style={inputStyle} placeholder="e.g. Syd & Co Official"
                    onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    DESCRIPTION *
                  </label>
                  <textarea
                    value={form.description} required rows={3}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="Describe the product..."
                    onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                {/* Best Seller Toggle */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: '12px',
                  background: form.isBestSeller ? 'rgba(255,184,0,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${form.isBestSeller ? 'rgba(255,184,0,0.3)' : 'var(--border)'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onClick={() => setForm((f) => ({ ...f, isBestSeller: !f.isBestSeller }))}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Star size={18} color="var(--warning)" fill={form.isBestSeller ? 'var(--warning)' : 'none'} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Best Seller</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Shows a "Best Seller" badge on the product in the store
                      </p>
                    </div>
                  </div>
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px',
                    background: form.isBestSeller ? 'var(--warning)' : 'var(--border)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                  }}>
                    <div style={{
                      position: 'absolute', top: '3px',
                      left: form.isBestSeller ? '23px' : '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                    }} />
                  </div>
                </div>

                {/* Main Image Upload */}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    MAIN IMAGE * <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(PNG, JPG, WEBP — max 5MB)</span>
                  </label>
                  <div
                    onClick={() => document.getElementById('main-img-upload')?.click()}
                    style={{
                      border: `2px dashed ${form.image ? 'var(--pink)' : 'var(--border)'}`,
                      borderRadius: '12px', padding: '16px',
                      textAlign: 'center', cursor: 'pointer',
                      background: form.image ? 'rgba(255,45,120,0.05)' : 'rgba(255,255,255,0.02)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {form.image ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={form.image} alt="main" style={{
                          height: '100px', objectFit: 'cover',
                          borderRadius: '8px', border: '2px solid var(--pink)',
                        }} />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, image: '' })) }}
                          style={{
                            position: 'absolute', top: '-8px', right: '-8px',
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: 'var(--error)', border: 'none',
                            cursor: 'pointer', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={12} />
                        </button>
                        <p style={{ fontSize: '11px', color: 'var(--success)', marginTop: '8px' }}>
                          ✓ Main image set — click to change
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} color="var(--text-secondary)" style={{ marginBottom: '8px' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          {uploading ? 'Uploading...' : 'Click to upload main image'}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </>
                    )}
                    <input
                      id="main-img-upload" type="file" accept="image/png,image/jpeg,image/webp" hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleMainImageUpload(file)
                      }}
                    />
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    ADDITIONAL IMAGES <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({form.images.length}/4 added)</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={img} alt={`extra-${i}`} style={{
                          width: '100%', aspectRatio: '1',
                          objectFit: 'cover', borderRadius: '10px',
                          border: '1px solid var(--border)',
                        }} />
                        <button
                          type="button"
                          onClick={() => removeExtraImage(i)}
                          style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: 'var(--error)', border: 'none',
                            cursor: 'pointer', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    {form.images.length < 4 && (
                      <div
                        onClick={() => document.getElementById('extra-img-upload')?.click()}
                        style={{
                          aspectRatio: '1', borderRadius: '10px',
                          border: '2px dashed var(--border)',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', background: 'rgba(255,255,255,0.02)',
                          gap: '4px', transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--pink)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                      >
                        {uploadingExtra ? (
                          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Uploading...</p>
                        ) : (
                          <>
                            <Plus size={20} color="var(--text-secondary)" />
                            <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Add image</p>
                          </>
                        )}
                        <input
                          id="extra-img-upload" type="file" accept="image/png,image/jpeg,image/webp" hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) { handleExtraImageUpload(file); e.target.value = '' }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={resetForm} style={{
                    flex: 1, padding: '13px', borderRadius: '12px',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  }}>
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.98 }}
                    className="gradient-btn"
                    style={{
                      flex: 2, padding: '13px', borderRadius: '12px',
                      fontSize: '14px', opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductsPage

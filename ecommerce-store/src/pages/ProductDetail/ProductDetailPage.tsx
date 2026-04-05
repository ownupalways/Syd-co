import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, Star, ArrowLeft, Plus, Minus, Truck, Shield } from 'lucide-react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { getProductByIdApi } from '@api/products'
import { useCartStore } from '@store/cartStore'
import toast from 'react-hot-toast'

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductByIdApi(id!),
    enabled: !!id,
  })

  const product = data?.data?.data

  if (isLoading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: t.textSecondary }}>
      Loading...
    </div>
  )

  if (!product) return (
    <div style={{ padding: '60px', textAlign: 'center', color: t.textSecondary }}>
      Product not found.
    </div>
  )

  const images = product.images?.length ? product.images : [product.image]

  return (
    <div style={{ background: t.background, minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: t.textSecondary, marginBottom: '24px', fontSize: '15px',
        }}>
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Images */}
          <div>
            <img src={images[activeImg]} alt={product.name} style={{
              width: '100%', borderRadius: '12px', objectFit: 'cover',
              aspectRatio: '1', border: `1px solid ${t.border}`,
            }} />
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setActiveImg(i)} style={{
                    width: '70px', height: '70px', objectFit: 'cover',
                    borderRadius: '8px', cursor: 'pointer',
                    border: `2px solid ${i === activeImg ? t.primaryDark : t.border}`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{ color: t.textSecondary, fontSize: '13px', marginBottom: '8px' }}>{product.category}</p>
            <h1 style={{ color: t.text, fontSize: '26px', marginBottom: '12px', lineHeight: 1.3 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16}
                  fill={i < Math.round(product.rating) ? t.primary : 'none'}
                  color={t.primary} />
              ))}
              <span style={{ color: t.textSecondary, fontSize: '14px' }}>
                ({product.reviews} reviews)
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: t.primaryDark }}>
                ${product.price}
              </span>
              {product.originalPrice && (
                <span style={{
                  fontSize: '18px', color: t.textSecondary,
                  textDecoration: 'line-through', marginLeft: '10px',
                }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <p style={{ color: t.textSecondary, lineHeight: 1.6, marginBottom: '24px' }}>
              {product.description}
            </p>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ color: t.text, fontWeight: 600 }}>Qty:</span>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{
                background: t.border, border: 'none', borderRadius: '8px',
                width: '36px', height: '36px', cursor: 'pointer', color: t.text,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Minus size={16} />
              </button>
              <span style={{ color: t.text, fontWeight: 700, fontSize: '18px', minWidth: '32px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{
                background: t.border, border: 'none', borderRadius: '8px',
                width: '36px', height: '36px', cursor: 'pointer', color: t.text,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={16} />
              </button>
              <span style={{ color: t.textSecondary, fontSize: '14px' }}>
                {product.stock} in stock
              </span>
            </div>

            <button
              disabled={product.stock === 0}
              onClick={() => { addItem(product, quantity); toast.success('Added to cart!') }}
              style={{
                width: '100%',
                background: product.stock === 0 ? t.border : t.primaryDark,
                color: '#fff',
                border: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}>
              <ShoppingCart size={20} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              {[
                { icon: <Truck size={16} />, text: 'Free shipping over $50' },
                { icon: <Shield size={16} />, text: 'Secure checkout' },
              ].map((b) => (
                <div key={b.text} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  color: t.textSecondary, fontSize: '13px',
                }}>
                  {b.icon} {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

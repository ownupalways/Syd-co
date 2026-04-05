import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useTheme } from '../context/useTheme'
import { useCartStore } from '../store/cartStore'
import { theme } from '../styles/theme'
import { Product } from '@typings/index'
import toast from 'react-hot-toast'

interface Props { product: Product }

const ProductCard: React.FC<Props> = ({ product }) => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`Added to cart!`)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: t.backgroundSecondary,
          border: `1px solid ${t.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
          transition: 'all 0.2s',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = `0 8px 20px ${t.shadow}`
          e.currentTarget.style.borderColor = t.primaryDark
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = t.border
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
          {/* Badges */}
          <div style={{
            position: 'absolute', top: '6px', left: '6px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            {discount && (
              <span style={{
                background: t.primaryDark, color: '#fff',
                padding: '2px 6px', borderRadius: '4px',
                fontSize: '10px', fontWeight: 700,
              }}>
                -{discount}%
              </span>
            )}
            {(product as Product & { isBestSeller?: boolean }).isBestSeller && (
              <span style={{
                background: '#FFB800', color: '#fff',
                padding: '2px 6px', borderRadius: '4px',
                fontSize: '10px', fontWeight: 700,
              }}>
                🔥 Best
              </span>
            )}
          </div>
          {/* Quick add button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{
              position: 'absolute', bottom: '6px', right: '6px',
              background: product.stock === 0 ? t.border : t.primaryDark,
              color: '#fff', border: 'none',
              borderRadius: '8px', padding: '6px',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            className="add-to-cart-btn"
          >
            <ShoppingCart size={14} />
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: '8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{
            fontSize: '11px', color: t.textSecondary,
            textTransform: 'uppercase', letterSpacing: '0.03em',
          }}>
            {product.category}
          </p>
          <p style={{
            fontSize: '13px', fontWeight: 600, color: t.text,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            lineHeight: 1.3, flex: 1,
          }}>
            {product.name}
          </p>

          {/* Rating */}
          {product.reviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={11} fill={t.primary} color={t.primary} />
              <span style={{ fontSize: '11px', color: t.textSecondary }}>
                {product.rating} ({product.reviews})
              </span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: t.primaryDark }}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span style={{
                fontSize: '11px', color: t.textSecondary,
                textDecoration: 'line-through',
              }}>
                ${product.originalPrice}
              </span>
            )}
          </div>

          {product.stock === 0 && (
            <p style={{ fontSize: '10px', color: '#ef4444', fontWeight: 600 }}>Out of stock</p>
          )}
        </div>
      </div>

      <style>{`
        .add-to-cart-btn { opacity: 0; }
        a:hover .add-to-cart-btn { opacity: 1 !important; }
      `}</style>
    </Link>
  )
}

export default ProductCard

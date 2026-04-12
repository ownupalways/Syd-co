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
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  
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


const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const x = ((e.pageX - left) / width) * 100;
  const y = ((e.pageY - top) / height) * 100;
  setZoomPos({ x, y, show: true });
};
  
  return (
		<div
			className="detail-container"
			style={{
				background: t.background,
				minHeight: "100vh",
				padding: "24px 16px",
			}}>
			<div
				style={{
					maxWidth: "1100px",
					margin: "0 auto",
				}}>
				<button
					onClick={() => navigate(-1)}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "6px",
						background: "none",
						border: "none",
						cursor: "pointer",
						color: t.textSecondary,
						marginBottom: "24px",
						fontSize: "15px",
						fontWeight: 600,
					}}>
					<ArrowLeft size={18} /> Back
				</button>

				<div className="product-grid">
					{/* Images Section */}
					<div className="image-section">
						<div
							className="main-image-wrapper"
							onMouseMove={handleMouseMove}
							onMouseLeave={() =>
								setZoomPos((prev) => ({
									...prev,
									show: false,
								}))
							}
							style={{
								position: "relative",
								cursor: "zoom-in",
								background: isDark
									? "rgba(255,255,255,0.02)"
									: "#f9f9f9",
								borderRadius: "16px",
								overflow: "hidden",
							}}>
							<img
								src={images[activeImg]}
								alt={product.name}
								className="main-image"
								style={{
									width: "100%",
									transition: zoomPos.show
										? "none"
										: "transform 0.3s ease",
									transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
									transform: zoomPos.show
										? "scale(2.5)"
										: "scale(1)",
								}}
							/>
						</div>
						{images.length > 1 && (
							<div className="thumbnail-row">
								{images.map((img, i) => (
									<img
										key={i}
										src={img}
										alt=""
										onClick={() =>
											setActiveImg(i)
										}
										style={{
											border: `2px solid ${i === activeImg ? t.primaryDark : t.border}`,
										}}
										className="thumb-img"
									/>
								))}
							</div>
						)}
					</div>

					{/* Info Section */}
					<div className="info-section">
						<p
							style={{
								color: t.textSecondary,
								fontSize: "13px",
								marginBottom: "8px",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}>
							{product.category}
						</p>
						<h1
							style={{
								color: t.text,
								fontSize:
									"clamp(22px, 4vw, 32px)",
								marginBottom: "12px",
								lineHeight: 1.2,
								fontWeight: 800,
							}}>
							{product.name}
						</h1>

						<div
							className="rating-row"
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
								marginBottom: "16px",
							}}>
							<div
								style={{
									display: "flex",
									gap: "2px",
								}}>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										size={16}
										fill={
											i <
											Math.round(product.rating)
												? t.primary
												: "none"
										}
										color={t.primary}
									/>
								))}
							</div>
							<span
								style={{
									color: t.textSecondary,
									fontSize: "14px",
									fontWeight: 500,
								}}>
								({product.reviews} reviews)
							</span>
						</div>

						<div style={{ marginBottom: "20px" }}>
							<span
								style={{
									fontSize: "32px",
									fontWeight: 900,
									color: t.primaryDark,
								}}>
								${product.price}
							</span>
							{product.originalPrice && (
								<span
									style={{
										fontSize: "18px",
										color: t.textSecondary,
										textDecoration:
											"line-through",
										marginLeft: "10px",
									}}>
									${product.originalPrice}
								</span>
							)}
						</div>

						<p
							style={{
								color: t.textSecondary,
								lineHeight: 1.6,
								marginBottom: "24px",
								fontSize: "15px",
							}}>
							{product.description}
						</p>

						<div className="action-row">
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "12px",
								}}>
								<button
									onClick={() =>
										setQuantity(
											Math.max(1, quantity - 1),
										)
									}
									style={{
										background: t.border,
										border: "none",
										borderRadius: "8px",
										width: "40px",
										height: "40px",
										cursor: "pointer",
										color: t.text,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<Minus size={18} />
								</button>
								<span
									style={{
										color: t.text,
										fontWeight: 700,
										fontSize: "20px",
										minWidth: "32px",
										textAlign: "center",
									}}>
									{quantity}
								</span>
								<button
									onClick={() =>
										setQuantity(
											Math.min(
												product.stock,
												quantity + 1,
											),
										)
									}
									style={{
										background: t.border,
										border: "none",
										borderRadius: "8px",
										width: "40px",
										height: "40px",
										cursor: "pointer",
										color: t.text,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}>
									<Plus size={18} />
								</button>
							</div>
							<span
								style={{
									color: t.textSecondary,
									fontSize: "13px",
									fontWeight: 500,
								}}>
								{product.stock} in stock
							</span>
						</div>

						<button
							disabled={product.stock === 0}
							onClick={() => {
								addItem(product, quantity);
								toast.success("Added to cart!");
							}}
							className="add-button"
							style={{
								background:
									product.stock === 0
										? t.border
										: t.primaryDark,
								color: "#fff",
								cursor:
									product.stock === 0
										? "not-allowed"
										: "pointer",
							}}>
							<ShoppingCart size={20} />
							{product.stock === 0
								? "Out of Stock"
								: "Add to Cart"}
						</button>

						<div className="trust-badges">
							{[
								{
									icon: <Truck size={18} />,
									text: "Free shipping over $50",
								},
								{
									icon: <Shield size={18} />,
									text: "Secure checkout",
								},
							].map((b) => (
								<div
									key={b.text}
									className="badge-item"
									style={{
										color: t.textSecondary,
									}}>
									{b.icon} <span>{b.text}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<style>{`
        .product-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: start;
        }
        .main-image-wrapper {
  width: 100%;
  border: 1px solid ${t.border};
}

.main-image {
  display: block;
}
        .thumbnail-row {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .thumb-img {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .thumb-img:hover { transform: translateY(-2px); }
        .action-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }
        .add-button {
          width: 100%;
          border: none;
          padding: 16px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: opacity 0.2s;
        }
        .add-button:active { transform: scale(0.98); }
        .trust-badges {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid ${t.border}50;
        }
        .badge-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        /* Responsive Adjustments */
        @media (max-width: 900px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .image-section {
            max-width: 600px;
            margin: 0 auto;
            width: 100%;
          }
          .detail-container { padding: 16px !important; }
        }

        @media (max-width: 480px) {
          .rating-row { flex-direction: column; align-items: flex-start !important; }
          .action-row { flex-direction: column; align-items: flex-start; gap: 12px; }
          .thumb-img { width: 60px; height: 60px; }
          .add-button { font-size: 12px; padding: 10px; }
        }
      `}</style>
		</div>
	);
}

export default ProductDetailPage

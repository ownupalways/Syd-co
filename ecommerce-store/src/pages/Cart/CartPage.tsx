import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { useCartStore } from '@store/cartStore'
import toast from 'react-hot-toast'

const CartPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light
  const { items, removeItem, updateQuantity, clearCart, total } = useCartStore()

  if (items.length === 0) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: t.background,
        padding: '24px',
        gap: '16px',
      }}>
        <ShoppingBag size={64} style={{ color: t.border }} />
        <h2 style={{ color: t.text }}>Your cart is empty</h2>
        <p style={{ color: t.textSecondary }}>Add some products to get started</p>
        <Link to="/shop">
          <button style={{
            background: t.primaryDark, color: '#fff',
            border: 'none', padding: '12px 28px',
            borderRadius: '10px', cursor: 'pointer',
            fontSize: '15px', fontWeight: 600,
          }}>
            Browse Products
          </button>
        </Link>
      </div>
    )
  }

  return (
		<div
			style={{
				background: t.background,
				minHeight: "100vh",
				padding: "32px 24px",
			}}>
			<div
				style={{
					maxWidth: "900px",
					margin: "0 auto",
				}}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "24px",
					}}>
					<h1 style={{ color: t.text }}>
						Cart ({items.length} items)
					</h1>
					<button
						onClick={() => {
							clearCart();
							toast.success("Cart cleared");
						}}
						style={{
							color: "red",
							background: "none",
							border: "1px solid red",
							padding: "6px 14px",
							borderRadius: "8px",
							cursor: "pointer",
							fontSize: "13px",
						}}>
						Clear Cart
					</button>
				</div>

				<div
					className="cart-grid"
					style={{
						display: "grid",
						gridTemplateColumns:
							"repeat(auto-fit, minmax(280px, 1fr))",
						gap: "24px",
					}}>
					{/* Items */}
					<div
						className="cart-item"
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "16px",
						}}>
						{items.map(
							({ product, quantity }) => (
								<div
									key={product._id}
									style={{
										display: "flex",
										gap: "16px",
										padding: "16px",
										background:
											t.backgroundSecondary,
										border: `1px solid ${t.border}`,
										borderRadius: "12px",
									}}>
									<img
										src={product.image}
										alt={product.name}
										style={{
											width: "90px",
											height: "90px",
											objectFit: "cover",
											borderRadius: "8px",
										}}
									/>
									<div style={{ flex: 1 }}>
										<h3
											style={{
												color: t.text,
												fontSize: "15px",
												marginBottom: "4px",
											}}>
											{product.name}
										</h3>
										<p
											style={{
												color: t.textSecondary,
												fontSize: "13px",
												marginBottom: "12px",
											}}>
											{product.category}
										</p>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent:
													"space-between",
											}}>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "8px",
												}}>
												<button
													onClick={() =>
														updateQuantity(
															product._id,
															quantity - 1,
														)
													}
													style={{
														background: t.border,
														border: "none",
														borderRadius: "6px",
														width: "28px",
														height: "28px",
														cursor: "pointer",
														color: t.text,
														display: "flex",
														alignItems: "center",
														justifyContent:
															"center",
													}}>
													<Minus size={14} />
												</button>
												<span
													style={{
														color: t.text,
														fontWeight: 700,
														minWidth: "24px",
														textAlign: "center",
													}}>
													{quantity}
												</span>
												<button
													onClick={() =>
														updateQuantity(
															product._id,
															quantity + 1,
														)
													}
													style={{
														background: t.border,
														border: "none",
														borderRadius: "6px",
														width: "28px",
														height: "28px",
														cursor: "pointer",
														color: t.text,
														display: "flex",
														alignItems: "center",
														justifyContent:
															"center",
													}}>
													<Plus size={14} />
												</button>
											</div>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "16px",
												}}>
												<span
													style={{
														color: t.primaryDark,
														fontWeight: 700,
														fontSize: "16px",
													}}>
													$
													{(
														product.price *
														quantity
													).toFixed(2)}
												</span>
												<button
													onClick={() => {
														removeItem(
															product._id,
														);
														toast.success(
															"Item removed",
														);
													}}
													style={{
														background: "none",
														border: "none",
														cursor: "pointer",
														color: "red",
													}}>
													<Trash2 size={18} />
												</button>
											</div>
										</div>
									</div>
								</div>
							),
						)}
					</div>

					{/* Summary */}
					<div
						style={{
							background: t.backgroundSecondary,
							border: `1px solid ${t.border}`,
							borderRadius: "12px",
							padding: "24px",
							height: "fit-content",
							position: "sticky",
							top: "90px",
						}}>
						<h2
							style={{
								color: t.text,
								marginBottom: "20px",
							}}>
							Summary
						</h2>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginBottom: "12px",
							}}>
							<span
								style={{
									color: t.textSecondary,
								}}>
								Subtotal
							</span>
							<span
								style={{
									color: t.text,
									fontWeight: 600,
								}}>
								${total().toFixed(2)}
							</span>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginBottom: "12px",
							}}>
							<span
								style={{
									color: t.textSecondary,
								}}>
								Shipping
							</span>
							<span
								style={{
									color: "green",
									fontWeight: 600,
								}}>
								{total() >= 50 ? "Free" : "$9.99"}
							</span>
						</div>
						<div
							style={{
								borderTop: `1px solid ${t.border}`,
								paddingTop: "12px",
								display: "flex",
								justifyContent: "space-between",
								marginBottom: "24px",
							}}>
							<span
								style={{
									color: t.text,
									fontWeight: 700,
									fontSize: "18px",
								}}>
								Total
							</span>
							<span
								style={{
									color: t.primaryDark,
									fontWeight: 700,
									fontSize: "18px",
								}}>
								$
								{(
									total() +
									(total() >= 50 ? 0 : 9.99)
								).toFixed(2)}
							</span>
						</div>
						<Link
							to="/checkout"
							style={{ textDecoration: "none" }}>
							<button
								style={{
									width: "100%",
									background: t.primaryDark,
									color: "#fff",
									border: "none",
									padding: "14px",
									borderRadius: "10px",
									fontSize: "16px",
									fontWeight: 700,
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "8px",
								}}>
								Checkout <ArrowRight size={18} />
							</button>
						</Link>
					</div>
				</div>
			</div>
			<style>{`
  @media (max-width: 768px) {
    .cart-grid { grid-template-columns: 1fr !important; }
    .cart-item { flex-direction: column; }
  }
`}</style>
		</div>
	);
}

export default CartPage

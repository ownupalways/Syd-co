// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { ArrowRight, ShoppingBag, Shield, Truck, RefreshCw, Star, Sparkles } from 'lucide-react'
// import { useTheme } from '@context/useTheme'
// import { theme } from '@styles/theme'
// import { getProductsApi } from '@api/products'
// import ProductCard from '@components/ProductCard'
// import Banner from '../../assets/Banner.webp'

// const HomePage: React.FC = () => {
//   const { isDark } = useTheme()
//   const t = isDark ? theme.dark : theme.light

//   const { data, isLoading } = useQuery({
//     queryKey: ['products', 'featured'],
//     queryFn: () => getProductsApi({ limit: 8 }),
//   })

//   const products = Array.isArray(data?.data?.data) ? data.data.data : []

//   const features = [
//     { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'On orders over $50' },
//     { icon: <Shield size={24} />, title: 'Secure Payment', desc: '100% protected' },
//     { icon: <RefreshCw size={24} />, title: 'Easy Returns', desc: '30-day policy' },
//     { icon: <Star size={24} />, title: 'Premium Quality', desc: 'Curated for you' },
//   ]

//   const categories = [
//     { label: 'Beauty', emoji: '💄', color: '#FF6EC7' },
//     { label: 'Fashion', emoji: '👗', color: '#E65BA8' },
//     { label: 'Footwear', emoji: '👠', color: '#C41E7C' },
//     { label: 'Electronics', emoji: '📱', color: '#9B30FF' },
//     { label: 'Sports', emoji: '🏋️', color: '#FF2D78' },
//     { label: 'Home & Living', emoji: '🏠', color: '#BF00FF' },
//   ]

//   return (
// 		<div
// 			style={{
// 				background: t.background,
// 				minHeight: "100vh",
// 			}}>
// 			{/* ── HERO ── */}
// 			{/* ── HERO ── */}
// 			<section
// 				style={{
// 					position: "relative",
// 					overflow: "hidden",
// 					background: isDark
// 						? `linear-gradient(135deg, ${t.backgroundSecondary} 0%, ${t.background} 100%)`
// 						: `linear-gradient(135deg, #fff0f7 0%, #ffe4f2 60%, #ffd6ec 100%)`,
// 					minHeight: "clamp(320px, 45vh, 480px)",
// 					display: "flex",
// 					alignItems: "center",
// 				}}>
// 				{/* Decorative blob */}
// 				<div
// 					style={{
// 						position: "absolute",
// 						top: "-60px",
// 						right: "-60px",
// 						width: "300px",
// 						height: "300px",
// 						borderRadius: "50%",
// 						background: isDark
// 							? "radial-gradient(circle, rgba(230,91,168,0.1), transparent 70%)"
// 							: "radial-gradient(circle, rgba(230,91,168,0.18), transparent 70%)",
// 						pointerEvents: "none",
// 					}}
// 				/>

// 				<div
// 					style={{
// 						maxWidth: "1200px",
// 						margin: "0 auto",
// 						padding: "0 clamp(20px, 4vw, 48px)",
// 						width: "100%",
// 						display: "grid",
// 						gridTemplateColumns: "420px 1fr",
// 						gap: "clamp(24px, 4vw, 48px)",
// 						alignItems: "center",
// 					}}
// 					className="hero-grid">
// 					{/* LEFT — Image */}
// 					<div
// 						style={{
// 							display: "flex",
// 							justifyContent: "center",
// 							alignItems: "flex-end",
// 							overflow: "hidden",
// 							height: "clamp(300px, 42vh, 460px)",
// 							flexShrink: 0,
// 						}}>
// 						<img
// 							src={Banner}
// 							alt="Syd & Co"
// 							style={{
// 								height: "100%",
// 								width: "100%",
// 								objectFit: "contain",
// 								objectPosition: "bottom center",
// 								filter: isDark
// 									? "drop-shadow(0 12px 40px rgba(230,91,168,0.25))"
// 									: "drop-shadow(0 12px 40px rgba(230,91,168,0.2))",
// 							}}
// 						/>
// 					</div>

// 					{/* RIGHT — Text */}
// 					<div
// 						style={{
// 							padding: "clamp(24px, 4vw, 40px) 0",
// 						}}>
// 						{/* Badge */}
// 						<div
// 							style={{
// 								display: "inline-flex",
// 								alignItems: "center",
// 								gap: "7px",
// 								padding: "5px 14px",
// 								borderRadius: "20px",
// 								background: isDark
// 									? "rgba(230,91,168,0.15)"
// 									: "rgba(230,91,168,0.1)",
// 								border: `1px solid ${t.primaryDark}40`,
// 								marginBottom: "16px",
// 							}}>
// 							<Sparkles
// 								size={13}
// 								color={t.primaryDark}
// 							/>
// 							<span
// 								style={{
// 									fontSize: "12px",
// 									color: t.primaryDark,
// 									fontWeight: 700,
// 									letterSpacing: "0.03em",
// 								}}>
// 								New Arrivals Just Dropped ✨
// 							</span>
// 						</div>

// 						{/* Heading */}
// 						<h1
// 							style={{
// 								fontSize:
// 									"clamp(1.7rem, 3.5vw, 3rem)",
// 								fontWeight: 900,
// 								lineHeight: 1.12,
// 								letterSpacing: "-0.025em",
// 								color: t.text,
// 								marginBottom: "14px",
// 							}}>
// 							Look Good,{" "}
// 							<span
// 								style={{
// 									background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
// 									WebkitBackgroundClip: "text",
// 									WebkitTextFillColor:
// 										"transparent",
// 									backgroundClip: "text",
// 								}}>
// 								Feel Amazing
// 							</span>
// 						</h1>

// 						{/* Subtext */}
// 						<p
// 							style={{
// 								fontSize:
// 									"clamp(13px, 1.5vw, 15px)",
// 								color: t.textSecondary,
// 								lineHeight: 1.7,
// 								marginBottom: "24px",
// 								maxWidth: "380px",
// 							}}>
// 							Beauty & fashion curated just for
// 							you. Unbeatable prices, fast
// 							delivery, and products you'll
// 							absolutely love.
// 						</p>

// 						{/* Buttons */}
// 						<div
// 							style={{
// 								display: "flex",
// 								gap: "10px",
// 								flexWrap: "wrap",
// 								marginBottom: "24px",
// 							}}>
// 							<Link to="/shop">
// 								<button
// 									style={{
// 										padding: "11px 26px",
// 										borderRadius: "50px",
// 										border: "none",
// 										background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
// 										color: "#fff",
// 										fontSize: "14px",
// 										fontWeight: 700,
// 										cursor: "pointer",
// 										display: "inline-flex",
// 										alignItems: "center",
// 										gap: "7px",
// 										boxShadow: `0 6px 20px ${t.shadow}`,
// 										transition: "all 0.2s",
// 									}}
// 									onMouseEnter={(e) =>
// 										(e.currentTarget.style.transform =
// 											"translateY(-2px)")
// 									}
// 									onMouseLeave={(e) =>
// 										(e.currentTarget.style.transform =
// 											"translateY(0)")
// 									}>
// 									Shop Now{" "}
// 									<ArrowRight size={15} />
// 								</button>
// 							</Link>
// 							<Link to="/about">
// 								<button
// 									style={{
// 										padding: "11px 26px",
// 										borderRadius: "50px",
// 										border: `2px solid ${t.primaryDark}`,
// 										background: "transparent",
// 										color: t.primaryDark,
// 										fontSize: "14px",
// 										fontWeight: 700,
// 										cursor: "pointer",
// 										transition: "all 0.2s",
// 									}}
// 									onMouseEnter={(e) => {
// 										e.currentTarget.style.background =
// 											t.primaryDark;
// 										e.currentTarget.style.color =
// 											"#fff";
// 									}}
// 									onMouseLeave={(e) => {
// 										e.currentTarget.style.background =
// 											"transparent";
// 										e.currentTarget.style.color =
// 											t.primaryDark;
// 									}}>
// 									Our Story
// 								</button>
// 							</Link>
// 						</div>

// 						{/* Trust Badges */}
// 						<div
// 							style={{
// 								display: "flex",
// 								gap: "6px",
// 								flexWrap: "wrap",
// 							}}>
// 							{[
// 								{
// 									label: "10K+ Customers",
// 									icon: "👑",
// 								},
// 								{
// 									label: "4.9★ Rating",
// 									icon: "⭐",
// 								},
// 								{
// 									label: "Free Returns",
// 									icon: "🔄",
// 								},
// 							].map((badge) => (
// 								<div
// 									key={badge.label}
// 									style={{
// 										display: "inline-flex",
// 										alignItems: "center",
// 										gap: "5px",
// 										padding: "5px 12px",
// 										borderRadius: "20px",
// 										fontSize: "12px",
// 										background: isDark
// 											? "rgba(255,255,255,0.06)"
// 											: "rgba(255,255,255,0.7)",
// 										border: `1px solid ${t.border}`,
// 										color: t.textSecondary,
// 										fontWeight: 600,
// 									}}>
// 									<span
// 										style={{ fontSize: "11px" }}>
// 										{badge.icon}
// 									</span>
// 									{badge.label}
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				</div>

// 				<style>{`
//     @media (max-width: 768px) {
//       .hero-grid {
//         grid-template-columns: 1fr !important;
//         text-align: center;
//       }
//       .hero-grid > div:first-child {
//         height: 260px !important;
//         order: -1;
//       }
//       .hero-grid > div:last-child {
//         padding: 0 0 24px !important;
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//       }
//     }
//   `}</style>
// 			</section>

// 			{/* ── FEATURES ── */}
// 			<section
// 				style={{
// 					padding: "60px 24px",
// 					background: t.backgroundSecondary,
// 				}}>
// 				<div
// 					style={{
// 						maxWidth: "1200px",
// 						margin: "0 auto",
// 						display: "grid",
// 						gridTemplateColumns:
// 							"repeat(auto-fit, minmax(200px, 1fr))",
// 						gap: "20px",
// 					}}>
// 					{features.map((f) => (
// 						<div
// 							key={f.title}
// 							style={{
// 								display: "flex",
// 								alignItems: "center",
// 								gap: "16px",
// 								padding: "20px 24px",
// 								background: t.background,
// 								borderRadius: "16px",
// 								border: `1px solid ${t.border}`,
// 								transition: "all 0.2s",
// 							}}
// 							onMouseEnter={(e) =>
// 								(e.currentTarget.style.transform =
// 									"translateY(-4px)")
// 							}
// 							onMouseLeave={(e) =>
// 								(e.currentTarget.style.transform =
// 									"translateY(0)")
// 							}>
// 							<div
// 								style={{
// 									width: "48px",
// 									height: "48px",
// 									borderRadius: "12px",
// 									background: isDark
// 										? "rgba(230,91,168,0.15)"
// 										: "rgba(255,182,217,0.2)",
// 									display: "flex",
// 									alignItems: "center",
// 									justifyContent: "center",
// 									color: t.primaryDark,
// 									flexShrink: 0,
// 								}}>
// 								{f.icon}
// 							</div>
// 							<div>
// 								<p
// 									style={{
// 										fontWeight: 700,
// 										color: t.text,
// 										fontSize: "14px",
// 										marginBottom: "2px",
// 									}}>
// 									{f.title}
// 								</p>
// 								<p
// 									style={{
// 										color: t.textSecondary,
// 										fontSize: "13px",
// 									}}>
// 									{f.desc}
// 								</p>
// 							</div>
// 						</div>
// 					))}
// 				</div>
// 			</section>

// 			{/* ── CATEGORIES ── */}
// 			<section style={{ padding: "60px 24px" }}>
// 				<div
// 					style={{
// 						maxWidth: "1200px",
// 						margin: "0 auto",
// 					}}>
// 					<div
// 						style={{
// 							display: "flex",
// 							justifyContent: "space-between",
// 							alignItems: "center",
// 							marginBottom: "32px",
// 							flexWrap: "wrap",
// 							gap: "12px",
// 						}}>
// 						<h2
// 							style={{
// 								fontSize:
// 									"clamp(22px, 3vw, 30px)",
// 								fontWeight: 800,
// 								color: t.text,
// 							}}>
// 							Shop by Category
// 						</h2>
// 					</div>
// 					<div
// 						style={{
// 							display: "grid",
// 							gridTemplateColumns:
// 								"repeat(auto-fill, minmax(150px, 1fr))",
// 							gap: "16px",
// 						}}>
// 						{categories.map(
// 							({ label, emoji, color }) => (
// 								<Link
// 									key={label}
// 									to={`/shop?category=${label}`}
// 									style={{
// 										textDecoration: "none",
// 									}}>
// 									<div
// 										style={{
// 											padding: "24px 16px",
// 											borderRadius: "16px",
// 											border: `1px solid ${t.border}`,
// 											background:
// 												t.backgroundSecondary,
// 											textAlign: "center",
// 											cursor: "pointer",
// 											transition: "all 0.2s",
// 										}}
// 										onMouseEnter={(e) => {
// 											e.currentTarget.style.borderColor =
// 												color;
// 											e.currentTarget.style.transform =
// 												"translateY(-4px)";
// 											e.currentTarget.style.boxShadow = `0 8px 25px ${color}30`;
// 										}}
// 										onMouseLeave={(e) => {
// 											e.currentTarget.style.borderColor =
// 												t.border;
// 											e.currentTarget.style.transform =
// 												"translateY(0)";
// 											e.currentTarget.style.boxShadow =
// 												"none";
// 										}}>
// 										<div
// 											style={{
// 												fontSize: "32px",
// 												marginBottom: "10px",
// 											}}>
// 											{emoji}
// 										</div>
// 										<p
// 											style={{
// 												fontWeight: 600,
// 												color: t.text,
// 												fontSize: "13px",
// 											}}>
// 											{label}
// 										</p>
// 									</div>
// 								</Link>
// 							),
// 						)}
// 					</div>
// 				</div>
// 			</section>

// 			{/* ── FEATURED PRODUCTS ── */}
// 			<section style={{ padding: "0 24px 80px" }}>
// 				<div
// 					style={{
// 						maxWidth: "1200px",
// 						margin: "0 auto",
// 					}}>
// 					<div
// 						style={{
// 							display: "flex",
// 							justifyContent: "space-between",
// 							alignItems: "center",
// 							marginBottom: "32px",
// 							flexWrap: "wrap",
// 							gap: "12px",
// 						}}>
// 						<div>
// 							<h2
// 								style={{
// 									fontSize:
// 										"clamp(22px, 3vw, 30px)",
// 									fontWeight: 800,
// 									color: t.text,
// 									marginBottom: "4px",
// 								}}>
// 								Featured Products
// 							</h2>
// 							<p
// 								style={{
// 									color: t.textSecondary,
// 									fontSize: "14px",
// 								}}>
// 								Hand-picked just for you
// 							</p>
// 						</div>
// 						<Link
// 							to="/shop"
// 							style={{
// 								color: t.primaryDark,
// 								textDecoration: "none",
// 								display: "flex",
// 								alignItems: "center",
// 								gap: "4px",
// 								fontWeight: 700,
// 								fontSize: "14px",
// 								padding: "8px 16px",
// 								borderRadius: "10px",
// 								border: `1px solid ${t.border}`,
// 								transition: "all 0.2s",
// 							}}>
// 							View All <ArrowRight size={16} />
// 						</Link>
// 					</div>

// 					{isLoading ? (
// 						<div
// 							style={{
// 								display: "grid",
// 								gridTemplateColumns:
// 									"repeat(auto-fill, minmax(160px, 1fr))",
// 								gap: "12px",
// 							}}>
// 							{[...Array(4)].map((_, i) => (
// 								<div
// 									key={i}
// 									style={{
// 										height: "320px",
// 										borderRadius: "16px",
// 										background:
// 											t.backgroundSecondary,
// 										border: `1px solid ${t.border}`,
// 										animation:
// 											"pulse 1.5s ease-in-out infinite",
// 									}}
// 								/>
// 							))}
// 						</div>
// 					) : products.length === 0 ? (
// 						<div
// 							style={{
// 								textAlign: "center",
// 								padding: "80px 24px",
// 								color: t.textSecondary,
// 							}}>
// 							<ShoppingBag
// 								size={56}
// 								style={{
// 									marginBottom: "16px",
// 									opacity: 0.3,
// 								}}
// 							/>
// 							<h3
// 								style={{
// 									color: t.text,
// 									marginBottom: "8px",
// 								}}>
// 								No products yet
// 							</h3>
// 							<p style={{ fontSize: "14px" }}>
// 								Check back soon for amazing
// 								products!
// 							</p>
// 						</div>
// 					) : (
// 						<div
// 							style={{
// 								display: "grid",
// 								gridTemplateColumns:
// 									"repeat(auto-fill, minmax(240px, 1fr))",
// 								gap: "24px",
// 							}}>
// 							{products.map((product) => (
// 								<ProductCard
// 									key={product._id}
// 									product={product}
// 								/>
// 							))}
// 						</div>
// 					)}
// 				</div>
// 			</section>

// 			{/* ── PROMO BANNER ── */}
// 			<section style={{ padding: "0 24px 80px" }}>
// 				<div
// 					style={{
// 						maxWidth: "1200px",
// 						margin: "0 auto",
// 						background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
// 						borderRadius: "24px",
// 						padding:
// 							"clamp(32px, 5vw, 60px) clamp(24px, 5vw, 60px)",
// 						display: "flex",
// 						alignItems: "center",
// 						justifyContent: "space-between",
// 						flexWrap: "wrap",
// 						gap: "24px",
// 						boxShadow: `0 20px 60px ${t.shadow}`,
// 					}}>
// 					<div>
// 						<p
// 							style={{
// 								color: "rgba(255,255,255,0.8)",
// 								fontSize: "14px",
// 								marginBottom: "8px",
// 								fontWeight: 600,
// 							}}>
// 							LIMITED TIME OFFER 🔥
// 						</p>
// 						<h2
// 							style={{
// 								color: "#fff",
// 								fontSize:
// 									"clamp(22px, 4vw, 36px)",
// 								fontWeight: 900,
// 								marginBottom: "8px",
// 							}}>
// 							Get 20% off your first order
// 						</h2>
// 						<p
// 							style={{
// 								color: "rgba(255,255,255,0.85)",
// 								fontSize: "15px",
// 							}}>
// 							Use code <strong>SYD20</strong> at
// 							checkout
// 						</p>
// 					</div>
// 					<Link to="/shop">
// 						<button
// 							style={{
// 								padding: "14px 32px",
// 								borderRadius: "50px",
// 								border:
// 									"2px solid rgba(255,255,255,0.6)",
// 								background:
// 									"rgba(255,255,255,0.15)",
// 								color: "#fff",
// 								fontSize: "16px",
// 								fontWeight: 700,
// 								cursor: "pointer",
// 								backdropFilter: "blur(10px)",
// 								transition: "all 0.2s",
// 								whiteSpace: "nowrap",
// 							}}
// 							onMouseEnter={(e) =>
// 								(e.currentTarget.style.background =
// 									"rgba(255,255,255,0.25)")
// 							}
// 							onMouseLeave={(e) =>
// 								(e.currentTarget.style.background =
// 									"rgba(255,255,255,0.15)")
// 							}>
// 							Shop Now{" "}
// 							<ArrowRight
// 								size={18}
// 								style={{
// 									display: "inline",
// 									verticalAlign: "middle",
// 								}}
// 							/>
// 						</button>
// 					</Link>
// 				</div>
// 			</section>

// 			{/* Animations */}
// 			<style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-12px); }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
//         }
//         @media (max-width: 768px) {
//           .hero-grid {
//             grid-template-columns: 1fr !important;
//             text-align: center;
//           }
//           .hero-grid > div:last-child {
//             display: none !important;
//           }
//         }
//       `}</style>
// 		</div>
// 	);
// }

// export default HomePage


import React from 'react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import CategoriesSection from './CategoriesSection'
import FeaturedProductsSection from './FeaturedProductsSection'
import PromoBannerSection from './PromoBannerSection'

const HomePage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light

  return (
    <div style={{ background: t.background, minHeight: '100vh' }}>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <PromoBannerSection />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default HomePage

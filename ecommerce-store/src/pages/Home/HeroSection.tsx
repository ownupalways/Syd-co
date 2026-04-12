import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star } from 'lucide-react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import Banner from '../../assets/Banner.png'

const HeroSection: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light

  return (
		<section
			style={{
				position: "relative",
				width: "100%",
				// Height reduced by 40% (Approx 300px - 450px range)
				height: "clamp(300px, 35vh, 420px)",
				display: "flex",
				alignItems: "center",
				overflow: "hidden",
			}}>
			{/* 1. THE BACKGROUND IMAGE */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					zIndex: 0,
				}}>
				<img
					src={Banner}
					alt="Syd & Co Banner"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						objectPosition: "left center", // Human subject anchored to left
					}}
				/>
				{/* Transparent Overlay: Darker on the right to make text pop */}
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: isDark
							? "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.8) 100%)"
							: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.7) 100%)",
					}}
				/>
			</div>

			{/* 2. ABSOLUTELY TRANSPARENT CONTENT LAYER */}
			<div
				style={{
					position: "relative",
					zIndex: 10,
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "0 5%",
					width: "100%",
					display: "flex",
					justifyContent: "flex-end", // Aligned to the right
				}}>
				<div
					style={{
						maxWidth: "460px",
						// No background or border - completely transparent
						background: "transparent",
						textAlign: "right", // Aligning text to the right for a "neat" look
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						position: "relative",
						width: "100%",
						top: "0", // No vertical shift, content starts at the top of the section
					}}>
					{/* Minimal Badge - Now Centered at the Top */}
					<div
						style={{
							position: "absolute",
							top: "10px", // Distance from the top of the hero
							left: "20%",
							transform: "translateX(-50%)", // Centers it exactly
							zIndex: 20, // Ensures it stays above the background image
							display: "flex",
							// alignItems: "center",
							justifyContent: "center",
							gap: "7px",
							padding: "6px 18px",
							borderRadius: "20px",
							background: isDark
								? "rgba(230,91,168,0.2)"
								: "rgba(255, 255, 255, 0.8)", // Slight opacity for a clean look
							backdropFilter: "blur(4px)", // Makes it look "glassy"
							border: `1px solid ${t.primaryDark}40`,
							whiteSpace: "nowrap", // Prevents text from wrapping
						}}>
						<Sparkles
							size={14}
							color={t.primaryDark}
						/>
						<span
							style={{
								fontSize: "12px",
								color: t.primaryDark,
								fontWeight: 800,
								letterSpacing: "0.05em",
								textTransform: "uppercase",
							}}>
							New Arrivals Just Dropped ✨
						</span>
					</div>

					<h1
						style={{
							fontSize:
								"clamp(1.6rem, 3.2vw, 2.4rem)",
							fontWeight: 900,
							lineHeight: 1.1,
							color: t.text,
							marginBottom: "10px",
							letterSpacing: "-0.03em",
						}}>
						Look Good <br />
						<span
							style={{ color: t.primaryDark }}>
							Feel Amazing
						</span>
					</h1>

					<p
						style={{
							fontSize: "clamp(13px, 1vw, 15px)",
							color: t.textSecondary,
							lineHeight: 1.4,
							marginBottom: "20px",
							fontWeight: 500,
						}}>
						High-quality fashion essentials
						delivered <br />
						straight to your door with love.
					</p>

					{/* Action Row */}
					<div
						style={{
							display: "flex",
							gap: "10px",
							marginBottom: "24px",
						}}>
						<Link to="/shop">
							<button
								style={{
									padding: "10px 24px",
									borderRadius: "8px",
									border: "none",
									background: t.primaryDark,
									color: "#fff",
									fontWeight: 700,
									fontSize: "14px",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									gap: "8px",
									boxShadow:
										"0 4px 15px rgba(0,0,0,0.1)",
								}}>
								Shop Collection{" "}
								<ArrowRight size={16} />
							</button>
						</Link>
					</div>

					{/* Feature Row - Compact & Transparent */}
					<div
						style={{
							display: "flex",
							gap: "15px",
							paddingTop: "16px",
							borderTop: `1px solid ${t.border}40`,
						}}>
						{[
							{
								icon: <Truck size={14} />,
								label: "Fast Delivery",
							},
							{
								icon: <ShieldCheck size={14} />,
								label: "Secure",
							},
							{
								icon: <Star size={14} />,
								label: "4.9 Rated",
							},
						].map((feature, i) => (
              <div
 									key={i}
 									style={{
 										display: "inline-flex",
 										alignItems: "center",
 										gap: "5px",
 										padding: "5px 12px",
 										borderRadius: "20px",
 										fontSize: "12px",
 										background: isDark
 											? "rgba(255,255,255,0.06)"
 											: "rgba(255,255,255,0.7)",
 										border: `1px solid ${t.border}`,
 										color: t.textSecondary,
 										fontWeight: 600,
 									}}>
 									<span
 										style={{ fontSize: "11px" }}>
 										{feature.icon}
 									</span>
 									{feature.label}
 								</div>
						))}
					</div>
				</div>
			</div>

			<style>{`
        @media (max-width: 768px) {
          section { height: 350px !important; }
          .banner-content-wrapper { justify-content: center !important; }
          div[style*="alignItems: flex-end"] { 
            alignItems: center !important; 
            text-align: center !important;
          }
          h1 br { display: none; }
        }
      `}</style>
		</section>
	);
}

export default HeroSection

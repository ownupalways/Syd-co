import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star } from 'lucide-react'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import Banner from '../../assets/Banner.webp'

const HeroSection: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light

  return (
		<section
			className="hero-container"
			style={{
				position: "relative",
				width: "100%",
				// Responsive height: slim on desktop, slightly taller on mobile to accommodate stacked text
				height: "clamp(320px, 40vh, 420px)",
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
					loading="eager"
					fetchPriority="high"
					decoding="async"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						objectPosition: "left center",
					}}
				/>
				{/* Overlay: Adapts from side-gradient on desktop to subtle full-cover on mobile */}
				<div className="hero-overlay" />
			</div>

			{/* 2. ABSOLUTELY CENTERED BADGE (Parent Level) */}
			<div className="hero-badge">
				<Sparkles
					size={14}
					color={t.primaryDark}
				/>
				<span>New Arrivals Just Dropped ✨</span>
			</div>

			{/* 3. CONTENT LAYER */}
			<div
				className="content-wrapper"
				style={{
					position: "relative",
					zIndex: 10,
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "0 5%",
					width: "100%",
					display: "flex",
					justifyContent: "flex-end",
				}}>
				<div
					className="text-content"
					style={{
						maxWidth: "480px",
						background: "transparent",
						textAlign: "right",
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
						width: "100%",
					}}>
					<h1
						style={{
							fontSize:
								"clamp(1.75rem, 4vw, 2.6rem)",
							fontWeight: 900,
							lineHeight: 1.1,
							color: t.text,
							marginBottom: "12px",
							letterSpacing: "-0.03em",
						}}>
						Look Good, <br />
						<span
							style={{ color: t.primaryDark }}>
							Feel Amazing
						</span>
					</h1>

					<p
						style={{
							fontSize:
								"clamp(14px, 1.2vw, 16px)",
							color: isDark
								? t.textSecondary
								: t.text,
							lineHeight: 1.5,
							marginBottom: "24px",
							fontWeight: 600,
							maxWidth: "400px",
							textShadow: isDark
								? "none"
								: "0px 1px 2px rgba(255,255,255,0.8)",
						}}>
						High-quality fashion essentials
						delivered straight to your door with
						love.
					</p>

					<div
						style={{
							display: "flex",
							gap: "10px",
							marginBottom: "30px",
						}}>
						<Link to="/shop">
							<button
								style={{
									padding: "12px 28px",
									borderRadius: "10px",
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

					{/* Feature Row - Now wraps nicely on small screens */}
					<div className="feature-row">
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
								className="feature-pill"
								style={{
									background: isDark
										? "rgba(255,255,255,0.06)"
										: "rgba(255,255,255,0.7)",
									border: `1px solid ${t.border}`,
									color: t.textSecondary,
								}}>
								{feature.icon}
								{feature.label}
							</div>
						))}
					</div>
				</div>
			</div>

			<style>{`
        /* Dynamic Overlay */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: ${
						isDark
							? "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.8) 100%)"
							: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.7) 100%)"
					};
        }

        /* Centered Badge Logic */
        .hero-badge {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 18px;
          border-radius: 20px;
          background: ${isDark ? "rgba(230,91,168,0.2)" : "rgba(255, 255, 255, 0.85)"};
          backdrop-filter: blur(4px);
          border: 1px solid ${t.primaryDark}40;
          white-space: nowrap;
        }
        .hero-badge span {
          font-size: 11px;
          color: ${t.primaryDark};
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Features Styling */
        .feature-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid ${t.border}40;
        }
        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Tablet & Mobile Adjustments */
        @media (max-width: 768px) {
          .hero-container { height: 450px !important; }
          .hero-overlay {
             background: ${
								isDark
									? "rgba(0,0,0,0.5)"
									: "rgba(255,255,255,0.4)"
							} !important;
          }
          .content-wrapper { justify-content: center !important; }
          .text-content { 
            align-items: center !important; 
            text-align: center !important;
            max-width: 100% !important;
          }
          .feature-row { justify-content: center !important; }
          h1 br { display: none; }
        }

        @media (max-width: 480px) {
          .hero-badge { top: 15px; width: 90%; justify-content: center; }
          .hero-badge span { font-size: 10px; }
          .feature-pill { font-size: 10px; padding: 4px 10px; }
        }
      `}</style>
		</section>
	);
}

export default HeroSection;

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@context/useTheme'
import { theme } from '@styles/theme'
import { ArrowRight, Heart, Star, ShoppingBag, Users, Award, Sparkles } from 'lucide-react'
import Banner from '../../assets/Banner.png'
import sydLogo from '../../assets/syd-logo.png'

const AboutPage: React.FC = () => {
  const { isDark } = useTheme()
  const t = isDark ? theme.dark : theme.light

  const stats = [
    { icon: <Users size={22} />, value: '10K+', label: 'Happy Customers' },
    { icon: <ShoppingBag size={22} />, value: '500+', label: 'Products Curated' },
    { icon: <Star size={22} />, value: '4.9★', label: 'Average Rating' },
    { icon: <Award size={22} />, value: '2+', label: 'Years of Excellence' },
  ]

  const values = [
    {
      icon: '💄',
      title: 'Curated with Love',
      desc: 'Every product in our store is hand-picked personally. If it does not meet our standards, it does not make the cut.',
    },
    {
      icon: '✨',
      title: 'Authenticity First',
      desc: 'We only carry products we genuinely believe in. No fakes, no compromises — just real quality for real queens.',
    },
    {
      icon: '🤝',
      title: 'Community Driven',
      desc: 'Syd & Co is built by the community, for the community. Your feedback shapes everything we do.',
    },
    {
      icon: '🚀',
      title: 'Always Evolving',
      desc: 'We stay ahead of trends so you never have to. New drops, new looks, new reasons to feel amazing.',
    },
  ]

  return (
		<div style={{ background: t.background }}>
			<section
				style={{
					position: "relative",

					width: "100%",

					// Consistent ribbon height: 40% reduction from standard

					height: "clamp(320px, 38vh, 450px)",

					display: "flex",

					alignItems: "center",

					overflow: "hidden",

					background: t.backgroundSecondary,
				}}>
				{/* 1. TOP CENTERED BADGE (Parent Level) */}

				<div
					style={{
						position: "absolute",

						top: "24px",

						left: "50%",

						transform: "translateX(-50%)",

						zIndex: 30,

						display: "flex",

						alignItems: "center",

						gap: "8px",

						padding: "6px 18px",

						borderRadius: "100px",

						background: isDark
							? "rgba(230,91,168,0.2)"
							: "rgba(255, 255, 255, 0.9)",

						backdropFilter: "blur(8px)",

						border: `1px solid ${t.primaryDark}40`,

						whiteSpace: "nowrap",

						boxShadow:
							"0 4px 12px rgba(0,0,0,0.05)",
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

							letterSpacing: "0.06em",

							textTransform: "uppercase",
						}}>
						Our Story
					</span>
				</div>

				{/* 2. BACKGROUND IMAGE LAYER */}

				<div
					style={{
						position: "absolute",
						inset: 0,
						zIndex: 0,
					}}>
					<img
						src={Banner}
						alt="Syd & Co Story"
						style={{
							width: "100%",

							height: "100%",

							objectFit: "cover",

							objectPosition: "left center", // Keeps the primary focus on the left
						}}
					/>

					{/* Gradient Overlay for Text Legibility */}

					<div
						style={{
							position: "absolute",

							inset: 0,

							background: isDark
								? "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.9) 100%)"
								: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.85) 100%)",
						}}
					/>
				</div>

				{/* 3. ABSOLUTELY TRANSPARENT CONTENT (RIGHT-ALIGNED) */}

				<div
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
						style={{
							maxWidth: "500px",

							textAlign: "right",

							display: "flex",

							flexDirection: "column",

							alignItems: "flex-end",
						}}>
						<h1
							style={{
								fontSize:
									"clamp(1.8rem, 3.5vw, 2.8rem)",

								fontWeight: 900,

								lineHeight: 1.1,

								color: t.text,

								marginBottom: "14px",

								letterSpacing: "-0.03em",
							}}>
							More Than a Store — <br />
							<span
								style={{
									background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
									WebkitBackgroundClip: "text",
									backgroundClip: "text",
									WebkitTextFillColor:
										"transparent",
									color: "transparent", // THIS IS THE MISSING KEY
									display: "inline-block", // Ensures the gradient box is correctly sized
								}}>
								It's a Vibe
							</span>
						</h1>

						<p
							style={{
								fontSize:
									"clamp(13px, 1.1vw, 16px)",

								color: t.textSecondary,

								lineHeight: 1.6,

								marginBottom: "28px",

								fontWeight: 500,
							}}>
							Syd & Co was born from a simple
							idea: every woman deserves to feel
							celebrated. We've grown into a
							community of queens who refuse to
							settle for anything less than
							amazing.
						</p>

						{/* Action Row */}

						<div
							style={{
								display: "flex",
								gap: "12px",
							}}>
							<Link to="/shop">
								<button
									style={{
										padding: "12px 28px",

										borderRadius: "50px",

										border: "none",

										background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,

										color: "#fff",

										fontWeight: 700,

										fontSize: "14px",

										cursor: "pointer",

										display: "flex",

										alignItems: "center",

										gap: "8px",

										boxShadow: `0 8px 20px ${t.shadow}`,
									}}>
									Shop Collection{" "}
									<ArrowRight size={16} />
								</button>
							</Link>

							<Link to="/contact">
								<button
									style={{
										padding: "12px 28px",

										borderRadius: "50px",

										border: `2px solid ${t.primaryDark}`,

										background: "transparent",

										color: t.primaryDark,

										fontWeight: 700,

										fontSize: "14px",

										cursor: "pointer",
									}}>
									Get in Touch
								</button>
							</Link>
						</div>
					</div>
				</div>

				{/* Mobile Overrides */}

				<style>{`

        @media (max-width: 768px) {

          section { height: 450px !important; }

          div[style*="justifyContent: flex-end"] { justify-content: center !important; }

          div[style*="alignItems: flex-end"] { 

            alignItems: center !important; 

            text-align: center !important;

          }

          h1 br { display: none; }

        }

      `}</style>
			</section>

			{/* Stats */}
			<section
				style={{
					padding: "60px 24px",
					background: t.backgroundSecondary,
				}}>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
						display: "grid",
						gridTemplateColumns:
							"repeat(auto-fit, minmax(180px, 1fr))",
						gap: "24px",
					}}>
					{stats.map((s) => (
						<div
							key={s.label}
							style={{
								textAlign: "center",
								padding: "32px 24px",
								background: t.background,
								borderRadius: "16px",
								border: `1px solid ${t.border}`,
								transition: "transform 0.2s",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.transform =
									"translateY(-4px)")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.transform =
									"translateY(0)")
							}>
							<div
								style={{
									width: "52px",
									height: "52px",
									borderRadius: "14px",
									background: isDark
										? "rgba(230,91,168,0.15)"
										: "rgba(255,182,217,0.2)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto 16px",
									color: t.primaryDark,
								}}>
								{s.icon}
							</div>
							<p
								style={{
									fontSize:
										"clamp(28px, 4vw, 36px)",
									fontWeight: 900,
									color: t.primaryDark,
									marginBottom: "4px",
								}}>
								{s.value}
							</p>
							<p
								style={{
									fontSize: "14px",
									color: t.textSecondary,
									fontWeight: 600,
								}}>
								{s.label}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Brand Story */}
			<section style={{ padding: "80px 24px" }}>
				<div
					style={{
						maxWidth: "800px",
						margin: "0 auto",
						textAlign: "center",
					}}>
					<img
						src={sydLogo}
						alt="Syd & Co"
						style={{
							height: "60px",
							objectFit: "contain",
							marginBottom: "32px",
						}}
					/>
					<h2
						style={{
							fontSize: "clamp(24px, 4vw, 36px)",
							fontWeight: 900,
							color: t.text,
							marginBottom: "24px",
							lineHeight: 1.2,
						}}>
						Built by a Girl Who Just Wanted to
						Look Good
					</h2>
					<p
						style={{
							fontSize: "16px",
							color: t.textSecondary,
							lineHeight: 1.9,
							marginBottom: "24px",
						}}>
						Hey, I'm Syd. I started this brand
						because I was tired of spending hours
						searching for beauty and fashion
						products that actually worked —
						products that were worth the price,
						looked amazing, and made me feel like
						the queen I am. So I decided to build
						the store I always wished existed.
					</p>
					<p
						style={{
							fontSize: "16px",
							color: t.textSecondary,
							lineHeight: 1.9,
							marginBottom: "32px",
						}}>
						Every item in Syd & Co has been
						tested, tried, and approved by me
						personally. I built this for women
						like me — women who want quality,
						style, and confidence without breaking
						the bank. Welcome to the family. 💕
					</p>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "8px",
							padding: "12px 24px",
							borderRadius: "20px",
							background: isDark
								? "rgba(230,91,168,0.1)"
								: "rgba(255,182,217,0.15)",
							border: `1px solid ${t.border}`,
						}}>
						<Heart
							size={16}
							fill={t.primaryDark}
							color={t.primaryDark}
						/>
						<span
							style={{
								fontSize: "15px",
								color: t.primaryDark,
								fontWeight: 700,
							}}>
							— Syd, Founder of Syd & Co
						</span>
					</div>
				</div>
			</section>

			{/* Values */}
			<section style={{ padding: "0 24px 80px" }}>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
					}}>
					<div
						style={{
							textAlign: "center",
							marginBottom: "48px",
						}}>
						<h2
							style={{
								fontSize:
									"clamp(24px, 4vw, 32px)",
								fontWeight: 900,
								color: t.text,
								marginBottom: "12px",
							}}>
							What We Stand For
						</h2>
						<p
							style={{
								color: t.textSecondary,
								fontSize: "16px",
								maxWidth: "500px",
								margin: "0 auto",
							}}>
							These aren't just words on a page —
							they're the principles we live by
							every day.
						</p>
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fit, minmax(240px, 1fr))",
							gap: "24px",
						}}>
						{values.map((v) => (
							<div
								key={v.title}
								style={{
									padding: "32px 24px",
									background:
										t.backgroundSecondary,
									borderRadius: "16px",
									border: `1px solid ${t.border}`,
									transition: "all 0.2s",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderColor =
										t.primaryDark;
									e.currentTarget.style.transform =
										"translateY(-4px)";
									e.currentTarget.style.boxShadow = `0 12px 30px ${t.shadow}`;
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderColor =
										t.border;
									e.currentTarget.style.transform =
										"translateY(0)";
									e.currentTarget.style.boxShadow =
										"none";
								}}>
								<div
									style={{
										fontSize: "36px",
										marginBottom: "16px",
									}}>
									{v.icon}
								</div>
								<h3
									style={{
										fontSize: "18px",
										fontWeight: 800,
										color: t.text,
										marginBottom: "10px",
									}}>
									{v.title}
								</h3>
								<p
									style={{
										fontSize: "14px",
										color: t.textSecondary,
										lineHeight: 1.7,
									}}>
									{v.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section style={{ padding: "0 24px 80px" }}>
				<div
					style={{
						maxWidth: "1200px",
						margin: "0 auto",
						background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
						borderRadius: "24px",
						padding:
							"clamp(40px, 6vw, 70px) clamp(24px, 5vw, 60px)",
						textAlign: "center",
						boxShadow: `0 20px 60px ${t.shadow}`,
					}}>
					<h2
						style={{
							fontSize: "clamp(22px, 4vw, 36px)",
							fontWeight: 900,
							color: "#fff",
							marginBottom: "12px",
						}}>
						Ready to Glow Up? ✨
					</h2>
					<p
						style={{
							color: "rgba(255,255,255,0.85)",
							fontSize: "16px",
							marginBottom: "28px",
						}}>
						Join thousands of queens who have
						already made Syd & Co their go-to
						destination.
					</p>
					<div
						style={{
							display: "flex",
							gap: "12px",
							justifyContent: "center",
							flexWrap: "wrap",
						}}>
						<Link to="/shop">
							<button
								style={{
									padding: "14px 32px",
									borderRadius: "50px",
									border:
										"2px solid rgba(255,255,255,0.6)",
									background:
										"rgba(255,255,255,0.15)",
									color: "#fff",
									fontSize: "16px",
									fontWeight: 700,
									cursor: "pointer",
									backdropFilter: "blur(10px)",
									transition: "all 0.2s",
								}}
								onMouseEnter={(e) =>
									(e.currentTarget.style.background =
										"rgba(255,255,255,0.25)")
								}
								onMouseLeave={(e) =>
									(e.currentTarget.style.background =
										"rgba(255,255,255,0.15)")
								}>
								Shop Now{" "}
								<ArrowRight
									size={16}
									style={{
										display: "inline",
										verticalAlign: "middle",
									}}
								/>
							</button>
						</Link>
						<Link to="/contact">
							<button
								style={{
									padding: "14px 32px",
									borderRadius: "50px",
									border:
										"2px solid rgba(255,255,255,0.4)",
									background: "transparent",
									color: "rgba(255,255,255,0.9)",
									fontSize: "16px",
									fontWeight: 700,
									cursor: "pointer",
									transition: "all 0.2s",
								}}>
								Contact Us
							</button>
						</Link>
					</div>
				</div>
			</section>

			<style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @media (max-width: 768px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .about-hero-grid > div:last-child {
            display: none !important;
          }
        }
 
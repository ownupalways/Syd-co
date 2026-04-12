import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";

const PromoBannerSection: React.FC = () => {
	const { isDark } = useTheme();
	const t = isDark ? theme.dark : theme.light;

	return (
		<section style={{ padding: "0 24px 80px" }}>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
					background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
					borderRadius: "24px",
					padding:
						"clamp(32px, 5vw, 60px) clamp(24px, 5vw, 60px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: "24px",
					boxShadow: `0 20px 60px ${t.shadow}`,
				}}>
				<div>
					<p
						style={{
							color: "rgba(255,255,255,0.8)",
							fontSize: "14px",
							marginBottom: "8px",
							fontWeight: 600,
						}}>
						LIMITED TIME OFFER 🔥
					</p>
					<h2
						style={{
							color: "#fff",
							fontSize: "clamp(22px, 4vw, 36px)",
							fontWeight: 900,
							marginBottom: "8px",
						}}>
						Get 20% off your first order
					</h2>
					<p
						style={{
							color: "rgba(255,255,255,0.85)",
							fontSize: "15px",
						}}>
						Use code <strong>SYD20</strong> at
						checkout
					</p>
				</div>
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
							whiteSpace: "nowrap",
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
							size={18}
							style={{
								display: "inline",
								verticalAlign: "middle",
							}}
						/>
					</button>
				</Link>
			</div>
		</section>
	);
};

export default PromoBannerSection;

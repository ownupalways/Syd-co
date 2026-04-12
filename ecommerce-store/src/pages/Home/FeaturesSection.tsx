import React from "react";
import {
	Truck,
	Shield,
	RefreshCw,
	Star,
} from "lucide-react";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";

const FeaturesSection: React.FC = () => {
	const { isDark } = useTheme();
	const t = isDark ? theme.dark : theme.light;

	const features = [
		{
			icon: <Truck size={24} />,
			title: "Free Shipping",
			desc: "On orders over $50",
		},
		{
			icon: <Shield size={24} />,
			title: "Secure Payment",
			desc: "100% protected",
		},
		{
			icon: <RefreshCw size={24} />,
			title: "Easy Returns",
			desc: "30-day policy",
		},
		{
			icon: <Star size={24} />,
			title: "Premium Quality",
			desc: "Curated for you",
		},
	];

	return (
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
						"repeat(auto-fit, minmax(200px, 1fr))",
					gap: "20px",
				}}>
				{features.map((f) => (
					<div
						key={f.title}
						style={{
							display: "flex",
							alignItems: "center",
							gap: "16px",
							padding: "20px 24px",
							background: t.background,
							borderRadius: "16px",
							border: `1px solid ${t.border}`,
							transition: "all 0.2s",
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
								width: "48px",
								height: "48px",
								borderRadius: "12px",
								background: isDark
									? "rgba(230,91,168,0.15)"
									: "rgba(255,182,217,0.2)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: t.primaryDark,
								flexShrink: 0,
							}}>
							{f.icon}
						</div>
						<div>
							<p
								style={{
									fontWeight: 700,
									color: t.text,
									fontSize: "14px",
									marginBottom: "2px",
								}}>
								{f.title}
							</p>
							<p
								style={{
									color: t.textSecondary,
									fontSize: "13px",
								}}>
								{f.desc}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default FeaturesSection;

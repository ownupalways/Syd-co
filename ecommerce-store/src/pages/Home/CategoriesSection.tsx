import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";

const categories = [
	{
		label: "Beauty",
		emoji: "💄",
		color: "#FF6EC7",
	},
	{
		label: "Fashion",
		emoji: "👗",
		color: "#E65BA8",
	},
	{
		label: "Footwear",
		emoji: "👠",
		color: "#C41E7C",
	},
	{
		label: "Electronics",
		emoji: "📱",
		color: "#9B30FF",
	},
	{
		label: "Sports",
		emoji: "🏋️",
		color: "#FF2D78",
	},
	{
		label: "Home & Living",
		emoji: "🏠",
		color: "#BF00FF",
	},
];

const CategoriesSection: React.FC = () => {
	const { isDark } = useTheme();
	const t = isDark ? theme.dark : theme.light;

	return (
		<section style={{ padding: "60px 24px" }}>
			<div
				style={{
					maxWidth: "1200px",
					margin: "0 auto",
				}}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "32px",
						flexWrap: "wrap",
						gap: "12px",
					}}>
					<h2
						style={{
							fontSize: "clamp(22px, 3vw, 30px)",
							fontWeight: 800,
							color: t.text,
						}}>
						Shop by Category
					</h2>
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns:
							"repeat(auto-fill, minmax(150px, 1fr))",
						gap: "16px",
					}}>
					{categories.map(
						({ label, emoji, color }) => (
							<Link
								key={label}
								to={`/shop?category=${label}`}
								style={{
									textDecoration: "none",
								}}>
								<div
									style={{
										padding: "24px 16px",
										borderRadius: "16px",
										border: `1px solid ${t.border}`,
										background:
											t.backgroundSecondary,
										textAlign: "center",
										cursor: "pointer",
										transition: "all 0.2s",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor =
											color;
										e.currentTarget.style.transform =
											"translateY(-4px)";
										e.currentTarget.style.boxShadow = `0 8px 25px ${color}30`;
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
											fontSize: "32px",
											marginBottom: "10px",
										}}>
										{emoji}
									</div>
									<p
										style={{
											fontWeight: 600,
											color: t.text,
											fontSize: "13px",
										}}>
										{label}
									</p>
								</div>
							</Link>
						),
					)}
				</div>
			</div>
		</section>
	);
};

export default CategoriesSection;

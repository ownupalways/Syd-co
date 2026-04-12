import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
	ArrowRight,
	ShoppingBag,
} from "lucide-react";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";
import { getProductsApi } from "@api/products";
import ProductCard from "@components/ProductCard";

const FeaturedProductsSection: React.FC = () => {
	const { isDark } = useTheme();
	const t = isDark ? theme.dark : theme.light;

	const { data, isLoading } = useQuery({
		queryKey: ["products", "featured"],
		queryFn: () => getProductsApi({ limit: 8 }),
	});

	const products = Array.isArray(data?.data?.data)
		? data.data.data
		: [];

	return (
		<section style={{ padding: "0 24px 80px" }}>
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
					<div>
						<h2
							style={{
								fontSize:
									"clamp(22px, 3vw, 30px)",
								fontWeight: 800,
								color: t.text,
								marginBottom: "4px",
							}}>
							Featured Products
						</h2>
						<p
							style={{
								color: t.textSecondary,
								fontSize: "14px",
							}}>
							Hand-picked just for you
						</p>
					</div>
					<Link
						to="/shop"
						style={{
							color: t.primaryDark,
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							gap: "4px",
							fontWeight: 700,
							fontSize: "14px",
							padding: "8px 16px",
							borderRadius: "10px",
							border: `1px solid ${t.border}`,
							transition: "all 0.2s",
						}}>
						View All <ArrowRight size={16} />
					</Link>
				</div>

				{isLoading ? (
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fill, minmax(160px, 1fr))",
							gap: "12px",
						}}>
						{[...Array(8)].map((_, i) => (
							<div
								key={i}
								style={{
									height: "280px",
									borderRadius: "16px",
									background:
										t.backgroundSecondary,
									border: `1px solid ${t.border}`,
									animation:
										"pulse 1.5s ease-in-out infinite",
								}}
							/>
						))}
					</div>
				) : products.length === 0 ? (
					<div
						style={{
							textAlign: "center",
							padding: "80px 24px",
							color: t.textSecondary,
						}}>
						<ShoppingBag
							size={56}
							style={{
								marginBottom: "16px",
								opacity: 0.3,
							}}
						/>
						<h3
							style={{
								color: t.text,
								marginBottom: "8px",
							}}>
							No products yet
						</h3>
						<p style={{ fontSize: "14px" }}>
							Check back soon for amazing
							products!
						</p>
					</div>
				) : (
					<div
						style={{
							display: "grid",
							gridTemplateColumns:
								"repeat(auto-fill, minmax(160px, 1fr))",
							gap: "12px",
						}}>
						{products.map((product) => (
							<ProductCard
								key={product._id}
								product={product}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default FeaturedProductsSection;

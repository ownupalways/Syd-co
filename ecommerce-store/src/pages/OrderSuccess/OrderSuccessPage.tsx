import React from "react";
import {
	Link,
	useParams,
} from "react-router-dom";
import {
	CheckCircle,
	ShoppingBag,
	Home,
} from "lucide-react";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";

const OrderSuccessPage: React.FC = () => {
	const { isDark } = useTheme();
	const t = isDark ? theme.dark : theme.light;
	const { id } = useParams();

	return (
		<div
			style={{
				minHeight: "80vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: t.background,
				padding: "24px",
			}}>
			<div
				style={{
					textAlign: "center",
					maxWidth: "480px",
					width: "100%",
					background: t.backgroundSecondary,
					borderRadius: "24px",
					padding: "48px 32px",
					border: `1px solid ${t.border}`,
				}}>
				<div
					style={{
						width: "80px",
						height: "80px",
						borderRadius: "50%",
						background: "rgba(0,229,160,0.15)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						margin: "0 auto 24px",
					}}>
					<CheckCircle
						size={48}
						color="#00e5a0"
					/>
				</div>

				<h1
					style={{
						fontSize: "28px",
						fontWeight: 800,
						color: t.text,
						marginBottom: "12px",
					}}>
					Order Confirmed! 🎉
				</h1>
				<p
					style={{
						color: t.textSecondary,
						fontSize: "15px",
						lineHeight: 1.6,
						marginBottom: "8px",
					}}>
					Thank you for your purchase! Your order
					has been placed successfully.
				</p>
				{id && (
					<p
						style={{
							color: t.textSecondary,
							fontSize: "13px",
							marginBottom: "32px",
						}}>
						Order ID:{" "}
						<span
							style={{
								color: t.primaryDark,
								fontWeight: 600,
							}}>
							#{id.slice(-8).toUpperCase()}
						</span>
					</p>
				)}

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "12px",
					}}>
					<Link
						to="/shop"
						style={{ textDecoration: "none" }}>
						<button
							style={{
								width: "100%",
								padding: "14px",
								borderRadius: "12px",
								border: "none",
								background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
								color: "#fff",
								fontSize: "15px",
								fontWeight: 700,
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
							}}>
							<ShoppingBag size={18} /> Continue
							Shopping
						</button>
					</Link>
					<Link
						to="/"
						style={{ textDecoration: "none" }}>
						<button
							style={{
								width: "100%",
								padding: "14px",
								borderRadius: "12px",
								border: `1px solid ${t.border}`,
								background: "transparent",
								color: t.text,
								fontSize: "15px",
								fontWeight: 600,
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
							}}>
							<Home size={18} /> Back to Home
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default OrderSuccessPage;

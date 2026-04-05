import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
} from "lucide-react";
import { loginApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const setAuth = useAuthStore((s) => s.setAuth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (
		e: React.FormEvent,
	) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await loginApi({
				email,
				password,
			});
			const { token, admin } = res.data.data!;
			if (
				admin.role !== "super-admin" &&
				admin.role !== "sub-admin"
			) {
				toast.error("Access denied");
				return;
			}
			setAuth(admin, token);
			toast.success(`Welcome, ${admin.name}!`);
			navigate("/");
		} catch (err: unknown) {
			const error = err as {
				response?: {
					data?: { message?: string };
				};
			};
			toast.error(
				error.response?.data?.message ||
					"Login failed",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "var(--bg)",
				padding: "24px",
				position: "relative",
				overflow: "hidden",
			}}>
			{/* Background orbs */}
			<div
				style={{
					position: "absolute",
					top: "-200px",
					left: "-200px",
					width: "600px",
					height: "600px",
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(255,45,120,0.15), transparent 70%)",
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "-200px",
					right: "-200px",
					width: "600px",
					height: "600px",
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(191,0,255,0.15), transparent 70%)",
					pointerEvents: "none",
				}}
			/>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				style={{
					width: "100%",
					maxWidth: "420px",
					background: "var(--bg-card)",
					borderRadius: "24px",
					border: "1px solid var(--glass-border)",
					padding: "48px 40px",
					position: "relative",
				}}>
				{/* Logo */}
				<div
					style={{
						textAlign: "center",
						marginBottom: "36px",
					}}>
					<motion.img
						src="/src/assets/syd-logo.png"
						alt="Syd & Co"
						animate={{ scale: [1, 1.05, 1] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							repeatDelay: 2,
						}}
						style={{
							height: "80px",
							objectFit: "contain",
							margin: "0 auto 16px",
							display: "block",
							filter:
								"drop-shadow(0 0 20px rgba(255,45,120,0.5))",
							borderRadius: "12px",
						}}
					/>
					<h1
						className="gradient-text"
						style={{
							fontSize: "26px",
							fontWeight: 800,
							marginBottom: "6px",
						}}>
						Admin Panel
					</h1>
					<p
						style={{
							color: "var(--text-secondary)",
							fontSize: "14px",
						}}>
						Sign in to manage your store
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "16px",
					}}>
					<div style={{ position: "relative" }}>
						<Mail
							size={16}
							style={{
								position: "absolute",
								left: "14px",
								top: "50%",
								transform: "translateY(-50%)",
								color: "var(--text-secondary)",
								pointerEvents: "none",
							}}
						/>
						<input
							type="email"
							placeholder="Admin email"
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
							required
							style={{
								width: "100%",
								padding: "13px 13px 13px 44px",
								borderRadius: "12px",
								border: "1px solid var(--border)",
								background: "var(--bg-hover)",
								color: "var(--text)",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
							onFocus={(e) =>
								(e.target.style.borderColor =
									"var(--pink)")
							}
							onBlur={(e) =>
								(e.target.style.borderColor =
									"var(--border)")
							}
						/>
					</div>

					<div style={{ position: "relative" }}>
						<Lock
							size={16}
							style={{
								position: "absolute",
								left: "14px",
								top: "50%",
								transform: "translateY(-50%)",
								color: "var(--text-secondary)",
								pointerEvents: "none",
							}}
						/>
						<input
							type={
								showPass ? "text" : "password"
							}
							placeholder="Password"
							value={password}
							onChange={(e) =>
								setPassword(e.target.value)
							}
							required
							style={{
								width: "100%",
								padding: "13px 44px 13px 44px",
								borderRadius: "12px",
								border: "1px solid var(--border)",
								background: "var(--bg-hover)",
								color: "var(--text)",
								fontSize: "14px",
								outline: "none",
								transition: "border-color 0.2s",
							}}
							onFocus={(e) =>
								(e.target.style.borderColor =
									"var(--pink)")
							}
							onBlur={(e) =>
								(e.target.style.borderColor =
									"var(--border)")
							}
						/>
						<button
							type="button"
							onClick={() =>
								setShowPass(!showPass)
							}
							style={{
								position: "absolute",
								right: "14px",
								top: "50%",
								transform: "translateY(-50%)",
								background: "none",
								border: "none",
								cursor: "pointer",
								color: "var(--text-secondary)",
							}}>
							{showPass ? (
								<EyeOff size={16} />
							) : (
								<Eye size={16} />
							)}
						</button>
					</div>

					<motion.button
						type="submit"
						disabled={loading}
						whileTap={{ scale: 0.98 }}
						className="gradient-btn glow"
						style={{
							padding: "14px",
							fontSize: "15px",
							fontWeight: 700,
							borderRadius: "12px",
							marginTop: "8px",
							opacity: loading ? 0.7 : 1,
						}}>
						{loading
							? "Signing in..."
							: "Sign In"}
					</motion.button>
				</form>

				<p
					style={{
						textAlign: "center",
						marginTop: "24px",
						fontSize: "13px",
						color: "var(--text-secondary)",
					}}>
					New admin?{" "}
					<a
						href="/register"
						style={{
							color: "var(--pink)",
							fontWeight: 600,
							textDecoration: "none",
						}}>
						Request access
					</a>
				</p>
			</motion.div>
		</div>
	);
};

export default LoginPage;

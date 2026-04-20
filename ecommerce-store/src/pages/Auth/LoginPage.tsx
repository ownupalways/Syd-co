import React, { useState } from "react";
import {
	Link,
	useNavigate,
} from "react-router-dom";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";
import { loginUser } from "../../services/authService";
import { useAuthStore } from "@store/authStore";
import NotRegisteredModal from "./components/NotRegisteredModal";
import ForgotPasswordLink from "./components/ForgotPasswordLink";
import sydLogo from "../../assets/syd-logo.webp";

// ← Removed: import { User, LoginResponse, ApiError } from '@typings/index';
// ApiError is defined locally below — that's all this file needs.

interface ApiError {
	response?: {
		status: number;
		data?: { message?: string };
	};
}

const LoginPage: React.FC = () => {
	const { isDark } = useTheme();
	const t = isDark ? theme.dark : theme.light;
	const navigate = useNavigate();
	const setAuth = useAuthStore((s) => s.setAuth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [loading, setLoading] = useState(false);
	const [
		showNotRegistered,
		setShowNotRegistered,
	] = useState(false);

	const handleSubmit = async (
		e: React.FormEvent,
	) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await loginUser({
				email,
				password,
			});
			setAuth(res.data.user); // ← setAuth takes 1 arg (user only) ✓
			toast.success(
				`Welcome back, ${res.data.user.name}! 🎉`,
			);
			navigate("/");
		} catch (err: unknown) {
			const error = err as ApiError;
			const status = error.response?.status;
			if (status === 404)
				setShowNotRegistered(true);
			else if (status === 401)
				toast.error("Incorrect password.");
			else
				toast.error(
					error.response?.data?.message ||
						"Login failed.",
				);
		} finally {
			setLoading(false);
		}
	};

	const inputStyle: React.CSSProperties = {
		width: "100%",
		padding: "12px 12px 12px 44px",
		borderRadius: "10px",
		border: `1px solid ${t.border}`,
		background: t.background,
		color: t.text,
		fontSize: "15px",
		outline: "none",
	};

	return (
		<div
			onClick={() => navigate(-1)}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 200,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: "16px",
				background: "rgba(0,0,0,0.55)",
				backdropFilter: "blur(8px)",
			}}>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					width: "100%",
					maxWidth: "420px",
					background: t.backgroundSecondary,
					borderRadius: "20px",
					border: `1px solid ${t.border}`,
					padding: "clamp(24px, 5vw, 40px)",
					position: "relative",
					boxShadow: `0 25px 60px rgba(0,0,0,0.3)`,
				}}>
				<button
					onClick={() => navigate(-1)}
					style={{
						position: "absolute",
						top: "16px",
						right: "16px",
						background: "none",
						border: "none",
						color: t.textSecondary,
						cursor: "pointer",
					}}>
					<X size={20} />
				</button>

				<div
					style={{
						textAlign: "center",
						marginBottom: "24px",
					}}>
					<img
						src={sydLogo}
						alt="Logo"
						style={{
							height: "52px",
							filter:
								"drop-shadow(0 4px 12px rgba(230,91,168,0.3))",
						}}
					/>
					<h1
						style={{
							color: t.text,
							marginTop: "16px",
							fontSize: "24px",
							fontWeight: 800,
						}}>
						Welcome Back 👋
					</h1>
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
							size={18}
							style={{
								position: "absolute",
								left: "14px",
								top: "50%",
								transform: "translateY(-50%)",
								color: t.textSecondary,
							}}
						/>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) =>
								setEmail(e.target.value)
							}
							required
							style={inputStyle}
						/>
					</div>

					<div style={{ position: "relative" }}>
						<Lock
							size={18}
							style={{
								position: "absolute",
								left: "14px",
								top: "50%",
								transform: "translateY(-50%)",
								color: t.textSecondary,
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
							style={inputStyle}
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
								color: t.textSecondary,
								cursor: "pointer",
							}}>
							{showPass ? (
								<EyeOff size={18} />
							) : (
								<Eye size={18} />
							)}
						</button>
					</div>

					<ForgotPasswordLink email={email} />

					<button
						type="submit"
						disabled={loading}
						style={{
							background: `linear-gradient(135deg, ${t.primaryDark}, ${t.primary})`,
							color: "#fff",
							border: "none",
							padding: "14px",
							borderRadius: "12px",
							fontWeight: 700,
							cursor: loading
								? "not-allowed"
								: "pointer",
							opacity: loading ? 0.7 : 1,
						}}>
						{loading
							? "Signing in..."
							: "Sign In"}
					</button>
				</form>

				<p
					style={{
						textAlign: "center",
						marginTop: "20px",
						color: t.textSecondary,
						fontSize: "14px",
					}}>
					Don't have an account?{" "}
					<Link
						to="/register"
						replace
						style={{
							color: t.primaryDark,
							fontWeight: 700,
							textDecoration: "none",
						}}>
						Register free
					</Link>
				</p>
			</div>

			{showNotRegistered && (
				<NotRegisteredModal
					email={email}
					onClose={() =>
						setShowNotRegistered(false)
					}
				/>
			)}
		</div>
	);
};

export default LoginPage;

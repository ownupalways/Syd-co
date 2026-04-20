import React, { useState } from "react";
import toast from "react-hot-toast";
// Fixed path: Up 3 levels to reach src/
import { forgotPassword } from "../../../services/authService";
import { useTheme } from "@context/useTheme";
import { theme } from "@styles/theme";

interface Props {
	email: string;
}

interface AuthError {
	response?: {
		data?: {
			message?: string;
		};
	};
}

const ForgotPasswordLink: React.FC<Props> = ({
	email,
}) => {
	const { isDark } = useTheme();
	const t = isDark ? theme.dark : theme.light;
	const [loading, setLoading] = useState(false);

	const handleRequest = async () => {
		if (!email) {
			toast.error(
				"Please enter your email address first.",
			);
			return;
		}

		setLoading(true);
		try {
			const res = await forgotPassword({ email });
			if (res.success) {
				toast.success(
					"Reset link sent to your email! 📧",
				);
			}
		} catch (err: unknown) {
			const error = err as AuthError;
			toast.error(
				error.response?.data?.message ||
					"Could not send reset link. Try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				textAlign: "right",
				marginTop: "-8px",
			}}>
			<button
				type="button"
				onClick={handleRequest}
				disabled={loading}
				style={{
					background: "none",
					border: "none",
					color: t.primaryDark,
					fontSize: "13px",
					fontWeight: 700,
					cursor: loading
						? "not-allowed"
						: "pointer",
					padding: "4px 0",
					opacity: loading ? 0.6 : 1,
					transition: "opacity 0.2s",
				}}>
				{loading
					? "Sending..."
					: "Forgot Password?"}
			</button>
		</div>
	);
};

export default ForgotPasswordLink;

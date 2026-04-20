import api from "../api/axios";
import {
	ForgotPasswordInput,
	GenericAuthResponse,
} from "../types/index";


// 1. Define Types to prevent 'undefined' errors in your components
export interface LoginInput {
	email: string;
	password: string;
}

export interface UserResponse {
	success: boolean;
	message: string;
	data: {
		user: {
			id: string;
			name: string;
			email: string;
			role: "user" | "admin";
		};
	};
}

/**
 * Sends login credentials to the backend.
 * The 'token' cookie is handled automatically by the browser.
 */
export const loginUser = async (
	credentials: LoginInput,
): Promise<UserResponse> => {
	const response = await api.post<UserResponse>(
		"/auth/login",
		credentials,
	);
	return response.data;
};

/**
 * Fetches the current logged-in user's profile.
 * Automatically sends the HttpOnly cookie.
 */
export const fetchCurrentUser =
	async (): Promise<UserResponse> => {
		const response =
			await api.get<UserResponse>("/auth/me");
		return response.data;
	};

	/**
 * Sends a password reset link to the user's email.
 */
export const forgotPassword = async (
	data: ForgotPasswordInput,
): Promise<GenericAuthResponse> => {
	const response =
		await api.post<GenericAuthResponse>(
			"/auth/forgot-password",
			data,
		);
	return response.data;
};
/**
 * Clears the session on the backend.
 */
export const logoutUser = async (): Promise<{
	success: boolean;
	message: string;
}> => {
	const response = await api.post("/auth/logout");
	return response.data;
};

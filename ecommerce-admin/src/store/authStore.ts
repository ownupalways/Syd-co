import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "../types";

interface AuthState {
	admin: AdminUser | null;
	token: string | null;
	isAuthenticated: boolean;
	setAuth: (
		admin: AdminUser,
		token: string,
	) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			admin: null,
			token: null,
			isAuthenticated: false,
			setAuth: (admin, token) => {
				localStorage.setItem(
					"admin-token",
					token,
				);
				set({
					admin,
					token,
					isAuthenticated: true,
				});
			},
			logout: () => {
				localStorage.removeItem("admin-token");
				set({
					admin: null,
					token: null,
					isAuthenticated: false,
				});
			},
		}),
		{ name: "admin-auth" },
	),
);

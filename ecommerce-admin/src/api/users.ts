import api from "./axios";
import type { ApiResponse, User } from "../types";

export const getUsersApi = (
	params?: Record<string, unknown>,
) =>
	api.get<
		ApiResponse<{
			data: User[];
			pagination: unknown;
		}>
	>("/users", { params });

export const toggleUserStatusApi = (id: string) =>
	api.put<ApiResponse<User>>(
		`/users/${id}/toggle-status`,
	);

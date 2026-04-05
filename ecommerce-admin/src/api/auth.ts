import api from "./axios";
import type {
	ApiResponse,
	AdminUser,
} from "../types";

interface AuthData {
	token: string;
	admin: AdminUser;
}

export const loginApi = (data: {
	email: string;
	password: string;
}) =>
	api.post<ApiResponse<AuthData>>(
		"/admin/auth/login",
		data,
	);

export const getMeApi = () =>
	api.get<ApiResponse<AdminUser>>(
		"/admin/auth/me",
	);

export const getSubAdminsApi = (
	status?: string,
) =>
	api.get<ApiResponse<AdminUser[]>>(
		"/admin/auth/sub-admins",
		{ params: { status } },
	);

export const reviewSubAdminApi = (
	id: string,
	data: {
		action: "approve" | "reject" | "suspend";
		reason?: string;
		permissions?: string[];
	},
) =>
	api.put<ApiResponse<AdminUser>>(
		`/admin/auth/sub-admins/${id}/review`,
		data,
	);

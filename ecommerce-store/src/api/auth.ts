import api from "./axios";
import type {
	ApiResponse,
	User,
} from "@typings/index";

interface AuthData {
	token: string;
	user: User;
}

export const registerApi = (data: {
	name: string;
	email: string;
	password: string;
	phone?: string;
}) =>
	api.post<ApiResponse<AuthData>>(
		"/auth/register",
		data,
	);

export const loginApi = (data: {
	email: string;
	password: string;
}) =>
	api.post<ApiResponse<AuthData>>(
		"/auth/login",
		data,
	);

	export const saveAddressApi = (data: {
		fullName: string;
		phone: string;
		address: string;
		city: string;
		state: string;
		zipCode: string;
		country: string;
	}) => api.put("/auth/address", data);

	export const getMeApi = () =>
		api.get<ApiResponse<User>>("/auth/me");



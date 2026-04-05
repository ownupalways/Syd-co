import api from "./axios";
import type {
	ApiResponse,
	Product,
} from "../types";

export const getProductsApi = (
	params?: Record<string, unknown>,
) =>
	api.get<{
		success: boolean;
		message: string;
		data: Product[];
		pagination: {
			total: number;
			pages: number;
			page: number;
			limit: number;
		};
	}>("/products", { params });
	
export const createProductApi = (
	data: Record<string, unknown>,
) =>
	api.post<ApiResponse<Product>>(
		"/products",
		data,
	);

export const updateProductApi = (
	id: string,
	data: Partial<Product>,
) =>
	api.put<ApiResponse<Product>>(
		`/products/${id}`,
		data,
	);

export const deleteProductApi = (id: string) =>
	api.delete<ApiResponse<null>>(
		`/products/${id}`,
	);

export const uploadImageApi = (file: File) => {
	const form = new FormData();
	form.append("image", file);
	return api.post<ApiResponse<{ url: string }>>(
		"/upload/image",
		form,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);
};

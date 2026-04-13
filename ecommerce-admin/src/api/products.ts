import api from "./axios";
import type {
	ApiResponse,
	Product,
	ProductPayload, // 1. Import the new payload
} from "../types";

// 2. Define the Pagination structure to keep the GET call clean
export interface ProductsResponse {
	success: boolean;
	message: string;
	data: Product[];
	pagination: {
		total: number;
		pages: number;
		page: number;
		limit: number;
	};
}

export const getProductsApi = (
	params?: Record<string, unknown>,
) =>
	api.get<ProductsResponse>("/products", {
		params,
	});

export const createProductApi = (
	data: ProductPayload, // 3. Use specific payload
) =>
	api.post<ApiResponse<Product>>(
		"/products",
		data,
	);

export const updateProductApi = (
	id: string,
	data: ProductPayload, // 4. Use specific payload
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

import api from "./axios";
import type {
	ApiResponse,
	PaginatedProducts,
	Product,
	ProductFilters,
} from "@typings/index";

export const getProductsApi = (
	filters?: ProductFilters,
) =>
	api.get<
		ApiResponse<Product[]> & {
			pagination: PaginatedProducts["pagination"];
		}
	>("/products", { params: filters });

export const getProductByIdApi = (id: string) =>
	api.get<ApiResponse<Product>>(
		`/products/${id}`,
	);

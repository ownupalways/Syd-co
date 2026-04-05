import api from "./axios";
import type {
	ApiResponse,
	PendingAction,
} from "../types";

interface PaginatedActions {
	data: PendingAction[];
	pagination: {
		total: number;
		pages: number;
		page: number;
		limit: number;
	};
}

export const getPendingActionsApi = (
	params?: Record<string, unknown>,
) =>
	api.get<ApiResponse<PaginatedActions>>(
		"/admin/pending",
		{ params },
	);

export const reviewPendingActionApi = (
	id: string,
	data: {
		action: "approve" | "reject";
		note?: string;
	},
) =>
	api.put<ApiResponse<null>>(
		`/admin/pending/${id}/review`,
		data,
	);

export const getMyActionsApi = () =>
	api.get<ApiResponse<PendingAction[]>>(
		"/admin/pending/mine",
	);

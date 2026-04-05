import api from "./axios";
import type {
	ApiResponse,
	AuditLog,
} from "../types";

interface PaginatedLogs {
	data: AuditLog[];
	pagination: {
		total: number;
		pages: number;
		page: number;
		limit: number;
	};
}

export const getAuditLogsApi = (
	params?: Record<string, unknown>,
) =>
	api.get<ApiResponse<PaginatedLogs>>(
		"/admin/audit",
		{ params },
	);

export const getMyLogsApi = () =>
	api.get<ApiResponse<AuditLog[]>>(
		"/admin/audit/mine",
	);

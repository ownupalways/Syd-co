export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    status: number;
    data?: T;
    error?: string;
}

export interface ApiError {
    status: number;
    message: string;
    code?: string;
    details?: unknown;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

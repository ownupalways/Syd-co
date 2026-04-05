import { Response } from "express";
import { ApiResponse } from "@appTypes/api";

export const sendResponse = <T>(
	res: Response,
	statusCode: number,
	message: string,
	data?: T,
	success = true,
) => {
	const response: ApiResponse<T> = {
		success,
		message,
		status: statusCode,
		...(data && { data }),
	};

	res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
	res: Response,
	message: string,
	data?: T,
	statusCode = 200,
) => {
	sendResponse(
		res,
		statusCode,
		message,
		data,
		true,
	);
};

export const sendError = (
	res: Response,
	message: string,
	statusCode = 500,
) => {
	sendResponse(
		res,
		statusCode,
		message,
		undefined,
		false,
	);
};

export const sendPaginatedResponse = <T>(
	res: Response,
	data: T[],
	page: number,
	limit: number,
	total: number,
	message = "Data retrieved successfully",
) => {
	const pages = Math.ceil(total / limit);

	res.status(200).json({
		success: true,
		message,
		data,
		pagination: {
			page,
			limit,
			total,
			pages,
		},
	});
};

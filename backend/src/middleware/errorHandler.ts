import {
    Request,
    Response,
    NextFunction,
} from "express";
import { logger } from "@utils/logger";

interface AppError {
    status?: number;
    statusCode?: number;
    message?: string;
    stack?: string;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    logger.error(`[${status}] ${message}`, {
        path: req.path,
        method: req.method,
        stack: err.stack,
    });

    res.status(status).json({
        success: false,
        status,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

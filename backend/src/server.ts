import express, {
	Express,
	Request,
	Response,
} from "express";
import { createServer } from 'http';
import { initSocket } from '@utils/socketManager';
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config, connectDatabase } from "@config";
import {
	errorHandler,
	notFoundHandler,
	requestLogger,
} from "@middleware";
import { logger } from "@utils/logger";
import authRoutes from '@routes/auth';
import productRoutes from '@routes/products';
import uploadRoutes from '@routes/upload';



import adminAuthRoutes from '@routes/admin/auth';

import pendingActionsRoutes from '@routes/admin/pendingActions';

import auditLogsRoutes from '@routes/admin/auditLogs';
import ordersRoutes from '@routes/orders';


const app: Express = express();

// ========================
// Middleware Setup
// ========================

// Security Middleware
app.use(helmet());

// CORS Middleware
app.use(
	cors({
		origin: config.cors.origin,
		credentials: config.cors.credentials,
	}),
);

// Rate Limiting
const limiter = rateLimit({
	windowMs: config.rateLimit.windowMs,
	max: config.rateLimit.max,
	message:
		"Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(
	express.urlencoded({
		limit: "10mb",
		extended: true,
	}),
);

// Request Logger Middleware
app.use(requestLogger);

// ========================
// Routes Setup
// ========================

// Health Check Route
app.get(
	"/health",
	(_req: Request, res: Response) => {
		res.status(200).json({
			success: true,
			message: `${config.app.name} API is running`,
			timestamp: new Date().toISOString(),
			version: config.app.version,
		});
	},
);

// API Routes
app.get(
	`${config.apiPrefix}/`,
	(_req: Request, res: Response) => {
		res.status(200).json({
			success: true,
			message: `Welcome to ${config.app.name} API v1`,
			endpoints: {
				health: "/health",
				api: `${config.apiPrefix}/*`,
			},
		});
	},
);

// API Routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/products`, productRoutes);
app.use(`${config.apiPrefix}/upload`, uploadRoutes);
app.use(`${config.apiPrefix}/admin/auth`, adminAuthRoutes);
app.use(`${config.apiPrefix}/admin/pending`, pendingActionsRoutes);
app.use(`${config.apiPrefix}/admin/audit`, auditLogsRoutes);
app.use(`${config.apiPrefix}/orders`, ordersRoutes);


// ========================
// Error Handling
// ========================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ========================
// Server Startup
// ========================

const PORT = config.port;
const NODE_ENV = config.nodeEnv;

const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectDatabase();

		// Start Express Server
		const httpServer = createServer(app);
		initSocket(httpServer);
		httpServer.listen(PORT, () => {
			logger.info(
				`
        ╔═══════════════════════════════════════╗
        ║      ${config.app.name} API Server     ║
        ╠═══════════════════════════════════════╣
        ║ Port: ${PORT}
        ║ Environment: ${NODE_ENV}
        ║ Version: ${config.app.version}
        ║ API Prefix: ${config.apiPrefix}
        ╚═══════════════════════════════════════╝
      `.trim(),
			);
		});
	} catch (error) {
		logger.error(
			"Failed to start server:",
			error,
		);
		process.exit(1);
	}
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	process.exit(1);
});

// Handle unhandled promise rejections
process.on(
	"unhandledRejection",
	(reason, promise) => {
		logger.error(
			"Unhandled Rejection at:",
			promise,
			"reason:",
			reason,
		);
		process.exit(1);
	},
);

// Graceful shutdown
process.on("SIGTERM", () => {
	logger.info(
		"SIGTERM signal received: closing HTTP server",
	);
	process.exit(0);
});

process.on("SIGINT", () => {
	logger.info(
		"SIGINT signal received: closing HTTP server",
	);
	process.exit(0);
});

// Start the server
startServer();

export default app;

import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { initSocket } from "@utils/socketManager";
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

import authRoutes from "@routes/auth";
import productRoutes from "@routes/products";
import uploadRoutes from "@routes/upload";
import newsletterRoutes from "@routes/newsletter";
import adminAuthRoutes from "@routes/admin/auth";
import pendingActionsRoutes from "@routes/admin/pendingActions";
import auditLogsRoutes from "@routes/admin/auditLogs";
import ordersRoutes from "@routes/orders";

const app: Express = express();

// Trust Vercel/proxy headers
app.set("trust proxy", 1);

// ========================
// GLOBAL MIDDLEWARE (ORDER MATTERS)
// ========================

// ✅ Security
app.use(helmet());

/// ✅ Unified CORS Configuration (Works for Render, Local, and Vercel)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // Check if the request origin is in our allowed list
      if (config.cors.origin.includes(origin)) {
        callback(null, true);
      } else {
        // Log the denied origin to help you debug if a URL is missing
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message:
    "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ✅ Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  })
);

// ✅ Logging
app.use(requestLogger);

// ========================
// ROUTES
// ========================

// 1. Absolute Root: Redirects to the API prefix
app.get('/', (_req, res) => {
  res.redirect(`${config.apiPrefix}`); 
});

// 2. Health Check: Important for Vercel deployment monitoring
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `${config.app.name} API is running`,
    timestamp: new Date().toISOString(),
    version: config.app.version,
  });
});

// 3. API Root (e.g., /api/): Shows documentation/info
app.get(`${config.apiPrefix}`, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Welcome to ${config.app.name} API v1`,
    endpoints: {
      health: "/health",
      auth: `${config.apiPrefix}/auth`,
      // Add other main categories here
    },
  });
});


// Feature Routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/products`, productRoutes);
app.use(`${config.apiPrefix}/upload`, uploadRoutes);
app.use(`${config.apiPrefix}/admin/auth`, adminAuthRoutes);
app.use(`${config.apiPrefix}/admin/pending`, pendingActionsRoutes);
app.use(`${config.apiPrefix}/admin/audit`, auditLogsRoutes);
app.use(`${config.apiPrefix}/orders`, ordersRoutes);
app.use(`${config.apiPrefix}/newsletter`, newsletterRoutes);

// ========================
// ERROR HANDLING
// ========================

app.use(notFoundHandler);
app.use(errorHandler);

// ========================
// SERVER STARTUP
// ========================

const PORT = process.env.PORT || config.port || 5000;
const NODE_ENV = config.nodeEnv;

const startServer = async () => {
  try {
    await connectDatabase();

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
        `.trim()
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// ========================
// PROCESS HANDLERS
// ========================

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    "Unhandled Rejection at:",
    promise,
    "reason:",
    reason
  );
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

// ========================
// START SERVER
// ========================

  startServer();


export default app;

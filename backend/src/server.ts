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

// ✅ CORS (Vercel-safe manual headers FIRST)
app.use((req, res, next) => {
  const allowedOrigins = config.cors.origin;
  const origin = req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  );

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // ✅ Handle preflight requests early
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  return next(); // ✅ FIX HERE
});
// ✅ CORS middleware (backup + validation)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (config.cors.origin.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
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

// Health Check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `${config.app.name} API is running`,
    timestamp: new Date().toISOString(),
    version: config.app.version,
  });
});

// API Root
app.get(`${config.apiPrefix}/`, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Welcome to ${config.app.name} API v1`,
    endpoints: {
      health: "/health",
      api: `${config.apiPrefix}/*`,
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

const PORT = config.port;
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

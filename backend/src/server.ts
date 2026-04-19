import express, { Express, Request, Response } from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Config & Utils
import { config, connectDatabase } from '@config';
import { initSocket } from '@utils/socketManager';
import { logger } from '@utils/logger';

// Middleware
import { errorHandler, notFoundHandler, requestLogger } from '@middleware';

// Routes
import authRoutes from '@routes/auth';
import productRoutes from '@routes/products';
import uploadRoutes from '@routes/upload';
import newsletterRoutes from '@routes/newsletter';
import contactRoutes from '@routes/contact';
import adminAuthRoutes from '@routes/admin/auth';
import pendingActionsRoutes from '@routes/admin/pendingActions';
import auditLogsRoutes from '@routes/admin/auditLogs';
import ordersRoutes from '@routes/orders';

const app: Express = express();

// ========================
// 1. PRE-ROUTE MIDDLEWARE
// ========================

// ✅ Trust Proxy: Must be first for Vercel/Render to handle HTTPS cookies
app.set('trust proxy', 1);

// ✅ Security Headers
app.use(helmet());

// ✅ Unified CORS: Specific origins are required for 'credentials: true'
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (config.cors.origin.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
  }),
);

// ✅ Global Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// ✅ Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ Cookie Parsing: Must be BEFORE requestLogger to log session data
app.use(cookieParser());

// ✅ Request Logging
app.use(requestLogger);

// ========================
// 2. BASE ROUTES
// ========================

app.get('/', (_req, res) => {
  res.redirect(`${config.apiPrefix}`);
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `${config.app.name} API is running`,
    timestamp: new Date().toISOString(),
    version: config.app.version,
  });
});

app.get(`${config.apiPrefix}`, (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Welcome to ${config.app.name} API v1`,
    endpoints: {
      health: '/health',
      auth: `${config.apiPrefix}/auth`,
      products: `${config.apiPrefix}/products`,
    },
  });
});

// ========================
// 3. FEATURE ROUTES
// ========================

app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/products`, productRoutes);
app.use(`${config.apiPrefix}/upload`, uploadRoutes);
app.use(`${config.apiPrefix}/admin/auth`, adminAuthRoutes);
app.use(`${config.apiPrefix}/admin/pending`, pendingActionsRoutes);
app.use(`${config.apiPrefix}/admin/audit`, auditLogsRoutes);
app.use(`${config.apiPrefix}/orders`, ordersRoutes);
app.use(`${config.apiPrefix}/newsletter`, newsletterRoutes);
app.use(`${config.apiPrefix}/contact`, contactRoutes);

// ========================
// 4. POST-ROUTE MIDDLEWARE
// ========================

app.use(notFoundHandler);
app.use(errorHandler);

// ========================
// 5. SERVER INITIALIZATION
// ========================

const PORT = process.env.PORT || config.port || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    const httpServer = createServer(app);
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      logger.info(
        `
╔═══════════════════════════════════════╗
║       ${config.app.name} API Server       ║
╠═══════════════════════════════════════╣
║ Port: ${PORT}
║ Environment: ${config.nodeEnv}
║ Version: ${config.app.version}
║ API Prefix: ${config.apiPrefix}
╚═══════════════════════════════════════╝
        `.trim(),
      );
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// ========================
// 6. PROCESS HANDLERS
// ========================

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();

export default app;

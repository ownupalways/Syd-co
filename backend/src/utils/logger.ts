import winston from 'winston';
import { config } from '@config'; // make sure this actually exports logLevel
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables first

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss:ms',
  }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({
    filename: 'logs/all.log',
  }),
];

// Safe default for logLevel
const logLevel = config?.logLevel || process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  levels,
  format,
  transports,
});

export default logger;

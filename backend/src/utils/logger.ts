import winston from 'winston';
import fs from 'fs';
import { config } from '@config';
import dotenv from 'dotenv';
dotenv.config();

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

const isVercel = process.env.VERCEL === '1';

const transports: winston.transport[] = [
  new winston.transports.Console(),
];

if (!isVercel) {
  if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs', { recursive: true });
  }
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/all.log',
    }),
  );
}

const logLevel = config?.logLevel || process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  levels,
  format,
  transports,
});

export default logger;

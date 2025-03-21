// src/logger/winston.config.ts

import 'winston-daily-rotate-file';

import * as winston from 'winston';

import { WinstonModuleOptions } from 'nest-winston';

const transports = {
  console: new winston.transports.Console({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
      }),
    ),
  }),
  file: new winston.transports.DailyRotateFile({
    dirname: 'logs',
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info', // Log level for files
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
  }),
};

export const winstonConfig: WinstonModuleOptions = {
  transports: [transports.console, transports.file],
  // Handle uncaught exceptions
  exceptionHandlers: [transports.file],
  rejectionHandlers: [transports.file],
};

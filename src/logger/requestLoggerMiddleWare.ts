// src/logger/request-logger.middleware.ts
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;

    this.logger.info(`Request: ${method} ${originalUrl} from IP ${ip}`);
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.info(`Response: ${method} ${originalUrl} ${statusCode}`);
    });

    next();
  }
}

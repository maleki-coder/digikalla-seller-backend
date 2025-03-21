import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Request, Response } from 'express';

@Catch()
@Injectable()
export class ExceptionLoggerFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, // Inject Winston logger
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Log ALL exceptions (both known and unknown)
    this.logger.error({
      message: `Exception: ${exception.message}`,
      stack: exception.stack,
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        query: request.query,
        ip: request.ip,
      },
    });

    // Determine the response format
    if (exception instanceof HttpException) {
      // Handle known exceptions (HTTP Errors)
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      response.status(status).json({
        statusCode: status,
        // data: errorResponse,
        ...(errorResponse as Object),
      });
    } else {
      // Handle unknown exceptions
      response.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
      });
    }
  }
}

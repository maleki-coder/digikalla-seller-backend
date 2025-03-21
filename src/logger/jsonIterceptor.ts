// src/interceptors/json.interceptor.ts

import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';

@Injectable()
  export class JsonInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse();
      response.setHeader('Content-Type', 'application/json');
      return next.handle();
    }
  }
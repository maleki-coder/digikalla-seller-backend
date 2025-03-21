import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';

import { AppModule } from './app.module';
import { ExceptionLoggerFilter } from './logger/exceptionLoggerFilter';
import { JsonInterceptor } from './logger/jsonIterceptor';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger : false
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(new JsonInterceptor());
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(new ExceptionLoggerFilter(logger));
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Log the port to the console
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();

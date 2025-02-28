import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Log the port to the console
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();

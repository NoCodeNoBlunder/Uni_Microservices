import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  //app is webserver
  const app = await NestFactory.create(AppModule);
  // Allow the frontend to communicate with the backend.
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  //listen tells webserver to start working
  await app.listen(3100);
  console.log('[main.ts] shop backend is running on port 3100');
}
//bootstrap starts application
bootstrap();

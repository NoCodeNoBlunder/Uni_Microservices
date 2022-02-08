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

  const port = process.env.PORT || 3100;
  await app.listen(port);
  console.log('[main.ts] shop backend is running on port ' + port);
}
//bootstrap starts application
bootstrap();

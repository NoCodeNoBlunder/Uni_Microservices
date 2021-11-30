import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //app is webserver
  const app = await NestFactory.create(AppModule);
  //listen tells webserver to start working
  await app.listen(3100);
  console.log('shop backend is running on port 3100');
}
//bootstrap starts application
bootstrap();

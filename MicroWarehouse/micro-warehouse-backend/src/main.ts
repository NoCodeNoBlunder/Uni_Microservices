/** The Web application starts here.*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/** Creates and starts the webserver, listening to port 3000 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // INFO Enables Cross origin requests. We do this for now because we have port 4200 and 3000.
  await app.listen(3000);
  console.log('[main.ts] shop backend is running on port 3000');
}

bootstrap();

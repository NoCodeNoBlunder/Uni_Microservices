/** The Web application starts here.*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/** Creates and starts the webserver, listening to port 3000 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();

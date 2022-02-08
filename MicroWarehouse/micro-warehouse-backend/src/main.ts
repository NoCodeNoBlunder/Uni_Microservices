/** The Web application starts here.*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/** Creates and starts the webserver, listening to port 3000 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // INFO Enables Cross origin requests. We do this for now because we have port 4200 and 3000.

  // We are now listening to a port that has been assigned from heroku.
  // The operating system is passing available ports? If this value does not exist we use 3000 as before.
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('[main.ts] Warehouse is running on port ' + port);
}

bootstrap();

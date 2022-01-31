/** Specifies the imports and outputs of this module via Angular. */

import { Module } from '@nestjs/common';
import { BuilderService } from './builder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildEventSchema } from './build-event.schema';
import { PaletteSchema } from './palette.schema';
import { PickTaskSchema } from "./pick-task.schema";
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'eventStore', schema: BuildEventSchema },
      { name: 'pickTaskStore', schema: PickTaskSchema },
      { name: 'paletteStore', schema: PaletteSchema },
    ]),
  ],

  providers: [BuilderService],
  exports: [BuilderService],
})
export class BuilderModule {}

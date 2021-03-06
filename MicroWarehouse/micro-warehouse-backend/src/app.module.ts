import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BuilderModule } from './modules/builder/builder.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://NoCodeNoBlunder:G9WoGkLT4OPArMJr@cluster0.om2tq.mongodb.net/warehouse-datebase?retryWrites=true&w=majority',
    ),
    BuilderModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

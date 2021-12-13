import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { BuildEvent } from './modules/builder/build-event.schema';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit() {
    // subscribe at warehouse
    this.httpService
      .post('http://localhost:3000/subscribe', {
        subscriberUrl: 'http://localhost:3000/event',
        lastEventTime: '0',
      })
      .subscribe(
        async (response) => {
          try {
            const eventList: any[] = response.data;
            for (const event of eventList) {
              await this.appService.handleEvent(event);
            }
          } catch (error) {
            // console.log( `AppController onModuleInit subscribe handleEvent error` + JSON.stringify(),);
          }
        },
        (error) => {
          // console.log(`Appcontroller onModuleInit error` + JSON.stringify(error, null),);
        },
      );
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    return await this.appService.getQuery(key);
  }

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    console.log(
      'MircoShop app controller postEvent got \n' +
        JSON.stringify(event, null, 3),
    );
    try {
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }
}

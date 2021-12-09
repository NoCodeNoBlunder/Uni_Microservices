import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BuildEvent } from './modules/builder/build-event.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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

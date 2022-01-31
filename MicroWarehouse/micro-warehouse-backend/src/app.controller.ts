/**
 * Warehouse backed on port 3000.
 * The app.controller.ts is the place where the browser will send its request to and it will
 * respond with the appropriate answer, binding the URL request to an operation
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {}

  onModuleInit() {
    //subscribe at warehouse
    console.log('Micro Shop started');
    this.subscribeAtShop(false);
  }

  private subscribeAtShop(isSubscribed: boolean) {
    this.httpService
      .post('http://localhost:3100/subscribe', {
        subscriberUrl: 'http://localhost:3000/event',
        lastEventTime: '0',
        success: isSubscribed,
      })
      .subscribe(
        async (response) => {
          try {
            const eventList: any[] = response.data;
            console.log(
              'AppController onModuleInit subscribe list' +
                JSON.stringify(eventList, null, 3),
            );
            for (const event of eventList) {
              //console.log('AppController onModuleInit subscribe handle' + JSON.stringify(event, null, 3));
              await this.appService.handleEvent(event);
            }
            console.log('Subscription from Warehouse to Shop succeeded.');
          } catch (error) {
            console.log(
              'AppController onModuleInit subscribe handleEvent error' +
                JSON.stringify(error, null, 3),
            );
          }
        },
        (error) => {
          console.log(
            'AppController onModuleInit error' + JSON.stringify(error, null, 3),
          );
        },
      );
  }

  /**
   * Binds this operation to the URL requested in @Get
   * key is a placeholder for a path that comes after query.
   */
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    //return this.appService.getQuery(key);

    console.log(`appController.getQuery called with key ${key}`);
    const result: Promise<any> = await this.appService.getQuery(key);
    console.log(
      `appController.getQuery done ${JSON.stringify(result, null, 3)}\n`,
    );
    return result;
  }

  @Post('cmd')
  async postCommand(@Body() command: Command) {
    try {
      console.log(`got command ${JSON.stringify(command, null, 3)}`);
      const c = await this.appService.handleCommand(command);
      return c;
    } catch (error) {
      return error;
    }
  }

  @Post('subscribe')
  async postSubscribe(@Body() subscripiton: Subscription) {
    try {
      if (subscripiton.isFirst) {
        this.subscribeAtShop(true);
      }
      return await this.appService.handleSubscription(subscripiton);
    } catch (error) {
      return error;
    }
  }

  /**
   * This operation is mapped to the path localhost:3000
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

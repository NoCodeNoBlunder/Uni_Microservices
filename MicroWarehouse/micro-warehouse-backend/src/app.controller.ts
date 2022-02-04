/**
 * Warehouse backed on port 3000.
 * The app.controller.ts is the place where the browser will send its request to and it will
 * respond with the appropriate answer, binding the URL request to an operation
 */

import {
  Body,
  Controller,
  Get,
  Logger,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { HttpService } from '@nestjs/axios';
import { BuildEvent } from './modules/builder/build-event.schema';

@Controller()
export class AppController implements OnModuleInit {
  logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {}

  onModuleInit() {
    this.subscribeAtShop(false);
  }

  // region Publisher Subscriber
  private subscribeAtShop(isSubscribed: boolean) {
    this.httpService
      .post('http://localhost:3100/subscribe', {
        subscriberUrl: 'http://localhost:3000/event',
        lastEventTime: '0',
        isReturnSubscription: isSubscribed,
      })
      .subscribe(
        async (response) => {
          try {
            const eventList: any[] = response.data;
            console.log(
              '[app.controller] subscribeAtShop Subscribers: ' +
                JSON.stringify(eventList, null, 3),
            );
            for (const event of eventList) {
              console.log(
                'AppController onModuleInit subscribe handle' +
                  JSON.stringify(event, null, 3),
              );
              await this.appService.handleEvent(event);
            }
            console.log(
              '[app.controller] Subscription from Warehouse to Shop succeeded.',
            );
          } catch (error) {
            console.log(
              'AppController onModuleInit subscribe handleEvent error' +
                JSON.stringify(error, null, 3),
            );
          }
        },
        (error) => {
          console.log(
            '[app.controller] Cannot subscribe at shop. Shop might not be running.',
          );
          // console.log(JSON.stringify(error, null, 3));
        },
      );
  }

  // Interface to let shop subscribe at warehouse.
  @Post('subscribe')
  async postSubscribe(@Body() subscription: Subscription) {
    try {
      if (!subscription.isReturnSubscription) {
        this.subscribeAtShop(true);
      }
      return await this.appService.handleSubscription(subscription);
    } catch (error) {
      return error;
    }
  }
  // endregion

  // This is what the shop Publishes to.
  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    console.log(
      '[app.contoller] postEvent called with event: ' +
        JSON.stringify(event, null, 3),
    );
    try {
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }

  @Get('event')
  async getEvent(@Param('product') product: string): Promise<any> {
    return await this.appService.getEvent(product);
  }

  /**
   * Binds this operation to the URL requested in @Get
   * key is a placeholder for a path that comes after query.
   */
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    // TODO why is this commented out.
    // return this.appService.getQuery(key);

    console.log(`[app.controller] getQuery called with key ${key}`);
    const result = await this.appService.getQuery(key);
    console.log(
      `appController.getQuery done ${JSON.stringify(result, null, 3)}\n`,
    );
    return result;
  }

  @Post('cmd')
  async postCommand(@Body() command: Command) {
    try {
      console.log(`got command ${JSON.stringify(command, null, 3)}`);
      return await this.appService.handleCommand(command);
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/pickDone')
  async postPickDone(@Body() params: any) {
    console.log('[app.controller] postPickDone called.');

    try {
      this.logger.log(`\npostPickDone got ${JSON.stringify(params, null, 3)}`);
      return await this.appService.handlePickDone(params);
    } catch (error) {
      return error;
    }
  }

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  /**
   * This operation is mapped to the path localhost:3000
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

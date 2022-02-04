import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { BuildEvent } from './modules/builder/build-event.schema';
import { HttpService } from '@nestjs/axios';

import Subscription from './modules/builder/subscription';
import { SetPriceDto } from '../common/SetPriceDto';
import { PlaceOrderDto } from '../common/PlaceOrderDto';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private readonly appService: AppService,
  ) {}

  onModuleInit() {
    this.subscribeAtWarehouse(false);
  }

  // region Publisher Subscriber
  private subscribeAtWarehouse(suc: boolean) {
    // this.publishers.push('http://localhost:3000');
    this.httpService
      .post('http://localhost:3000/subscribe', {
        subscriberUrl: 'http://localhost:3100/event',
        lastEventTime: '0',
        success: suc,
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
              console.log(
                'AppController onModuleInit subscribe handle' +
                  JSON.stringify(event, null, 3),
              );
              await this.appService.handleEvent(event);
            }
            console.log('Shop subscribed to Warehouse');
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

  // Interface to let warehouse subscrube at shop
  @Post('subscribe')
  async postSubscribe(@Body() subscription: Subscription) {
    try {
      console.log(
        '\npostSubscribe got subscription ${JSON.stringify(subscription, null, 3)}',
      );
      const c = await this.appService.handleSubscription(subscription);
      if (!subscription.success) {
        this.subscribeAtWarehouse(true);
      }
      return c;
    } catch (error) {
      return error;
    }
  }
  // endregion

  // This is what the Warehouse published to.
  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    try {
      console.log(
        '[app.controller] URL post request with event: \n' +
          JSON.stringify(event, null, 3),
      );
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }

  // http://localhost:3000/query/palettes
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    return await this.appService.getQuery(key);
  }

  @Post('cmd/productOrdered')
  async postPlaceOrder(@Body() params: PlaceOrderDto) {
    try {
      //this.logger.log('\ngot command ${JSON.stringify(command, null, 3)}')
      return await this.appService.placeOrder(params);
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/setPrice')
  async postCommand(@Body() params: SetPriceDto) {
    try {
      //this.logger.log(`\ngot command ${JSON.stringify(command, null, 3)}`)
      return await this.appService.setPrice(params);
    } catch (error) {
      return error;
    }
  }

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

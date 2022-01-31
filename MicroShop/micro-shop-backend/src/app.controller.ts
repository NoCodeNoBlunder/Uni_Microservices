// Shop Backed on port 3100

import {Body, Controller, Get, OnModuleInit, Param, Post,} from '@nestjs/common';
import {AppService} from './app.service';
import {BuildEvent} from './modules/builder/build-event.schema';
import {HttpService} from '@nestjs/axios';
import {SetPriceDto} from '../common/SetPriceDto';
import {PlaceOrderDto} from '../common/PlaceOrderDto';
import Subscription from './modules/builder/subscription';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private readonly appService: AppService,
  ) {}

  onModuleInit() {
    //subscribe at warehouse
    console.log('Micro Shop started');
    this.subscribeAtWarehouse(false);
  }

  private subscribeAtWarehouse(isSubscribed: boolean) {
    // Subscribe warehouse to shop.
    this.httpService
      .post('http://localhost:3000/subscribe', {
        subscriberUrl: 'http://localhost:3100/event',
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
              console.log(
                'AppController onModuleInit subscribe handle' +
                  JSON.stringify(event, null, 3),
              );
              await this.appService.handleEvent(event);
            }
            console.log('Subscription from Shop to Warehouse succeeded.');
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

  @Post('event')
  async postEvent(@Body() event: BuildEvent) {
    try {
      console.log(
        'MicroShop app controller postEvent got \n' +
          JSON.stringify(event, null, 3),
      );
      return await this.appService.handleEvent(event);
    } catch (error) {
      return error;
    }
  }

  @Post('cmd/setPrice')
  async postCommand(@Body() params: SetPriceDto) {
    console.log('SETPRICE POST REQUEST');
    console.log(JSON.stringify(params, null, 3));

    try {
      //this.logger.log(`\ngot command ${JSON.stringify(command, null, 3)}`)
      return await this.appService.setPrice(params);
    } catch (error) {
      console.log('Error?');
      return error;
    }
  }

  // INFO PRESENT
  @Post('cmd/placeOrder')
  async postPlaceOrder(@Body() params: PlaceOrderDto) {
    try {
      return await this.appService.placeOrder(params);
    } catch (error) {
      return error;
    }
  }

  @Post('subscribe')
  async postSubscribe(@Body() subscription: Subscription) {
    try {
      console.log(
        '\npostSubscribe got subscription ${JSON.stringify(subscription, null, 3)}',
      );
      const c = await this.appService.handleSubscription(subscription);
      if (!subscription.isFirst) {
        this.subscribeAtWarehouse(true);
      }
      return c;
    } catch (error) {
      return error;
    }
  }

  // http://localhost:3000/query/palettes
  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    const result = await this.appService.getQuery(key);
    return result;
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

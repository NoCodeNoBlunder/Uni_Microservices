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

import Subscription from './modules/builder/subscription';
import { SetPriceDto } from './common/SetPriceDto';
import { PlaceOrderDto } from './common/PlaceOrderDto';
import { HttpService } from '@nestjs/axios';

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
  private subscribeAtWarehouse(isReturnSubscriptionVal: boolean) {
    this.httpService
      .post('http://localhost:3000/subscribe', {
        subscriberUrl: 'http://localhost:3100/event',
        lastEventTime: '0',
        isReturnSubscription: isReturnSubscriptionVal,
      })
      .subscribe(
        async (response) => {
          try {
            const eventList: any[] = response.data;
            console.log(
              '[app.controller] subscrieAtWarehouse Subscribers: ' +
                JSON.stringify(eventList, null, 3),
            );
            for (const event of eventList) {
              console.log(
                'AppController onModuleInit subscribe handle' +
                  JSON.stringify(event, null, 3),
              );
              await this.appService.handleEvent(event);
            }
            console.log('[app.controller] SHOP subscribed to WAREHOUSE');
          } catch (error) {
            console.log(
              '[app.controller] onModuleInit subscribe handleEvent error' +
                JSON.stringify(error, null, 3),
            );
          }
        },
        (error) => {
          console.log(
            '[app.controller] Cannot subscribe at Warehouse. Warehouse might not be running.',
          );
          // console.log(JSON.stringify(error, null, 3));
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
      if (!subscription.isReturnSubscription) {
        this.subscribeAtWarehouse(true);
      }
      return c;
    } catch (error) {
      return error;
    }
  }
  // endregion

  @Get('query/:key')
  async getQuery(@Param('key') key: string): Promise<any> {
    return await this.appService.getQuery(key);
  }

  // region Posts
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

  @Post('cmd/productOrdered')
  async postPlaceOrder(@Body() params: PlaceOrderDto) {
    console.log(
      '[app.controller] postPlaceOrder called with: ' +
        JSON.stringify(params, null, 3),
    );
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
  // endregion

  @Get('reset')
  async getReset() {
    return await this.appService.getReset();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

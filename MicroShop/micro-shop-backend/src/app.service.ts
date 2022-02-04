import { Injectable } from '@nestjs/common';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';
import { SetPriceDto } from '../common/SetPriceDto';
import { PlaceOrderDto } from '../common/PlaceOrderDto';
import Subscription from './modules/builder/subscription';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  /**
   * Handled the event that is coming in. Demultiplexing of event types.
   */
  async handleEvent(event: BuildEvent) {
    console.log(
      '[app.service] handleEvent called with ' + JSON.stringify(event, null, 3),
    );
    if (event.eventType === 'productStored') {
      return await this.modelBuilderService.handleProductStored(event);
    } else if (event.eventType === 'addOffer') {
      return await this.modelBuilderService.handleAddOffer(event);
    } else if (event.eventType === 'productOrdered') {
      console.log('[app.service] handleEvent called with productOrdered event');
      return await this.modelBuilderService.handlePlaceOrder(event);
    } else if (event.eventType === 'orderPicked') {
      return await this.modelBuilderService.handleOrderPicked(event);
    }
    return {
      error: 'shop backend does not know how to handle ' + event.eventType,
    };
  }

  // Demultipliexing of queries.
  async getQuery(key: string): Promise<any> {
    if (key === 'customers') {
      return await this.modelBuilderService.getCustomers();
    } else if (key === 'products') {
      console.log('query in app service.');
      return await this.modelBuilderService.getProducts();
    } else if (key.startsWith('product-')) {
      const name = key.substring('product-'.length);
      return await this.modelBuilderService.getProduct(name);
    } else if (key.startsWith('orders_')) {
      const customer = key.substring('orders_'.length);
      return await this.modelBuilderService.getOrdersOf(customer);
    } else {
      return {
        error: 'Mircoshop backend does not know how to handle query key ' + key,
      };
    }
  }

  async setPrice(params: SetPriceDto) {
    // console.log("App Service setPrice()");
    // console.log(JSON.stringify(params, null, 3));
    return await this.modelBuilderService.setPrice(params);
  }

  async placeOrder(params: PlaceOrderDto) {
    await this.modelBuilderService.placeOrder(params);
    return 200; // 200 indicates that it was successful.
  }

  async handleSubscription(subscription: Subscription) {
    return await this.modelBuilderService.handleSubscription(subscription);
  }

  async getReset() {
    await this.modelBuilderService.reset();
    return 'The shop database was cleared.';
  }

  getHello(): string {
    return 'Hello Course!';
  }
}

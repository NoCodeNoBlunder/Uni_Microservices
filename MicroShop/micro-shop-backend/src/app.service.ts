import { Injectable } from '@nestjs/common';
import { BuildEvent } from './modules/builder/build-event.schema';
import { BuilderService } from './modules/builder/builder.service';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  getHello(): string {
    return 'Hello Course!';
  }

  async getReset() {
    await this.modelBuilderService.reset();
    return 'The shop database was cleared.';
  }

  /**
   * Handled the event that is coming in. Demultiplexing of event types.
   */
  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productStored') {
      return await this.modelBuilderService.handleProductStored(event);
    } else if (event.eventType === 'addOffer') {
      return await this.modelBuilderService.handleAddOffer(event);
    } else if (event.eventType === 'placeOrder') {
      return await this.modelBuilderService.handlePlaceOrder(event);
    }
    return {
      error: 'shop backend does not know how to handle ' + event.eventType,
    };
  }

  async getQuery(key: string): Promise<any> {
    if (key === 'customers') {
      return await this.modelBuilderService.getCustomers();
    } else {
      return {
        error: 'Mircoshop backend does not know how to handle query key ' + key,
      };
    }
  }
}

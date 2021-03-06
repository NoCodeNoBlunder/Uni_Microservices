import { Injectable } from '@nestjs/common';
import Subscription from './modules/builder/subscription';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import { BuildEvent } from './modules/builder/build-event.schema';

@Injectable()
export class AppService {
  constructor(private readonly modelBuilderService: BuilderService) {}

  // region Queries
  async getQuery(key: string): Promise<any> {
    console.log('[app.service] getQuery called with key:' + key);
    if (key === 'palettes') {
      return await this.modelBuilderService.getPalettes();
    } else if (key === 'OrdersToPick') {
      return await this.modelBuilderService.getOrdersToPick();
    } else if (key.startsWith('OrdersToPick_')) {
      const orderID = key.substring('OrdersToPick_'.length);
      return await this.modelBuilderService.getOrderToPick(orderID);
    } else {
      const list = await this.modelBuilderService.getByTag(key);
      return {
        key: key,
        result: list,
      };
    }
  }

  async getEvent(event: string) {
    const list = await this.modelBuilderService.getByTag(event);
    return {
      event: event,
      result: list,
    };
  }
  // endregion

  async handleCommand(command: Command) {
    //console.log(`AppService.handleCommand got again ${JSON.strongify(command, null, 3)}`);
    if (command.opCode === 'storePalette') {
      await this.modelBuilderService.storePalette(command.parameters);
      return command;
    } else {
      return `cannot handle ${command.opCode}`;
    }
  }

  async handlePickDone(params: any) {
    await this.modelBuilderService.handlePickDone(params);
    return 200;
  }

  async handleProductShipped(params: any) {
    await this.modelBuilderService.handleProductShipped(params);
    return 200;
  }

  async handleEvent(event: BuildEvent) {
    console.log(
      '[app.service] handleEvent called with event: ' +
        JSON.stringify(event, null, 3),
    );
    if (event.eventType === 'productOrdered') {
      return await this.modelBuilderService.handleProductOrdered(event);
    }
    return {
      error:
        '[app.service] handleEvent Backend cannot handle event: ' +
        event.eventType,
    };
  }

  async handleSubscription(subscription: Subscription) {
    return await this.modelBuilderService.handleSubscription(subscription);
  }

  async getReset() {
    {
      await this.modelBuilderService.reset();
      return 'The Warehouse database was cleared.';
    }
  }

  getHello(): string {
    return 'Hello Course!';
  }
}

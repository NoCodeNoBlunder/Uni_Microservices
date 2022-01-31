/** Defines the Operations that are used by app.controller.ts */

import { Logger } from '@nestjs/common';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { BuildEvent } from './modules/builder/build-event.schema';

export class AppService {
  logger = new Logger(AppService.name);

  constructor(private readonly modelBuilderService: BuilderService) {}

  /**
   * Creates the answer with dummy data for now as a list of JSON objects.
   * @param key is an alias for the last part of the URL.
   */
  async getQuery(key: string): Promise<any> {
    // Info await says this operations needs a lot of time. But has to be waited for. But I can go on without waiting for it.
    console.log('getQuery ' + key);
    const list = await this.modelBuilderService.getByTag(key);
    return {
      key: key,
      result: list,
    };
  }

  // TODO how does mutual subscription work?
  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productOrdered') {
      return await this.modelBuilderService.handleProductOrdered(event);
    }

    return {
      error: 'shop backend does not know how to hanlde ' + event.eventType,
    };

    //   console.log(
    //     'Warehouse app service handle event gets \n' +
    //       JSON.stringify(event, null, 3),
    //   );
    // } else {
    //   return {
    //     error: 'shop backend does not know how to handle ' + event.eventType,
    //   };
    // }
  }

  async handleSubscription(subscription: Subscription) {
    return await this.modelBuilderService.handleSubscription(subscription);
  }

  /**
   * Handles the command command.
   * @param command
   */
  async handleCommand(command: Command) {
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

  getHello(): string {
    return 'Hello Course!';
  }
}

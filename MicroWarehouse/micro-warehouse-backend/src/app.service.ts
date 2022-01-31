/** Defines the Operations that are used by app.controller.ts */

import { Injectable } from '@nestjs/common';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { BuildEvent } from './modules/builder/build-event.schema';

@Injectable()
export class AppService {
  constructor(private readonly modelbuildService: BuilderService) {}

  /**
   * Creates the answer with dummy data for now as a list of JSON objects.
   * @param key is an alias for the last part of the URL.
   */
  async getQuery(key: string): Promise<any> {
    // Info await says this operations needs a lot of time. But has to be waited for. But I can go on without waiting for it.
    const list = await this.modelbuildService.getByTag(key);
    const answer = {
      key: key,
      result: list,
    };

    return answer;
  }

  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productPlaced') {
      //return await this.modelBuilderService.handleOrderPlaced(event);
      console.log(
        'Warehouse app service handle event gets \n' +
          JSON.stringify(event, null, 3),
      );
    } else {
      return {
        error: 'shop backend does not know how to handle ' + event.eventType,
      };
    }
  }

  getHello(): string {
    return 'Hello Course!';
  }

  /**
   * Handles the command command.
   * @param command
   */
  async handleCommand(command: Command) {
    if (command.opCode === 'storePalette') {
      await this.modelbuildService.storePalette(command.parameters);
      return command;
    } else {
      return `cannot handle ${command.opCode}`;
    }
  }

  async handleSubscription(subscription: Subscription) {
    return await this.modelbuildService.handleSubscription(subscription);
  }
}

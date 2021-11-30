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
   * @param event
   */
  async handleEvent(event: BuildEvent) {
    if (event.eventType === 'productStored') {
      return await this.modelBuilderService.handleProductStored(event);
    }
    return event;
  }
}

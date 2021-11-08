import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BuildEvent } from './build-event.schema';
import { Model } from 'mongoose';

/**
 * Specifies what collection to store the data into.
 */
@Injectable()
export class BuilderService {
  constructor(
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
  ) {
    this.clear();

    this.store({
      blockId: 'pal042',
      time: '13:48:00',
      eventType: 'PaletteStored',
      tags: ['palettes', 'red shoes'],
      payload: {
        barcode: 'pal042',
        product: 'red shoes',
        amount: 10,
        location: 'shelf 42',
      },
    });

    this.store({
      blockId: 'pal044',
      time: '14:50:00',
      eventType: 'PaletteStored',
      tags: ['palettes', 'blue shoes'],
      payload: {
        barcode: 'pal044',
        product: 'blue shoes',
        amount: 2,
        location: 'shelf 42',
      },
    });
  }

  /**
   * Updates or inserts a new event into eventstores collection.
   * @param event The event to store.
   */
  async store(event: BuildEvent) {
    const filter = { blockId: event.blockId };
    return this.buildEventModel.findOneAndUpdate(filter, event, {
      upsert: true,
    });
  }

  /**
   * Clears the the Collection eventstores from the mongoDB.
   */
  async clear() {
    return this.buildEventModel.db.dropCollection('eventstores');
  }
}

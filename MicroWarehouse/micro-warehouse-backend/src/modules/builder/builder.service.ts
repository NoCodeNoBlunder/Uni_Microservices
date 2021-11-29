import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BuildEvent } from './build-event.schema';
import { Model } from 'mongoose';

/**
 * Specifies what collection to store the data into.
 */
@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
  ) {}

  /**
   * Interface Method so when this module gets created we store our items.
   * Gets called once when we start the server for instance with npm start.
   */
  async onModuleInit() {
    await this.clear();
  }

  /**
   * TODO This gets all Objects that have the tag.
   * @param tag
   */
  getByTag(tag: string) {
    console.log('getByTag called with ' + tag);
    // INFO find is another mongodb query. create and run query.
    const list = this.buildEventModel.find({ tags: tag }).exec();
    return list;
  }

  /**
   * Inserts or updates a new event into eventstores collection.
   * @param event The event to store.
   */
  async store(event: BuildEvent) {
    const filter = { blockId: event.blockId };
    return this.buildEventModel
      .findOneAndUpdate(filter, event, { upsert: true })
      .exec(); // TODO the query gets created but has to be executes also.
  }

  /**
   * Clears the the Collection eventstores from the mongoDB.
   */
  clear() {
    // TODO use remove hier
    return this.buildEventModel.remove();
  }

  async storePalette(palette: any) {
    // Shoudl check the palette for consistency, later.
    const event = {
      blockId: palette.barcode,
      time: new Date().toISOString(),
      eventType: 'PaletteStored',
      tags: ['palettes', palette.product],
      payload: palette,
    };

    try {
      await this.store(event);
    } catch (error) {
      console.log(`store did not work ${error}`);
    }

    console.log(
      `builderService.storePalette stores ${JSON.stringify(event, null, 3)}`,
    );
    return palette;
  }
}

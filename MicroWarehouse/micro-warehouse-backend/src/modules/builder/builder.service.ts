import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { BuildEvent } from './build-event.schema';
import { Model } from 'mongoose';
import subscription from './subscription';

/**
 * Specifies what collection to store the data into.
 */
@Injectable()
export class BuilderService implements OnModuleInit {
  subScriberUrls: string[] = [];

  constructor(
    private httpService: HttpService,
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
    //ensure at least a placeholder
    const placeholder = await this.buildEventModel
      .findOneAndUpdate(
        { blockId: event.blockId },
        { blockId: event.blockId, $setOnInsert: { time: '' } },
        { upsert: true, new: true },
      )
      .exec();
    const newEvent = await this.buildEventModel
      .findOneAndUpdate(
        { blockId: event.blockId, name: { $lt: event.time } },
        event,
        { new: true },
      )
      .exec();
    return newEvent != null;
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
    palette.amount = Number(palette.amount);
    const event = {
      blockId: palette.barcode,
      time: new Date().toISOString(),
      eventType: 'PaletteStored',
      tags: ['palettes', palette.product],
      payload: palette,
    };

    try {
      const storeSuccess = await this.store(event);
      const amount = await this.computeAmount(palette.product);

      if (storeSuccess) {
        const newEvent = {
          eventType: 'productStored',
          blockId: palette.product,
          time: event.time,
          tags: [],
          payload: {
            product: palette.product,
            amount: amount,
          },
        };

        await this.store(newEvent);
        this.publish(newEvent);
      }
    } catch (error) {
      console.log(`store did not work ${error}`);
    }

    console.log(
      `builderService.storePalette stores ${JSON.stringify(event, null, 3)}`,
    );
    return palette;
  }

  async handleSubscription(subscription: subscription) {
    // store in subscribter list
    if (!this.subScriberUrls.includes(subscription.subscriberUrl)) {
      this.subScriberUrls.push(subscription.subscriberUrl);
    }

    // publish evnet after last event
    const eventList = await this.buildEventModel
      .find({
        // TODO eventType: 'productStored', ?
        // eventType: 'PaletteStored',
        eventType: 'productStored',
        time: { $gt: subscription.lastEventTime },
      })
      .exec();

    return eventList;
  }

  async computeAmount(productName: string) {
    // all palleteStored for product
    const paletteStoredList: any[] = await this.buildEventModel
      .find({
        eventType: 'PaletteStored',
        'payload.product': productName,
      })
      .exec();

    let sum = 0;
    for (const e of paletteStoredList) {
      sum += e.payload.amount;
    }

    // Minus picked orders

    return sum;
  }

  publish(newEvent: BuildEvent) {
    console.log(
      'build service publish subsribersUrls:\n' +
        JSON.stringify(this.subScriberUrls, null, 3),
    );
    const oldUrls = this.subScriberUrls;
    this.subScriberUrls = [];
    for (const subscriberUrl of oldUrls) {
      this.httpService.post(subscriberUrl, newEvent).subscribe(
        (response) => {
          console.log(
            'Warehouse builder service publish post response is \n' +
              JSON.stringify(response.data, null, 3),
          );
          this.subScriberUrls.push(subscriberUrl);
        },
        (error) => {
          console.log(
            'build service publish error: \n' + JSON.stringify(error, null, 3),
          );
        },
      );
    }
  }
}

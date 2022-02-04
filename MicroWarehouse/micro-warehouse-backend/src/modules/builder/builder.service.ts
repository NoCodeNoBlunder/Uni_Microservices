import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { BuildEvent } from './build-event.schema';
import { Palette } from './palette.schema';
import { Model } from 'mongoose';
import subscription from './subscription';
import { PickTask } from './pick-task.schema';

/**
 * Specifies what collection to store the data into.
 */
@Injectable()
export class BuilderService implements OnModuleInit {
  subscriberUrls: string[] = [];

  logger = new Logger(BuilderService.name);

  constructor(
    private httpService: HttpService,
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
    @InjectModel('pickTaskStore') private pickTaskModel: Model<PickTask>,
    @InjectModel('paletteStore') private paletteModel: Model<Palette>,
  ) {}

  /**
   * Interface Method so when this module gets created we store our items.
   * Gets called once when we start the server for instance with npm start.
   */
  async onModuleInit() {
    await this.clear();
  }

  // region Queries
  /**
   * TODO This gets all Objects that have the tag.
   * @param tag
   */
  getByTag(tag: string) {
    console.log('getByTag called with ' + tag);
    // INFO find is another mongodb query. create and run query.
    return this.buildEventModel.find({ tags: tag }).exec();
  }

  async getOrdersToPick() {
    const c = this.pickTaskModel.find({}).exec();
    console.log(
      '[builder.service] getOrdersToPick Query result: ' +
        JSON.stringify(c, null, 3),
    );
    return c;
  }

  async orderToPick(orderID: string) {
    console.log('orderToPick called with ID:' + orderID);
    const c = await this.pickTaskModel.findOne({ code: orderID }).exec();
    console.log('Result', JSON.stringify(c, null, 3));
    return c;
    // return await this.pickTaskModel.findOne({ code: orderID }).exec();
  }
  // endregion

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

  async storePalette(palette: any) {
    // Should check the palette for consistency, later.
    // Changed In order to have the palletes in the module this method needs to change.
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
      const amount = await this.computeAmount(palette.product); // compute the new amount of this product.

      if (storeSuccess) {
        // TODO new Callstack.
        await this.storeModelPalette(palette);

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
    console.log(
      '[builder.service] handleSubscription with subscriberUrl: ' +
        subscription.subscriberUrl,
    );
    if (!this.subscriberUrls.includes(subscription.subscriberUrl)) {
      // Add the new subscriberUrl is not allready in the array add it.
      this.subscriberUrls.push(subscription.subscriberUrl);
    }

    // publish event after last event
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

  // Communicate with shop-backend.
  publish(newEvent: BuildEvent) {
    console.log(
      '[builder.service] publish to SubscriberUrls:\n' +
        JSON.stringify(this.subscriberUrls, null, 3),
    );
    const oldUrls = this.subscriberUrls;
    this.subscriberUrls = [];
    for (const subscriberUrl of oldUrls) {
      this.httpService.post(subscriberUrl, newEvent).subscribe(
        (response) => {
          console.log(
            'Warehouse builder service publish post response is \n' +
              JSON.stringify(response.data, null, 3),
          );
          this.subscriberUrls.push(subscriberUrl);
        },
        (error) => {
          console.log(
            '[builder.service] publish error: \n' +
              JSON.stringify(error, null, 3),
          );
        },
      );
    }
  }

  /**
   * Finds all product with the name in db and gets all the location of these items.
   * @param event
   */
  async handleProductOrdered(event: BuildEvent) {
    console.log(
      '[builder.service] handleProductOrdered is called with event:' +
        JSON.stringify(event, null, 3),
    );
    const storeSuccess = await this.store(event);
    if (storeSuccess) {
      console.log(
        '[builder.service] in handleProductOrdered event was stored successfully!',
      );
      const params = event.payload;
      const productPalettes = await this.paletteModel
        .find({ product: params.product })
        .exec();
      const locations: string[] = [];
      for (const pal of productPalettes) {
        if (pal.location != null) {
          // TODO hinzugefügt!
          locations.push(pal.location);
        }
      }
      const pickTask = {
        code: params.code,
        product: params.product,
        address: params.customer + ', ' + params.address,
        locations: locations,
        state: 'order placed',
      };
      // TODO unused result.
      const result = this.pickTaskModel
        .findOneAndUpdate({ code: params.code }, pickTask, {
          upsert: true,
          new: true,
        })
        .exec();
    }
    return 200;
  }

  // Updates the palette after a Pick event occured.
  async handlePickDone(params: any) {
    console.log(
      '[builder.service] handlePickDone called wtih: ' +
        JSON.stringify(params, null, 3),
    );
    // Update palette.
    const pal = await this.paletteModel
      .findOneAndUpdate(
        { location: params.location },
        {
          $inc: { amount: -1 },
        },
        { new: true }, // return the new palette.
      )
      .exec();
    this.logger.log(`handlePickDone new pal \n${JSON.stringify(pal, null, 3)}`);

    // Update pickTask.
    const pick = await this.pickTaskModel
      // TODO Muss ich die Attribute die nicht verändert werden solle auch angeben?
      .findOneAndUpdate(
        { code: params.code },
        {
          palette: pal.barcode,
          state: params.state, // Here the new state is assigned.
        },
        { new: true },
      )
      .exec();

    // publish change
    const event = {
      eventType: 'orderPicked',
      blockId: pick.code,
      time: new Date().toISOString(),
      tags: ['orders', pick.code],
      payload: {
        code: pick.code,
        state: pick.state,
      },
    };
    const storeSuccess = await this.store(event);
    this.publish(event);
  }

  private async storeModelPalette(palette: any) {
    await this.paletteModel
      .findOneAndUpdate({ barcode: palette.barcode }, palette, { upsert: true })
      .exec();

    // await this.pickTaskModel
    //     .findOneAndUpdate({product: palette.product})
    // Add location to
  }



  // region Reset DB
  /**
   * Clears the the Collection eventstores from the mongoDB.
   */
  async clear() {
    // return this.buildEventModel.remove();
    await this.paletteModel.deleteMany();
    await this.buildEventModel.deleteMany();
    await this.pickTaskModel.deleteMany();
  }

  async reset() {
    await this.clear();
  }
  // endregion
}

/* eslint-disable prettier/prettier */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { BuildEvent } from './build-event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MSProduct } from "./product.schema";

@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
    @InjectModel('products') private productsModel: Model<MSProduct>
  ) {}

  async onModuleInit() {
    await this.reset();
  }

  async storeEvent(event: BuildEvent) {
    let previousEvent = await this.buildEventModel
      .findOne({ blockId: event.blockId })
      .exec();

    // THis object doest not exist in DB.
    if (previousEvent == null) {
      previousEvent = await this.buildEventModel.create(event);
      console.log('BuilderService.storeEvent create: \n' + JSON.stringify(previousEvent, null, 3));
      return true;

    // Update if the event is more recent than the previous event.
    } else if (previousEvent.time < event.time) {
      previousEvent = await this.buildEventModel
        .findOneAndUpdate({ blockId: event.blockId }, event, { new: true })
        .exec();

      console.log('BuilderService.storeEvent update\n' + JSON.stringify(previousEvent, null, 3));
      return true;
    }
    return false;
  }

  async storeProduct(product: any) {
    try {
      const newProduct = await this.productsModel
        .findOneAndUpdate(
          { product: product.product },
          {
            $inc: { amount: product.amount }, // increments by one.
            $set: { amountTime: product.amountTime },
          },
          { upsert: true, new: true }).exec();
      console.log('BuilderService.storeProduct findOneAndUpdate: \n' + JSON.stringify(newProduct, null, 3),
      );
      return newProduct;
    } catch (error) {
      console.log(
        'Error in BuilderService.storeProduct: \n' +
          JSON.stringify(error, null, 3),
      );
    }
  }

  async handleProductStored(event: BuildEvent) {
    const session = await this.buildEventModel.startSession();
    let newProduct = null;
    await session.withTransaction(async () => {
      const storeSuccess = await this.storeEvent(event);

      if (storeSuccess) {
        const productPatch = {
          product: event.blockId,
          amount: event.payload.amount,
          amountTime: event.time,
        };
        newProduct = await this.storeProduct(productPatch);
      }
      else {
        newProduct = await this.productsModel.findOne({product: event.blockId});
      }
    });

    // TODO muss hier ein await hin?
    await session.endSession();
    return newProduct;
  }

  async clear() {
    // deleteMany is an async database operation.
    await this.productsModel.deleteMany();
    await this.buildEventModel.deleteMany();
  }

  async reset() {
    await this.clear();
    // Dummy Data.
    await this.handleProductStored({
      blockId: 'rubber_boots',
      time: '11:00:00',
      eventType: 'ProductStores',
      tags: ['product', 'rubber_boots'],
      payload: {
        product: 'runner_boots',
        amount: 23,
        location: 'entry_door',
      },
    });

    // Duplicate
    await this.handleProductStored({
      blockId: 'rubber_boots',
      time: '11:00:00',
      eventType: 'ProductStores',
      tags: ['product', 'rubber_boots'],
      payload: {
        product: 'runner_boots',
        amount: 23,
        location: 'entry_door',
      },
    });
  }
}

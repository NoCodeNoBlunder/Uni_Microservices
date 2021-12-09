/* eslint-disable prettier/prettier */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { BuildEvent } from './build-event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MSProduct } from "./product.schema";
import { Order } from "./order.schema";
import { Customer } from "./customer.schema";


@Injectable()
export class BuilderService implements OnModuleInit {
  constructor(
    @InjectModel('eventStore') private buildEventModel: Model<BuildEvent>,
    @InjectModel('products') private productsModel: Model<MSProduct>,
    @InjectModel('orders') private orderModel: Model<Order>,
    @InjectModel('customers') private customersModel: Model<Customer>,
  ) {}

  async onModuleInit() {
    await this.reset();
  }

  /**
   * Checks whether the event is already there.
   * If an event with the blockId allready exists it only get updated if it's time is more recent.
   */
  async storeEvent(event: BuildEvent) {
    // Ensures there is at least a placeholder. When i.e. addOffer is called before ProductStored.

    const placeholder = await this.buildEventModel.findOneAndUpdate(
        { blockId: event.blockId },
        { blockId: event.blockId, $setOnInsert: {time: ''}}, // time is required in build-event.schema.ts
        { upsert: true, new: true }).exec();
    console.log('builder service storeEvent line \n' + JSON.stringify(placeholder, null, 3));

    const newEvent = await this.buildEventModel.findOneAndUpdate(
        { blockId: event.blockId, time: {$lt: event.time }}, // Only selects items where the value of field is lt specified value. Notice upsert defaults to false.
        event,
        { new: true }).exec();
    console.log('builder service storeEvent line \n' + JSON.stringify(newEvent, null, 3));

    return newEvent != null;
  }

  /**
   * stores a new Product if it is not there.
   * Increases the amount it it is already there.
   */
  async storeProduct(newProductData: any) {

    try {
      const newProduct = await this.productsModel
        .findOneAndUpdate(
          { product: newProductData.product },
          {
            $inc: { amount: newProductData.amount },
            $set: { amountTime: newProductData.amountTime,
                    product: newProductData.product },
          },
          { upsert: true, new: true }).exec();
      console.log('BuilderService.storeProduct storeProduct: \n' + JSON.stringify(newProduct, null, 3),
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

    let newProduct;
      // Store a build event.
    const storeSuccess = await this.storeEvent(event);

      // Checks whether the storeEvent was successful.
      if (storeSuccess) {
        // Store a product object
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

    return newProduct;
  }

  async clear() {
    // deleteMany is an async database operation.
    await this.productsModel.deleteMany();
    await this.buildEventModel.deleteMany();
    await this.orderModel.deleteMany();
    await this.customersModel.deleteMany();
  }

  async reset() {
    await this.clear();
    // Dummy Data.
  //   await this.handleProductStored({
  //     blockId: 'rubber_boots',
  //     time: '11:00:00',
  //     eventType: 'ProductStores',
  //     tags: ['product', 'rubber_boots'],
  //     payload: {
  //       product: 'runner_boots',
  //       amount: 23,
  //       location: 'entry_door',
  //     },
  //   });
  //
  //   // Duplicate
  //   await this.handleProductStored({
  //     blockId: 'rubber_boots',
  //     time: '11:00:00',
  //     eventType: 'ProductStores',
  //     tags: ['product', 'rubber_boots'],
  //     payload: {
  //       product: 'runner_boots',
  //       amount: 23,
  //       location: 'entry_door',
  //     },
  //   });
  }

  async handleAddOffer(event: BuildEvent) {
    // store a build event
    const storeSuccess = await this.storeEvent(event);
    let newProduct = null;

    if (storeSuccess) {
      // store a product object
      const productPatch = {
        product: event.payload.product,
        price: event.payload.price,
      }
      // console.log("BuilderService.handleAddOffer \n" + JSON.stringify(productPatch, null, 3));

      try {
        newProduct = await this.productsModel.findOneAndUpdate(
            {product: productPatch.product},
            // TODO is this a mistake here?
            productPatch,
            {upsert: true, new: true}).exec();
        console.log("BuilderService.handleAddOffer" + JSON.stringify(newProduct, null, 3));
        return newProduct;
      } catch (error) {
        console.log("Error in BuilderService.storeProduct: \n" + JSON.stringify(error, null, 3));
      }
    }

    else {
      return await this.productsModel.findOne({product: event.payload.product});
    }
  }

  async handlePlaceOrder(event: BuildEvent) {
    // store a build event
    const storeSuccess = await this.storeEvent(event);
    let newOrder = null;

    if (storeSuccess) {
      // store an order object
      try {
        newOrder = await this.orderModel.findOneAndUpdate(
            {code: event.payload.code},
            event.payload,
            {upsert: true, new: true}).exec();
            console.log('BuilderService.handlePlaceOrder \n' + JSON.stringify(newOrder, null, 3));

        // and upsert customer
        await this.customersModel.findOneAndUpdate(
            {name: event.payload.customer},
            {
              name: event.payload.customer,
              lastAddress: event.payload.address,
            },
            {upsert: true, new: true}).exec();
        return newOrder;
      } catch (error) {
        console.log('Error in BuilderService.handlePlaceOrder: \n' + JSON.stringify(error, null, 3));
      }
    }
    else {
      return await this.productsModel.findOne({product: event.blockId});
    }
  }

  /**
   * Return a list of all customers with no condition.
   */
  async getCustomers() {
    return await this.customersModel.find({}).exec();
  }
}

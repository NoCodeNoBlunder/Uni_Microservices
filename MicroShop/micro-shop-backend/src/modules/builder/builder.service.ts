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
   * Checks whether the event is already there (deduplication).
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
        // INFO Warehosue frontend cannot deal with this id.
        {
          tags: event.tags,
          time: event.time,
          eventType: event.eventType,
          payload: event.payload,
        },
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
          newProductData,
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
    let newProduct = null;
    //store a build event
    const storeSuccess = await this.storeEvent(event);
    if(storeSuccess) {
      //store a product object
      const newAmount = await this.computeNewProductAmount(event.blockId)
      const productPatch = {
        product: event.blockId,
        amount: newAmount,
        amountTime: event.time,
      };
      newProduct = await this.storeProduct(productPatch);
    }
    else {
      newProduct = await this.productsModel.findOne({product:event.blockId});
    }
    return newProduct;
  }

  async computeNewProductAmount(productName) {
    const lastStoredEvent = await this.buildEventModel.findOne({blockId: productName}).exec();
    const lastEvent = lastStoredEvent.payload.amount;

    const newOrdersList: any[] = await this.buildEventModel.find(
        {
          eventType: 'placeOrder',
          'payload.product': productName
        }
    ).exec();

    const newOrdersNumber = newOrdersList.length;
    const laterShippingList: any[] = await this.buildEventModel.find(
        {
          eventType: 'orderPicked',
          time: {$gt: lastStoredEvent.time},
          'payload.product': productName
        }
    ).exec();
    return lastEvent;
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
        const newCustomer = await this.customersModel.findOneAndUpdate(
            {name: event.payload.customer},
            {
              name: event.payload.customer,
              lastAddress: event.payload.address,
            },
            {upsert: true, new: true}).exec();

        const newAmount = await this.computeNewProductAmount(event.payload.product);
        await this.productsModel.findOneAndUpdate(
            { product: event.payload.product },
            { amount: newAmount }
        )

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

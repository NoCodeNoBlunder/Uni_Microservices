/* eslint-disable prettier/prettier */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { BuildEvent } from './build-event.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MSProduct } from "./product.schema";
import { Order } from "./order.schema";
import { Customer } from "./customer.schema";
import { SetPriceDto } from "../../../common/SetPriceDto";
import { PlaceOrderDto } from "../../../common/PlaceOrderDto";
import { HttpService } from "@nestjs/axios";
import Subscription from "./subscription";


@Injectable()
export class BuilderService implements OnModuleInit {

  private subscriberUrls: string[] = []

  constructor(
    private httpService: HttpService,
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

    // TODO commnet these out?
    await this.orderModel.deleteMany();
    await this.customersModel.deleteMany();

    await this.storeProduct({
      product: 'jeans',
      amount: 10,
      amountTime: '12:00',
      price: 0.0,
    })
    await this.storeProduct({
      product: 'tshirt',
      amount: 11,
      amountTime: '12:01',
      price: 0.0,
    })
    await this.storeProduct({
      product: 'socks',
      amount: 12,
      amountTime: '12:02',
      price: 0.0,
    })
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
   * Return a list of all customers in db with no condition.
   */
  async getCustomers() {
    return await this.customersModel.find({}).exec();
  }

  /**
   * Returns a list of all products in db with no condition.
   */
  async getProducts() {
    return await this.productsModel.find({}).exec();
  }

  async getProduct(name) {
    return await this.productsModel.findOne({product: name}).exec();
  }

  async setPrice(params: SetPriceDto) {
    // console.log("Builder.service setPrice()");
    // console.log(JSON.stringify(params, null, 3));

    const test = await this.productsModel
        .findOneAndUpdate(
            { product: params.product },
            { price: `${params.price}` },
            { new: true },
        )
        .exec();
    console.log("RETURN VALUE:");
    console.log(JSON.stringify(test, null, 3));
    return test;
  }

  // TODO HA 11 mutual subscription.
  publish (newEvent: BuildEvent) {
    console.log(`build service publish subscriberUrls: \n` + JSON.stringify(this.subscriberUrls, null, 3));
    const oldUrls = this.subscriberUrls;
    this.subscriberUrls = [];
    // TODO const here?
    for (const subscriberUrl of oldUrls) {
      this.httpService.post(subscriberUrl, newEvent).subscribe(
          (response) => {
            console.log('Warehouse builder service publish post response is \n' + JSON.stringify(response.data, null, 3))
            this.subscriberUrls.push(subscriberUrl);
          },
          (error) => {
            console.log(`build service publish error: \n` + JSON.stringify(error, null, 3));
          });
    }
  }

  async handleSubscription(subscription: Subscription) {
    if (!this.subscriberUrls.includes(subscription.subscriberUrl)) {
      this.subscriberUrls.push(subscription.subscriberUrl);
    }

    const eventList = await this.buildEventModel
        .find({
          eventType: 'productOrdered',
          time: { $gt: subscription.lastEventTime },
        })
        .exec();
    return eventList;
  }

  async placeOrder(params: PlaceOrderDto) {
    const orderDto = {
      code: params.order,
      product: params.product,
      customer: params.customer,
      address: params.address,
      state: "order placed",
    }
    const result = await this.orderModel.findOneAndUpdate(
        { code: params.order },
        orderDto,
        { upsert:true, new: true}).exec()
    console.log(`placeOrder stored: \n ${JSON.stringify(result, null, 3)}`);

    // TODO muss das hier weg? Albter hatte es nicht mehr 37:13
    // await this.customersModel.findOneAndUpdate(
    //     { name: params.customer },
    //     {
    //       name: params.customer,
    //       lastAddress: params.address,
    //     },
    //     { upsert: true, new: true }
    // ).exec()

    const event = {
      blockId: params.order,
      time: new Date().toISOString(),
      eventType: 'productOrdered',
      tags: ['products', params.order],
      payload: orderDto,
    };
    await this.storeEvent(event);
    // Notify the subscriber of this new event.
    this.publish(event);
  }

  // Find and return all the models where to customer attribute is customer.
  async getOrdersOf(customer: string) {
    return await this.orderModel.find({customer: customer}).exec();
  }

  async handleOrderPicked(event: BuildEvent) {
    const params = event.payload
    const order = await this.orderModel.findOneAndUpdate(
        { code: params.code },
        {
          state: params.state
        },
        { new: true }
    ).exec()

    // TODO this is not complete.
    const newEvent = {
      blockId: order.code,
      time: new Date().toISOString(),
      eventType: 'orderPicked',
      tags: ['orders', order.code],
      payload: {
        code: order.code,
        product: order.product,
        customer: order.product,
        address: order.address,
        state: order.state,
      },
    }

    await this.storeEvent(newEvent);
    return newEvent;
  }
}

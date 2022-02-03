import { Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BuildEvent } from './build-event.schema';
import { Palette } from './palette.schema';
import { Model } from 'mongoose';
import subscription from './subscription';
import { PickTask } from './pick-task.schema';
export declare class BuilderService implements OnModuleInit {
    private httpService;
    private buildEventModel;
    private pickTaskModel;
    private paletteModel;
    subScriberUrls: string[];
    logger: Logger;
    constructor(httpService: HttpService, buildEventModel: Model<BuildEvent>, pickTaskModel: Model<PickTask>, paletteModel: Model<Palette>);
    onModuleInit(): Promise<void>;
    getByTag(tag: string): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getOrdersToPick(): Promise<(import("mongoose").Document<any, any, PickTask> & PickTask & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    store(event: BuildEvent): Promise<boolean>;
    clear(): Promise<void>;
    storePalette(palette: any): Promise<any>;
    handleSubscription(subscription: subscription): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    computeAmount(productName: string): Promise<number>;
    publish(newEvent: BuildEvent): void;
    handleProductOrdered(event: BuildEvent): Promise<number>;
    handlePickDone(params: any): Promise<void>;
    private storeModelPalette;
    reset(): Promise<void>;
    orderToPick(orderID: string): Promise<import("mongoose").Document<any, any, PickTask> & PickTask & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}

import { OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { BuildEvent } from './build-event.schema';
import { Model } from 'mongoose';
import subscription from './subscription';
export declare class BuilderService implements OnModuleInit {
    private httpService;
    private buildEventModel;
    subScriberUrls: string[];
    constructor(httpService: HttpService, buildEventModel: Model<BuildEvent>);
    onModuleInit(): Promise<void>;
    getByTag(tag: string): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    store(event: BuildEvent): Promise<boolean>;
    clear(): import("mongoose").Query<any, import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, BuildEvent>;
    storePalette(palette: any): Promise<any>;
    handleSubscription(subscription: subscription): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    computeAmount(productName: string): Promise<number>;
    publish(newEvent: BuildEvent): void;
}

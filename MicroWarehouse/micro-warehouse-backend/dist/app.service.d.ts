/// <reference types="mongoose" />
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
export declare class AppService {
    private readonly modelbuildService;
    constructor(modelbuildService: BuilderService);
    getQuery(key: string): Promise<any>;
    getHello(): string;
    handleCommand(command: Command): Promise<string | Command>;
    handleSubscription(subscription: Subscription): Promise<(import("mongoose").Document<any, any, import("./modules/builder/build-event.schema").BuildEvent> & import("./modules/builder/build-event.schema").BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}

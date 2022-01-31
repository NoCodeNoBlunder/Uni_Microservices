/// <reference types="mongoose" />
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { BuildEvent } from './modules/builder/build-event.schema';
export declare class AppService {
    private readonly modelbuildService;
    constructor(modelbuildService: BuilderService);
    getQuery(key: string): Promise<any>;
    handleEvent(event: BuildEvent): Promise<{
        error: string;
    }>;
    getHello(): string;
    handleCommand(command: Command): Promise<string | Command>;
    handleSubscription(subscription: Subscription): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}

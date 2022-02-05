/// <reference types="mongoose" />
import Subscription from './modules/builder/subscription';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import { BuildEvent } from './modules/builder/build-event.schema';
export declare class AppService {
    private readonly modelBuilderService;
    constructor(modelBuilderService: BuilderService);
    getQuery(key: string): Promise<any>;
    getEvent(event: string): Promise<{
        event: string;
        result: (import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
    handleCommand(command: Command): Promise<string | Command>;
    handlePickDone(params: any): Promise<number>;
    handleProductShipped(params: any): Promise<number>;
    handleEvent(event: BuildEvent): Promise<number | {
        error: string;
    }>;
    handleSubscription(subscription: Subscription): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getReset(): Promise<string>;
    getHello(): string;
}

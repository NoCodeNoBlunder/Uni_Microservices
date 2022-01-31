/// <reference types="mongoose" />
import { Logger } from '@nestjs/common';
import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { BuildEvent } from './modules/builder/build-event.schema';
export declare class AppService {
    private readonly modelBuilderService;
    logger: Logger;
    constructor(modelBuilderService: BuilderService);
    getQuery(key: string): Promise<any>;
    handleEvent(event: BuildEvent): Promise<number | {
        error: string;
    }>;
    handleSubscription(subscription: Subscription): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    handleCommand(command: Command): Promise<string | Command>;
    handlePickDone(params: any): Promise<number>;
    getHello(): string;
}

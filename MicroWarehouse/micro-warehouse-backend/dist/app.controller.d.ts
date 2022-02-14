import { Logger, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { HttpService } from '@nestjs/axios';
import { BuildEvent } from './modules/builder/build-event.schema';
export declare class AppController implements OnModuleInit {
    private readonly appService;
    private httpService;
    logger: Logger;
    port: string | number;
    warehoueUrl: string;
    shopUrl: string;
    constructor(appService: AppService, httpService: HttpService);
    onModuleInit(): void;
    private subscribeAtShop;
    postSubscribe(subscription: Subscription): Promise<any>;
    postEvent(event: BuildEvent): Promise<any>;
    getEvent(product: string): Promise<any>;
    getQuery(key: string): Promise<any>;
    postCommand(command: Command): Promise<any>;
    postPickDone(params: any): Promise<any>;
    postProductShipped(params: any): Promise<any>;
    getReset(): Promise<string>;
    getHello(): string;
}

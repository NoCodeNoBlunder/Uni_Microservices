import { OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
import { HttpService } from '@nestjs/axios';
export declare class AppController implements OnModuleInit {
    private readonly appService;
    private httpService;
    constructor(appService: AppService, httpService: HttpService);
    onModuleInit(): void;
    private subscribeAtShop;
    getQuery(key: string): Promise<any>;
    postCommand(command: Command): Promise<any>;
    postSubscribe(subscripiton: Subscription): Promise<any>;
    getHello(): string;
}

import { AppService } from './app.service';
import Command from './modules/builder/command';
import Subscription from './modules/builder/subscription';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getQuery(key: string): Promise<any>;
    postCommand(command: Command): Promise<any>;
    postSubscribe(subscripiton: Subscription): Promise<any>;
    getHello(): string;
}

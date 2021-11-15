import { AppService } from './app.service';
import Command from './modules/builder/command';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getQuery(key: string): Promise<any>;
    postCommand(command: Command): Promise<any>;
    getHello(): string;
}

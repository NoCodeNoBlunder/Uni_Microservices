import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getQuery(key: string): Promise<string>;
    getHello(): string;
}

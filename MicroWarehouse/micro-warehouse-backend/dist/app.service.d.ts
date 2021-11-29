import { BuilderService } from './modules/builder/builder.service';
import Command from './modules/builder/command';
export declare class AppService {
    private readonly buildService;
    constructor(buildService: BuilderService);
    getQuery(key: string): Promise<any>;
    getHello(): string;
    handleCommand(command: Command): Promise<string | Command>;
}

import { OnModuleInit } from '@nestjs/common';
import { BuildEvent } from './build-event.schema';
import { Model } from 'mongoose';
export declare class BuilderService implements OnModuleInit {
    private buildEventModel;
    constructor(buildEventModel: Model<BuildEvent>);
    onModuleInit(): Promise<void>;
    getByTag(tag: string): Promise<(import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    store(event: BuildEvent): Promise<import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    clear(): import("mongoose").Query<any, import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, BuildEvent>;
    storePalette(palette: any): Promise<any>;
}

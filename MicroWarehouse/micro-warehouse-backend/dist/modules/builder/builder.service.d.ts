import { BuildEvent } from './build-event.schema';
import { Model } from 'mongoose';
export declare class BuilderService {
    private buildEventModel;
    constructor(buildEventModel: Model<BuildEvent>);
    store(event: BuildEvent): Promise<import("mongoose").Document<any, any, BuildEvent> & BuildEvent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    clear(): Promise<void>;
}

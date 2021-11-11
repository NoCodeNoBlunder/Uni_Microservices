import { Schema as MongooseSchema } from 'mongoose';
export declare class BuildEvent {
    eventType: string;
    blockId: string;
    time: string;
    tags: string[];
    payload: any;
}
export declare const BuildEventSchema: MongooseSchema<import("mongoose").Document<BuildEvent, any, any>, import("mongoose").Model<import("mongoose").Document<BuildEvent, any, any>, any, any, any>, {}>;

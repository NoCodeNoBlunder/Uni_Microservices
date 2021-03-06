"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderModule = void 0;
const common_1 = require("@nestjs/common");
const builder_service_1 = require("./builder.service");
const mongoose_1 = require("@nestjs/mongoose");
const build_event_schema_1 = require("./build-event.schema");
const palette_schema_1 = require("./palette.schema");
const pick_task_schema_1 = require("./pick-task.schema");
const axios_1 = require("@nestjs/axios");
let BuilderModule = class BuilderModule {
};
BuilderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forFeature([
                { name: 'eventStore', schema: build_event_schema_1.BuildEventSchema },
                { name: 'pickTaskStore', schema: pick_task_schema_1.PickTaskSchema },
                { name: 'paletteStore', schema: palette_schema_1.PaletteSchema },
            ]),
        ],
        providers: [builder_service_1.BuilderService],
        exports: [builder_service_1.BuilderService],
    })
], BuilderModule);
exports.BuilderModule = BuilderModule;
//# sourceMappingURL=builder.module.js.map
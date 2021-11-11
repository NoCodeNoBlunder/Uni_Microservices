"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildEventSchema = exports.BuildEvent = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let BuildEvent = class BuildEvent {
};
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], BuildEvent.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], BuildEvent.prototype, "blockId", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", String)
], BuildEvent.prototype, "time", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true }),
    __metadata("design:type", Array)
], BuildEvent.prototype, "tags", void 0);
__decorate([
    (0, mongoose_2.Prop)({ required: true, type: mongoose_1.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], BuildEvent.prototype, "payload", void 0);
BuildEvent = __decorate([
    (0, mongoose_2.Schema)()
], BuildEvent);
exports.BuildEvent = BuildEvent;
exports.BuildEventSchema = mongoose_2.SchemaFactory.createForClass(BuildEvent);
//# sourceMappingURL=build-event.schema.js.map
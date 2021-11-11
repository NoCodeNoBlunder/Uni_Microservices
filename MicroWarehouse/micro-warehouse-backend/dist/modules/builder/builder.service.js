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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BuilderService = class BuilderService {
    constructor(buildEventModel) {
        this.buildEventModel = buildEventModel;
        this.clear();
        this.store({
            blockId: 'pal042',
            time: '13:48:00',
            eventType: 'PaletteStored',
            tags: ['palettes', 'red shoes'],
            payload: {
                barcode: 'pal042',
                product: 'red shoes',
                amount: 10,
                location: 'shelf 42',
            },
        });
        this.store({
            blockId: 'pal044',
            time: '14:50:00',
            eventType: 'PaletteStored',
            tags: ['palettes', 'blue shoes'],
            payload: {
                barcode: 'pal044',
                product: 'blue shoes',
                amount: 2,
                location: 'shelf 42',
            },
        });
    }
    async store(event) {
        const filter = { blockId: event.blockId };
        return this.buildEventModel.findOneAndUpdate(filter, event, {
            upsert: true,
        });
    }
    async clear() {
        return this.buildEventModel.db.dropCollection('eventstores');
    }
};
BuilderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('eventStore')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BuilderService);
exports.BuilderService = BuilderService;
//# sourceMappingURL=builder.service.js.map
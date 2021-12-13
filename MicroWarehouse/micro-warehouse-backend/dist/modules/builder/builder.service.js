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
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BuilderService = class BuilderService {
    constructor(httpService, buildEventModel) {
        this.httpService = httpService;
        this.buildEventModel = buildEventModel;
        this.subScriberUrls = [];
    }
    async onModuleInit() {
        await this.clear();
    }
    getByTag(tag) {
        console.log('getByTag called with ' + tag);
        const list = this.buildEventModel.find({ tags: tag }).exec();
        return list;
    }
    async store(event) {
        const placeholder = await this.buildEventModel
            .findOneAndUpdate({ blockId: event.blockId }, { blockId: event.blockId, $setOnInsert: { time: '' } }, { upsert: true, new: true })
            .exec();
        const newEvent = await this.buildEventModel
            .findOneAndUpdate({ blockId: event.blockId, name: { $lt: event.time } }, event, { new: true })
            .exec();
        return newEvent != null;
    }
    clear() {
        return this.buildEventModel.remove();
    }
    async storePalette(palette) {
        palette.amount = Number(palette.amount);
        const event = {
            blockId: palette.barcode,
            time: new Date().toISOString(),
            eventType: 'PaletteStored',
            tags: ['palettes', palette.product],
            payload: palette,
        };
        try {
            const storeSuccess = await this.store(event);
            const amount = await this.computeAmount(palette.product);
            if (storeSuccess) {
                const newEvent = {
                    eventType: 'productStored',
                    blockId: palette.product,
                    time: event.time,
                    tags: [],
                    payload: {
                        product: palette.product,
                        amount: amount,
                    },
                };
                await this.store(newEvent);
                this.publish(newEvent);
            }
        }
        catch (error) {
            console.log(`store did not work ${error}`);
        }
        console.log(`builderService.storePalette stores ${JSON.stringify(event, null, 3)}`);
        return palette;
    }
    async handleSubscription(subscription) {
        if (!this.subScriberUrls.includes(subscription.subscriberUrl)) {
            this.subScriberUrls.push(subscription.subscriberUrl);
        }
        const eventList = await this.buildEventModel
            .find({
            eventType: 'productStored',
            time: { $gt: subscription.lastEventTime },
        })
            .exec();
        return eventList;
    }
    async computeAmount(productName) {
        const paletteStoredList = await this.buildEventModel
            .find({
            eventType: 'PaletteStored',
            'payload.product': productName,
        })
            .exec();
        let sum = 0;
        for (const e of paletteStoredList) {
            sum += e.payload.amount;
        }
        return sum;
    }
    publish(newEvent) {
        console.log('build service publish subsribersUrls:\n' +
            JSON.stringify(this.subScriberUrls, null, 3));
        const oldUrls = this.subScriberUrls;
        this.subScriberUrls = [];
        for (const subscriberUrl of oldUrls) {
            this.httpService.post(subscriberUrl, newEvent).subscribe((response) => {
                console.log('Warehouse builder service publish post response is \n' +
                    JSON.stringify(response.data, null, 3));
                this.subScriberUrls.push(subscriberUrl);
            }, (error) => {
                console.log('build service publish error: \n' + JSON.stringify(error, null, 3));
            });
        }
    }
};
BuilderService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('eventStore')),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_2.Model])
], BuilderService);
exports.BuilderService = BuilderService;
//# sourceMappingURL=builder.service.js.map
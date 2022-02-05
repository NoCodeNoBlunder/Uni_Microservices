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
var BuilderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuilderService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BuilderService = BuilderService_1 = class BuilderService {
    constructor(httpService, buildEventModel, pickTaskModel, paletteModel) {
        this.httpService = httpService;
        this.buildEventModel = buildEventModel;
        this.pickTaskModel = pickTaskModel;
        this.paletteModel = paletteModel;
        this.subscriberUrls = [];
        this.logger = new common_1.Logger(BuilderService_1.name);
    }
    async onModuleInit() {
        await this.clear();
    }
    async getPalettes() {
        const c = this.paletteModel.find().exec();
        console.log('[builder.service] getPalettes Query result: ' +
            JSON.stringify(c, null, 3));
        return c;
    }
    async getOrdersToPick() {
        const c = this.pickTaskModel.find({}).exec();
        console.log('[builder.service] getOrdersToPick Query result: ' +
            JSON.stringify(c, null, 3));
        return c;
    }
    async orderToPick(orderID) {
        console.log('orderToPick called with ID:' + orderID);
        const c = await this.pickTaskModel.findOne({ code: orderID }).exec();
        console.log('Result', JSON.stringify(c, null, 3));
        return c;
    }
    getByTag(tag) {
        console.log('getByTag called with ' + tag);
        return this.buildEventModel.find({ tags: tag }).exec();
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
                await this.storeModelPalette(palette);
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
        console.log('[builder.service] handleSubscription with subscriberUrl: ' +
            subscription.subscriberUrl);
        if (!this.subscriberUrls.includes(subscription.subscriberUrl)) {
            this.subscriberUrls.push(subscription.subscriberUrl);
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
        console.log('[builder.service] publish to SubscriberUrls:\n' +
            JSON.stringify(this.subscriberUrls, null, 3));
        const oldUrls = this.subscriberUrls;
        this.subscriberUrls = [];
        for (const subscriberUrl of oldUrls) {
            this.httpService.post(subscriberUrl, newEvent).subscribe((response) => {
                console.log('Warehouse builder service publish post response is \n' +
                    JSON.stringify(response.data, null, 3));
                this.subscriberUrls.push(subscriberUrl);
            }, (error) => {
                console.log('[builder.service] publish error: \n' +
                    JSON.stringify(error, null, 3));
            });
        }
    }
    async handleProductOrdered(event) {
        console.log('[builder.service] handleProductOrdered is called with event:' +
            JSON.stringify(event, null, 3));
        const storeSuccess = await this.store(event);
        if (storeSuccess) {
            console.log('[builder.service] in handleProductOrdered event was stored successfully!');
            const params = event.payload;
            const productPalettes = await this.paletteModel
                .find({ product: params.product })
                .exec();
            const locations = [];
            for (const pal of productPalettes) {
                if (pal.location != null) {
                    locations.push(pal.location);
                }
            }
            const pickTask = {
                code: params.code,
                product: params.product,
                address: params.customer + ', ' + params.address,
                locations: locations,
                state: 'order placed',
            };
            const result = this.pickTaskModel
                .findOneAndUpdate({ code: params.code }, pickTask, {
                upsert: true,
                new: true,
            })
                .exec();
        }
        return 200;
    }
    async handlePickDone(params) {
        console.log('[builder.service] handlePickDone called wtih: ' +
            JSON.stringify(params, null, 3));
        let barCode = params.code;
        if (params.state === 'picking') {
            const pal = await this.paletteModel
                .findOneAndUpdate({ location: params.location }, {
                $inc: { amount: -1 },
            }, { new: true })
                .exec();
            this.logger.log(`handlePickDone new pal \n${JSON.stringify(pal, null, 3)}`);
            barCode = pal.barcode;
        }
        const pick = await this.pickTaskModel
            .findOneAndUpdate({ code: params.code }, {
            palette: barCode,
            locations: [params.location],
            state: params.state,
        }, { new: true })
            .exec();
        const event = {
            eventType: 'orderPicked',
            blockId: pick.code,
            time: new Date().toISOString(),
            tags: ['orders', pick.code],
            payload: {
                code: pick.code,
                state: pick.state,
            },
        };
        const storeSuccess = await this.store(event);
        this.publish(event);
    }
    async handleProductShipped(params) {
        console.log('[builder.service] handleProductShipped called with: ' +
            JSON.stringify(params, null, 3));
        const pick = await this.pickTaskModel
            .findOneAndUpdate({ code: params.code }, {
            state: params.state,
        }, { new: true })
            .exec();
        const event = {
            eventType: 'orderPicked',
            blockId: pick.code,
            time: new Date().toISOString(),
            tags: ['orders', pick.code],
            payload: {
                code: pick.code,
                state: pick.state,
            },
        };
        const storeSuccess = await this.store(event);
        this.publish(event);
    }
    async storeModelPalette(palette) {
        await this.paletteModel
            .findOneAndUpdate({ barcode: palette.barcode }, palette, { upsert: true })
            .exec();
    }
    async clear() {
        await this.paletteModel.deleteMany();
        await this.buildEventModel.deleteMany();
        await this.pickTaskModel.deleteMany();
    }
    async reset() {
        await this.clear();
    }
};
BuilderService = BuilderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('eventStore')),
    __param(2, (0, mongoose_1.InjectModel)('pickTaskStore')),
    __param(3, (0, mongoose_1.InjectModel)('paletteStore')),
    __metadata("design:paramtypes", [axios_1.HttpService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], BuilderService);
exports.BuilderService = BuilderService;
//# sourceMappingURL=builder.service.js.map
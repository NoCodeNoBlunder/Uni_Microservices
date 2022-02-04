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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const builder_service_1 = require("./modules/builder/builder.service");
let AppService = class AppService {
    constructor(modelBuilderService) {
        this.modelBuilderService = modelBuilderService;
    }
    async getQuery(key) {
        console.log('[app.service] getQuery called with key:' + key);
        if (key === 'paletteStored') {
        }
        else if (key === 'OrdersToPick') {
            const c = await this.modelBuilderService.getOrdersToPick();
            console.log('app.service getQuery' + JSON.stringify(c, null, 3));
            return c;
        }
        else if (key.startsWith('OrdersToPick_')) {
            const orderID = key.substring('OrdersToPick_'.length);
            return await this.modelBuilderService.orderToPick(orderID);
        }
        else {
            const list = await this.modelBuilderService.getByTag(key);
            return {
                key: key,
                result: list,
            };
        }
    }
    async getEvent(event) {
        const list = await this.modelBuilderService.getByTag(event);
        return {
            event: event,
            result: list,
        };
    }
    async handleCommand(command) {
        if (command.opCode === 'storePalette') {
            await this.modelBuilderService.storePalette(command.parameters);
            return command;
        }
        else {
            return `cannot handle ${command.opCode}`;
        }
    }
    async handlePickDone(params) {
        await this.modelBuilderService.handlePickDone(params);
        return 200;
    }
    async handleEvent(event) {
        console.log('[app.service] handleEvent called with event: ' +
            JSON.stringify(event, null, 3));
        if (event.eventType === 'productOrdered') {
            return await this.modelBuilderService.handleProductOrdered(event);
        }
        return {
            error: '[app.service] handleEvent Backend cannot handle event: ' +
                event.eventType,
        };
    }
    async handleSubscription(subscription) {
        return await this.modelBuilderService.handleSubscription(subscription);
    }
    async getReset() {
        {
            await this.modelBuilderService.reset();
            return 'The Warehouse database was cleared.';
        }
    }
    getHello() {
        return 'Hello Course!';
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [builder_service_1.BuilderService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map
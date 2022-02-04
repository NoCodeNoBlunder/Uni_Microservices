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
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const command_1 = require("./modules/builder/command");
const subscription_1 = require("./modules/builder/subscription");
const axios_1 = require("@nestjs/axios");
const build_event_schema_1 = require("./modules/builder/build-event.schema");
let AppController = AppController_1 = class AppController {
    constructor(appService, httpService) {
        this.appService = appService;
        this.httpService = httpService;
        this.logger = new common_1.Logger(AppController_1.name);
    }
    onModuleInit() {
        this.subscribeAtShop(false);
    }
    subscribeAtShop(isSubscribed) {
        this.httpService
            .post('http://localhost:3100/subscribe', {
            subscriberUrl: 'http://localhost:3000/event',
            lastEventTime: '0',
            isReturnSubscription: isSubscribed,
        })
            .subscribe(async (response) => {
            try {
                const eventList = response.data;
                console.log('[app.controller] subscribeAtShop Subscribers: ' +
                    JSON.stringify(eventList, null, 3));
                for (const event of eventList) {
                    console.log('AppController onModuleInit subscribe handle' +
                        JSON.stringify(event, null, 3));
                    await this.appService.handleEvent(event);
                }
                console.log('[app.controller] Subscription from Warehouse to Shop succeeded.');
            }
            catch (error) {
                console.log('AppController onModuleInit subscribe handleEvent error' +
                    JSON.stringify(error, null, 3));
            }
        }, (error) => {
            console.log('[app.controller] Cannot subscribe at shop. Shop might not be running.');
        });
    }
    async postSubscribe(subscription) {
        try {
            if (!subscription.isReturnSubscription) {
                this.subscribeAtShop(true);
            }
            return await this.appService.handleSubscription(subscription);
        }
        catch (error) {
            return error;
        }
    }
    async postEvent(event) {
        console.log('[app.contoller] postEvent called with event: ' +
            JSON.stringify(event, null, 3));
        try {
            return await this.appService.handleEvent(event);
        }
        catch (error) {
            return error;
        }
    }
    async getEvent(product) {
        return await this.appService.getEvent(product);
    }
    async getQuery(key) {
        console.log(`[app.controller] getQuery called with key ${key}`);
        const result = await this.appService.getQuery(key);
        console.log(`[app.controller] getQuery result: ${JSON.stringify(result, null, 3)}\n`);
        return result;
    }
    async postCommand(command) {
        try {
            console.log(`got command ${JSON.stringify(command, null, 3)}`);
            return await this.appService.handleCommand(command);
        }
        catch (error) {
            return error;
        }
    }
    async postPickDone(params) {
        console.log('[app.controller] postPickDone called.');
        try {
            this.logger.log(`\npostPickDone got ${JSON.stringify(params, null, 3)}`);
            return await this.appService.handlePickDone(params);
        }
        catch (error) {
            return error;
        }
    }
    async getReset() {
        return await this.appService.getReset();
    }
    getHello() {
        return this.appService.getHello();
    }
};
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_1.default]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postSubscribe", null);
__decorate([
    (0, common_1.Post)('event'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [build_event_schema_1.BuildEvent]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postEvent", null);
__decorate([
    (0, common_1.Get)('event'),
    __param(0, (0, common_1.Param)('product')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getEvent", null);
__decorate([
    (0, common_1.Get)('query/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getQuery", null);
__decorate([
    (0, common_1.Post)('cmd'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [command_1.default]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postCommand", null);
__decorate([
    (0, common_1.Post)('cmd/pickDone'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postPickDone", null);
__decorate([
    (0, common_1.Get)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getReset", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
AppController = AppController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        axios_1.HttpService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map
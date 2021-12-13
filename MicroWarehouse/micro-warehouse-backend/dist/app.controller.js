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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const command_1 = require("./modules/builder/command");
const subscription_1 = require("./modules/builder/subscription");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getQuery(key) {
        console.log(`appController.getQuery called with key ${key}`);
        const result = await this.appService.getQuery(key);
        console.log(`appController.getQuery done ${JSON.stringify(result, null, 3)}\n`);
        return result;
    }
    async postCommand(command) {
        try {
            console.log(`got command ${JSON.stringify(command, null, 3)}`);
            const c = await this.appService.handleCommand(command);
            return c;
        }
        catch (error) {
            return error;
        }
    }
    async postSubscribe(subscripiton) {
        try {
            const c = await this.appService.handleSubscription(subscripiton);
            return c;
        }
        catch (error) {
            return error;
        }
    }
    getHello() {
        return this.appService.getHello();
    }
};
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
    (0, common_1.Post)('subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscription_1.default]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "postSubscribe", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map
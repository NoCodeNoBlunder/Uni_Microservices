"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
class AppService {
    constructor(modelBuilderService) {
        this.modelBuilderService = modelBuilderService;
        this.logger = new common_1.Logger(AppService.name);
    }
    async getQuery(key) {
        console.log('getQuery ' + key);
        const list = await this.modelBuilderService.getByTag(key);
        return {
            key: key,
            result: list,
        };
    }
    async handleEvent(event) {
        if (event.eventType === 'productOrdered') {
            return await this.modelBuilderService.handleProductOrdered(event);
        }
        return {
            error: 'shop backend does not know how to hanlde ' + event.eventType,
        };
    }
    async handleSubscription(subscription) {
        return await this.modelBuilderService.handleSubscription(subscription);
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
    getHello() {
        return 'Hello Course!';
    }
}
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map
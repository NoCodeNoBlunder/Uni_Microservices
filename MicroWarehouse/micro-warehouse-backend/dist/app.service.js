"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Hello Course!';
    }
    getQuery(key) {
        const answer = {
            key: key,
            result: [
                {
                    blockId: 'pal001',
                    time: '12:00:00',
                    evenType: 'PaletteStored',
                    tags: ['palettes', 'red shoes'],
                    payload: {
                        barcode: 'pal001',
                        product: 'red shoes',
                        amount: 10,
                        location: 'shelf 42',
                    },
                },
                {
                    blockId: 'pal002',
                    time: '12:01:00',
                    evenType: 'PaletteStored',
                    tags: ['palettes', 'red shoes'],
                    payload: {
                        barcode: 'pal002',
                        product: 'red shoes',
                        amount: 10,
                        location: 'shelf 23',
                    },
                },
            ],
        };
        return answer;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map
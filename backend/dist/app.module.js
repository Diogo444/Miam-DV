"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const menus_module_1 = require("./menus/menus.module");
const proverbes_module_1 = require("./proverbes/proverbes.module");
const admin_module_1 = require("./admin/admin.module");
const suggestions_module_1 = require("./suggestions/suggestions.module");
const login_module_1 = require("./login/login.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'miammi',
                password: 'BDDmiammi',
                database: 'miamdv',
                autoLoadEntities: true,
                synchronize: true,
            }),
            menus_module_1.MenusModule,
            proverbes_module_1.ProverbesModule,
            admin_module_1.AdminModule,
            suggestions_module_1.SuggestionsModule,
            login_module_1.LoginModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
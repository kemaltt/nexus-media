"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccountModule = void 0;
const common_1 = require("@nestjs/common");
const social_account_service_1 = require("./social-account.service");
const social_account_controller_1 = require("./social-account.controller");
let SocialAccountModule = class SocialAccountModule {
};
exports.SocialAccountModule = SocialAccountModule;
exports.SocialAccountModule = SocialAccountModule = __decorate([
    (0, common_1.Module)({
        providers: [social_account_service_1.SocialAccountService],
        controllers: [social_account_controller_1.SocialAccountController],
        exports: [social_account_service_1.SocialAccountService],
    })
], SocialAccountModule);
//# sourceMappingURL=social-account.module.js.map
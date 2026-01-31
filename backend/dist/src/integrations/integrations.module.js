"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsModule = void 0;
const common_1 = require("@nestjs/common");
const youtube_service_1 = require("./youtube/youtube.service");
const meta_service_1 = require("./meta/meta.service");
const tiktok_service_1 = require("./tiktok/tiktok.service");
const x_service_1 = require("./x/x.service");
const integrations_controller_1 = require("./integrations.controller");
const social_account_module_1 = require("../social-account/social-account.module");
let IntegrationsModule = class IntegrationsModule {
};
exports.IntegrationsModule = IntegrationsModule;
exports.IntegrationsModule = IntegrationsModule = __decorate([
    (0, common_1.Module)({
        imports: [social_account_module_1.SocialAccountModule],
        controllers: [integrations_controller_1.IntegrationsController],
        providers: [youtube_service_1.YoutubeService, meta_service_1.MetaService, tiktok_service_1.TiktokService, x_service_1.XService],
        exports: [youtube_service_1.YoutubeService, meta_service_1.MetaService, tiktok_service_1.TiktokService, x_service_1.XService],
    })
], IntegrationsModule);
//# sourceMappingURL=integrations.module.js.map
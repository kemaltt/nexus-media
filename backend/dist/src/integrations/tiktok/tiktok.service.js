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
var TiktokService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiktokService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const social_account_service_1 = require("../../social-account/social-account.service");
const client_1 = require("@prisma/client");
let TiktokService = TiktokService_1 = class TiktokService {
    configService;
    socialAccountService;
    logger = new common_1.Logger(TiktokService_1.name);
    constructor(configService, socialAccountService) {
        this.configService = configService;
        this.socialAccountService = socialAccountService;
    }
    getAuthUrl(userId) {
        const clientKey = this.configService.get('TIKTOK_CLIENT_KEY');
        const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/tiktok/callback`;
        const scopes = ['user.info.basic', 'video.publish', 'video.upload'];
        return `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scopes.join(',')}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${userId}`;
    }
    async handleCallback(code, userId) {
        const clientKey = this.configService.get('TIKTOK_CLIENT_KEY');
        const clientSecret = this.configService.get('TIKTOK_CLIENT_SECRET');
        const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/tiktok/callback`;
        const tokenResponse = await axios_1.default.post('https://open.tiktokapis.com/v2/oauth/token/', new URLSearchParams({
            client_key: clientKey,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const { access_token, refresh_token, expires_in, open_id, scope } = tokenResponse.data;
        const userResponse = await axios_1.default.get('https://open.tiktokapis.com/v2/user/info/', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                fields: 'open_id,union_id,avatar_url,display_name',
            },
        });
        const userData = userResponse.data.data.user;
        return this.socialAccountService.addAccount(userId, {
            platform: client_1.Platform.TIKTOK,
            platformId: open_id,
            accessToken: access_token,
            refreshToken: refresh_token,
            tokenExpires: new Date(Date.now() + expires_in * 1000),
            tokenType: client_1.TokenType.BEARER,
            scopes: scope ? scope.split(',') : [],
            username: userData.display_name,
            profileImage: userData.avatar_url,
        });
    }
};
exports.TiktokService = TiktokService;
exports.TiktokService = TiktokService = TiktokService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        social_account_service_1.SocialAccountService])
], TiktokService);
//# sourceMappingURL=tiktok.service.js.map
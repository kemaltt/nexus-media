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
var MetaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const social_account_service_1 = require("../../social-account/social-account.service");
const client_1 = require("@prisma/client");
let MetaService = MetaService_1 = class MetaService {
    configService;
    socialAccountService;
    logger = new common_1.Logger(MetaService_1.name);
    constructor(configService, socialAccountService) {
        this.configService = configService;
        this.socialAccountService = socialAccountService;
    }
    getAuthUrl(userId) {
        const appId = this.configService.get('FACEBOOK_APP_ID');
        const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/meta/callback`;
        const scopes = [
            'pages_manage_posts',
            'pages_manage_engagement',
            'pages_show_list',
            'pages_read_engagement',
            'instagram_basic',
            'instagram_content_publish',
            'instagram_manage_comments',
            'public_profile',
            'email',
        ];
        return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${userId}&scope=${scopes.join(',')}`;
    }
    async handleCallback(code, userId) {
        const appId = this.configService.get('FACEBOOK_APP_ID');
        const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
        const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/meta/callback`;
        const tokenResponse = await axios_1.default.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: appId,
                client_secret: appSecret,
                redirect_uri: redirectUri,
                code,
            },
        });
        const userToken = tokenResponse.data.access_token;
        const longLivedTokenResponse = await axios_1.default.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: appId,
                client_secret: appSecret,
                fb_exchange_token: userToken,
            },
        });
        const longLivedUserToken = longLivedTokenResponse.data.access_token;
        const pagesResponse = await axios_1.default.get('https://graph.facebook.com/v18.0/me/accounts', {
            params: { access_token: longLivedUserToken },
        });
        const accounts = [];
        for (const page of pagesResponse.data.data) {
            const fbAccount = await this.socialAccountService.addAccount(userId, {
                platform: client_1.Platform.FACEBOOK,
                platformId: page.id,
                accessToken: page.access_token,
                username: page.name,
                tokenType: client_1.TokenType.BEARER,
                scopes: [],
            });
            accounts.push(fbAccount);
            try {
                const igResponse = await axios_1.default.get(`https://graph.facebook.com/v18.0/${page.id}`, {
                    params: {
                        fields: 'instagram_business_account{id,username,profile_picture_url}',
                        access_token: page.access_token,
                    },
                });
                const igAccountData = igResponse.data.instagram_business_account;
                if (igAccountData) {
                    const igAccount = await this.socialAccountService.addAccount(userId, {
                        platform: client_1.Platform.INSTAGRAM,
                        platformId: igAccountData.id,
                        accessToken: page.access_token,
                        username: igAccountData.username,
                        profileImage: igAccountData.profile_picture_url,
                        tokenType: client_1.TokenType.BEARER,
                        scopes: [],
                    });
                    accounts.push(igAccount);
                }
            }
            catch (e) {
                this.logger.warn(`No Instagram account linked to page ${page.id}`);
            }
        }
        return accounts;
    }
};
exports.MetaService = MetaService;
exports.MetaService = MetaService = MetaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        social_account_service_1.SocialAccountService])
], MetaService);
//# sourceMappingURL=meta.service.js.map
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
var YoutubeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
const social_account_service_1 = require("../../social-account/social-account.service");
const client_1 = require("@prisma/client");
let YoutubeService = YoutubeService_1 = class YoutubeService {
    configService;
    socialAccountService;
    logger = new common_1.Logger(YoutubeService_1.name);
    oauth2Client;
    constructor(configService, socialAccountService) {
        this.configService = configService;
        this.socialAccountService = socialAccountService;
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(this.configService.get('GOOGLE_CLIENT_ID'), this.configService.get('GOOGLE_CLIENT_SECRET'), `${this.configService.get('BACKEND_URL')}/integrations/youtube/callback`);
    }
    getAuthUrl(userId) {
        const scopes = [
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/userinfo.profile',
        ];
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
            state: userId,
        });
    }
    async handleCallback(code, userId) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        const youtube = googleapis_1.google.youtube({ version: 'v3', auth: this.oauth2Client });
        const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: this.oauth2Client });
        const [userResponse, channelResponse] = await Promise.all([
            oauth2.userinfo.get(),
            youtube.channels.list({ part: ['snippet'], mine: true }),
        ]);
        const platformId = channelResponse.data.items?.[0]?.id || userResponse.data.id;
        const username = channelResponse.data.items?.[0]?.snippet?.title || userResponse.data.name;
        const profileImage = channelResponse.data.items?.[0]?.snippet?.thumbnails?.default?.url ||
            userResponse.data.picture;
        return this.socialAccountService.addAccount(userId, {
            platform: client_1.Platform.YOUTUBE,
            platformId,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenExpires: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
            tokenType: client_1.TokenType.BEARER,
            scopes: tokens.scope ? tokens.scope.split(' ') : [],
            username,
            profileImage,
        });
    }
};
exports.YoutubeService = YoutubeService;
exports.YoutubeService = YoutubeService = YoutubeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        social_account_service_1.SocialAccountService])
], YoutubeService);
//# sourceMappingURL=youtube.service.js.map
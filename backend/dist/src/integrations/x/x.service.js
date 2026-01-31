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
var XService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const crypto = require("crypto");
const social_account_service_1 = require("../../social-account/social-account.service");
const client_1 = require("@prisma/client");
let XService = XService_1 = class XService {
    configService;
    socialAccountService;
    logger = new common_1.Logger(XService_1.name);
    verifiers = new Map();
    constructor(configService, socialAccountService) {
        this.configService = configService;
        this.socialAccountService = socialAccountService;
    }
    getAuthUrl(userId) {
        const clientKey = this.configService.get('X_API_KEY');
        const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/x/callback`;
        const codeVerifier = crypto.randomBytes(32).toString('base64url');
        const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');
        const state = `${userId}_${crypto.randomBytes(8).toString('hex')}`;
        this.verifiers.set(state, codeVerifier);
        setTimeout(() => this.verifiers.delete(state), 10 * 60 * 1000);
        const scopes = [
            'tweet.read',
            'tweet.write',
            'users.read',
            'offline.access',
        ];
        const url = new URL('https://twitter.com/i/oauth2/authorize');
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('client_id', clientKey);
        url.searchParams.append('redirect_uri', redirectUri);
        url.searchParams.append('scope', scopes.join(' '));
        url.searchParams.append('state', state);
        url.searchParams.append('code_challenge', codeChallenge);
        url.searchParams.append('code_challenge_method', 'S256');
        return url.toString();
    }
    async handleCallback(code, state) {
        const userId = state.split('_')[0];
        const codeVerifier = this.verifiers.get(state);
        if (!codeVerifier) {
            throw new Error('Invalid or expired state/code_verifier');
        }
        const clientKey = this.configService.get('X_API_KEY');
        const clientSecret = this.configService.get('X_API_SECRET');
        const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/x/callback`;
        const authHeader = Buffer.from(`${clientKey}:${clientSecret}`).toString('base64');
        const tokenResponse = await axios_1.default.post('https://api.twitter.com/2/oauth2/token', new URLSearchParams({
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${authHeader}`,
            },
        });
        const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;
        const userResponse = await axios_1.default.get('https://api.twitter.com/2/users/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            params: {
                'user.fields': 'id,name,username,profile_image_url',
            },
        });
        const userData = userResponse.data.data;
        this.verifiers.delete(state);
        return this.socialAccountService.addAccount(userId, {
            platform: client_1.Platform.X,
            platformId: userData.id,
            accessToken: access_token,
            refreshToken: refresh_token,
            tokenExpires: new Date(Date.now() + expires_in * 1000),
            tokenType: client_1.TokenType.USER_CONTEXT,
            scopes: scope ? scope.split(' ') : [],
            username: userData.username,
            profileImage: userData.profile_image_url,
        });
    }
};
exports.XService = XService;
exports.XService = XService = XService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        social_account_service_1.SocialAccountService])
], XService);
//# sourceMappingURL=x.service.js.map
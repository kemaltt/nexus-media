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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAccountService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const security_service_1 = require("../security/security.service");
let SocialAccountService = class SocialAccountService {
    prisma;
    securityService;
    constructor(prisma, securityService) {
        this.prisma = prisma;
        this.securityService = securityService;
    }
    async upsertAccount(userId, data) {
        const { platform, platformId, accessToken, refreshToken, tokenExpires, tokenType, scopes, status, username, profileImage, lastSyncedAt, } = data;
        const encryptedAccessToken = this.securityService.encrypt(accessToken);
        const encryptedRefreshToken = refreshToken
            ? this.securityService.encrypt(refreshToken)
            : null;
        const accountData = {
            userId,
            platform: platform,
            platformId,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            tokenExpires: tokenExpires ? new Date(tokenExpires) : null,
            tokenType,
            scopes: scopes || [],
            status: status || 'ACTIVE',
            username,
            profileImage,
            lastSyncedAt: lastSyncedAt ? new Date(lastSyncedAt) : null,
        };
        return this.prisma.socialAccount.upsert({
            where: {
                userId_platform_platformId: {
                    userId,
                    platform: platform,
                    platformId,
                },
            },
            update: {
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                tokenExpires: tokenExpires ? new Date(tokenExpires) : null,
                tokenType: accountData.tokenType,
                scopes: accountData.scopes,
                status: accountData.status,
                username,
                profileImage,
                lastSyncedAt: accountData.lastSyncedAt,
            },
            create: accountData,
        });
    }
    async addAccount(userId, data) {
        return this.upsertAccount(userId, data);
    }
    async getAccounts(userId) {
        const accounts = await this.prisma.socialAccount.findMany({
            where: { userId },
            select: {
                id: true,
                platform: true,
                platformId: true,
                username: true,
                profileImage: true,
                createdAt: true,
            },
        });
        return accounts;
    }
    async removeAccount(userId, accountId) {
        const account = await this.prisma.socialAccount.findFirst({
            where: { id: accountId, userId },
        });
        if (!account) {
            throw new common_1.NotFoundException('Account not found');
        }
        return this.prisma.socialAccount.delete({
            where: { id: accountId },
        });
    }
};
exports.SocialAccountService = SocialAccountService;
exports.SocialAccountService = SocialAccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        security_service_1.SecurityService])
], SocialAccountService);
//# sourceMappingURL=social-account.service.js.map
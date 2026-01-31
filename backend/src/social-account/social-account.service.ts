import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';
import { Platform } from '@prisma/client';

@Injectable()
export class SocialAccountService {
  constructor(
    private prisma: PrismaService,
    private securityService: SecurityService,
  ) {}

  async upsertAccount(userId: string, data: any) {
    const {
      platform,
      platformId,
      accessToken,
      refreshToken,
      tokenExpires,
      tokenType,
      scopes,
      status,
      username,
      profileImage,
      lastSyncedAt,
    } = data;

    const encryptedAccessToken = this.securityService.encrypt(accessToken);
    const encryptedRefreshToken = refreshToken
      ? this.securityService.encrypt(refreshToken)
      : null;

    const accountData = {
      userId,
      platform: platform as Platform,
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
          platform: platform as Platform,
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

  // Alias for backward compatibility if needed, but we should update callers
  async addAccount(userId: string, data: any) {
    return this.upsertAccount(userId, data);
  }

  async getAccounts(userId: string) {
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

  async removeAccount(userId: string, accountId: string) {
    const account = await this.prisma.socialAccount.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.socialAccount.delete({
      where: { id: accountId },
    });
  }
}

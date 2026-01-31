import { ConfigService } from '@nestjs/config';
import { SocialAccountService } from '../../social-account/social-account.service';
export declare class XService {
    private configService;
    private socialAccountService;
    private readonly logger;
    private verifiers;
    constructor(configService: ConfigService, socialAccountService: SocialAccountService);
    getAuthUrl(userId: string): string;
    handleCallback(code: string, state: string): Promise<{
        platform: import(".prisma/client").$Enums.Platform;
        platformId: string;
        accessToken: string;
        refreshToken: string | null;
        tokenExpires: Date | null;
        tokenType: import(".prisma/client").$Enums.TokenType;
        scopes: string[];
        status: import(".prisma/client").$Enums.SocialAccountStatus;
        username: string | null;
        profileImage: string | null;
        lastSyncedAt: Date | null;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}

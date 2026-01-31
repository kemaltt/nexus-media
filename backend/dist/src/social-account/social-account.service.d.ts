import { PrismaService } from '../prisma.service';
import { SecurityService } from '../security/security.service';
export declare class SocialAccountService {
    private prisma;
    private securityService;
    constructor(prisma: PrismaService, securityService: SecurityService);
    upsertAccount(userId: string, data: any): Promise<{
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
    addAccount(userId: string, data: any): Promise<{
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
    getAccounts(userId: string): Promise<{
        platform: import(".prisma/client").$Enums.Platform;
        platformId: string;
        username: string | null;
        profileImage: string | null;
        id: string;
        createdAt: Date;
    }[]>;
    removeAccount(userId: string, accountId: string): Promise<{
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

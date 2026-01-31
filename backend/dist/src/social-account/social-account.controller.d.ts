import { SocialAccountService } from './social-account.service';
export declare class SocialAccountController {
    private socialAccountService;
    constructor(socialAccountService: SocialAccountService);
    addAccount(req: any, body: any): Promise<{
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
    getAccounts(req: any): Promise<{
        platform: import(".prisma/client").$Enums.Platform;
        platformId: string;
        username: string | null;
        profileImage: string | null;
        id: string;
        createdAt: Date;
    }[]>;
    removeAccount(req: any, id: string): Promise<{
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

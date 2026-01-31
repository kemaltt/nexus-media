import { ConfigService } from '@nestjs/config';
import { SocialAccountService } from '../../social-account/social-account.service';
export declare class MetaService {
    private configService;
    private socialAccountService;
    private readonly logger;
    constructor(configService: ConfigService, socialAccountService: SocialAccountService);
    getAuthUrl(userId: string): string;
    handleCallback(code: string, userId: string): Promise<any[]>;
}

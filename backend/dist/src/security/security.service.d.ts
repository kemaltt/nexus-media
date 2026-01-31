import { ConfigService } from '@nestjs/config';
export declare class SecurityService {
    private configService;
    private readonly algorithm;
    private readonly key;
    constructor(configService: ConfigService);
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
}

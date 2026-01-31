import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    private getHtmlTemplate;
    sendVerificationEmail(to: string, code: string): Promise<void>;
    sendPasswordResetEmail(to: string, code: string): Promise<void>;
    sendPasswordChangeEmail(to: string, code: string): Promise<void>;
}

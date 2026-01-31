import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    register(data: any): Promise<{
        message: string;
        email: any;
        requiresVerification: boolean;
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            licenseType: any;
            status: any;
            profileImage: any;
            username: any;
            googleLoginEnabled: any;
        };
    }>;
    socialLogin(platform: 'google' | 'apple', body: {
        email: string;
        googleId?: string;
        appleId?: string;
        name?: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            licenseType: any;
            status: any;
            profileImage: any;
            username: any;
            googleLoginEnabled: any;
        };
    }>;
    verifyCode(body: {
        email: string;
        code: string;
    }): Promise<{
        access_token: string;
        user: any;
    }>;
    resendVerification(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        email: string;
        code: string;
        password: any;
    }): Promise<{
        message: string;
    }>;
    requestPasswordChangeCode(userId: string): Promise<{
        message: string;
    }>;
    changePasswordWithCode(userId: string, code: string, newPassword: any): Promise<{
        message: string;
    }>;
    private generateToken;
}

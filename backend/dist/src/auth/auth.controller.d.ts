import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
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
    googleLogin(body: {
        email: string;
        googleId: string;
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
    appleLogin(body: {
        email: string;
        appleId: string;
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
    verify(body: {
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
    requestPasswordChange(req: any): Promise<{
        message: string;
    }>;
    changePassword(req: any, body: {
        code: string;
        password: any;
    }): Promise<{
        message: string;
    }>;
}

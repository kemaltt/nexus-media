import { PrismaService } from '../prisma.service';
export declare class UserController {
    private prisma;
    constructor(prisma: PrismaService);
    updateProfile(req: any, body: {
        name?: string;
        username?: string;
        profileImage?: string;
    }): Promise<any>;
    toggleGoogle(req: any, body: {
        enabled: boolean;
    }): Promise<any>;
}

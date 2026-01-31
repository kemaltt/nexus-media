import { PrismaService } from '../prisma.service';
export declare class PostService {
    private prisma;
    constructor(prisma: PrismaService);
    createPost(userId: string, data: any): Promise<any>;
    getHistory(userId: string): Promise<any>;
    private dispatchPost;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PostService = class PostService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPost(userId, data) {
        const { content, mediaUrls, accountIds, scheduledAt } = data;
        const post = await this.prisma.post.create({
            data: {
                userId,
                content,
                mediaUrls,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                attempts: {
                    create: accountIds.map((accountId) => ({
                        socialAccountId: accountId,
                        status: 'PENDING',
                    })),
                },
            },
            include: {
                attempts: true,
            },
        });
        if (!scheduledAt) {
            this.dispatchPost(post.id);
        }
        return post;
    }
    async getHistory(userId) {
        return this.prisma.post.findMany({
            where: { userId },
            include: {
                attempts: {
                    include: {
                        socialAccount: {
                            select: {
                                platform: true,
                                username: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async dispatchPost(postId) {
        console.log(`Dispatching post ${postId} to platforms...`);
        const attempts = await this.prisma.postAttempt.findMany({
            where: { postId },
            include: { socialAccount: true },
        });
        for (const attempt of attempts) {
            try {
                await this.prisma.postAttempt.update({
                    where: { id: attempt.id },
                    data: { status: 'SUCCESS' },
                });
            }
            catch (error) {
                await this.prisma.postAttempt.update({
                    where: { id: attempt.id },
                    data: { status: 'FAILED', errorMessage: error.message },
                });
            }
        }
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostService);
//# sourceMappingURL=post.service.js.map
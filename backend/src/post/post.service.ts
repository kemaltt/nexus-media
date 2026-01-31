import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, data: any) {
    const { content, mediaUrls, accountIds, scheduledAt } = data;

    const post = await (this.prisma as any).post.create({
      data: {
        userId,
        content,
        mediaUrls,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        attempts: {
          create: accountIds.map((accountId: string) => ({
            socialAccountId: accountId,
            status: 'PENDING',
          })),
        },
      },
      include: {
        attempts: true,
      },
    });

    // If not scheduled, dispatch immediately (background task would be better)
    if (!scheduledAt) {
      this.dispatchPost(post.id);
    }

    return post;
  }

  async getHistory(userId: string) {
    return (this.prisma as any).post.findMany({
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

  private async dispatchPost(postId: string) {
    // This would normally be handled by a worker (BullMQ)
    console.log(`Dispatching post ${postId} to platforms...`);

    const attempts = await (this.prisma as any).postAttempt.findMany({
      where: { postId },
      include: { socialAccount: true },
    });

    for (const attempt of attempts) {
      try {
        // Here we would decrypt tokens and call respective APIs
        // For now, let's just mark as SUCCESS to demonstrate
        await (this.prisma as any).postAttempt.update({
          where: { id: attempt.id },
          data: { status: 'SUCCESS' },
        });
      } catch (error) {
        await (this.prisma as any).postAttempt.update({
          where: { id: attempt.id },
          data: { status: 'FAILED', errorMessage: error.message },
        });
      }
    }
  }
}

import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  async createPost(@Req() req: any, @Body() body: any) {
    return this.postService.createPost(req.user.id, body);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    return this.postService.getHistory(req.user.id);
  }
}

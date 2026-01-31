import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma.service';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: any,
    @Body() body: { name?: string; username?: string; profileImage?: string },
  ) {
    const userId = req.user.id;
    const user = await (this.prisma as any).user.update({
      where: { id: userId },
      data: {
        name: body.name,
        username: body.username,
        profileImage: body.profileImage,
      },
    });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('toggle-google')
  async toggleGoogle(@Req() req: any, @Body() body: { enabled: boolean }) {
    const userId = req.user.id;
    const user = await (this.prisma as any).user.update({
      where: { id: userId },
      data: {
        googleLoginEnabled: body.enabled,
      },
    });
    return user;
  }
}

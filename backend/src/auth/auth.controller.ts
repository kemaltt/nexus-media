import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('google-login')
  async googleLogin(
    @Body() body: { email: string; googleId: string; name?: string },
  ) {
    return this.authService.socialLogin('google', body);
  }

  @Post('apple-login')
  async appleLogin(
    @Body() body: { email: string; appleId: string; name?: string },
  ) {
    return this.authService.socialLogin('apple', body);
  }

  @Post('verify')
  async verify(@Body() body: { email: string; code: string }) {
    return this.authService.verifyCode(body);
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerification(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; code: string; password: any },
  ) {
    return this.authService.resetPassword(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-password-change')
  async requestPasswordChange(@Req() req: any) {
    return this.authService.requestPasswordChangeCode(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body() body: { code: string; password: any },
  ) {
    return this.authService.changePasswordWithCode(
      req.user.id,
      body.code,
      body.password,
    );
  }
}

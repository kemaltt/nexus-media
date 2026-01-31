import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(data: any) {
    const { email, password, name } = data;

    const existingUser = await (this.prisma as any).user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await (this.prisma as any).user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationCode,
        verificationExpires,
      },
    });

    try {
      await this.emailService.sendVerificationEmail(email, verificationCode);
    } catch (e) {
      console.error('Failed to send verification email', e);
    }

    return {
      message: 'Verification code sent to your email',
      email: user.email,
      requiresVerification: true,
    };
  }

  async login(body: any) {
    const user = await (this.prisma as any).user.findUnique({
      where: { email: body.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    if (!user.isVerified) {
      // Re-send verification if expired?
      // For now just error and let the UI handle resend
      throw new UnauthorizedException('NOT_VERIFIED');
    }

    // Update last login
    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        timezone: body.timezone || user.timezone,
      },
    });

    const refreshedUser = await (this.prisma as any).user.findUnique({
      where: { id: user.id },
    });
    return this.generateToken(refreshedUser);
  }

  async socialLogin(
    platform: 'google' | 'apple',
    body: { email: string; googleId?: string; appleId?: string; name?: string },
  ) {
    let user = await (this.prisma as any).user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      // Create new user if not exists
      user = await (this.prisma as any).user.create({
        data: {
          email: body.email,
          name: body.name,
          googleId: platform === 'google' ? body.googleId : undefined,
          appleId: platform === 'apple' ? body.appleId : undefined,
        },
      });
    } else {
      // Update existing user with social ID if not present
      const updateData: any = { lastLoginAt: new Date() };
      if (platform === 'google' && !user.googleId) {
        updateData.googleId = body.googleId;
      } else if (platform === 'apple' && !user.appleId) {
        updateData.appleId = body.appleId;
      }

      user = await (this.prisma as any).user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    return this.generateToken(user);
  }

  async verifyCode(body: { email: string; code: string }) {
    const user = await (this.prisma as any).user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException('auth.forgot_password.error_email');
    }

    if (user.verificationCode !== body.code) {
      throw new BadRequestException('auth.verify.invalid_code');
    }

    if (user.verificationExpires < new Date()) {
      throw new BadRequestException('auth.verify.expired_code');
    }

    const newUser = await (this.prisma as any).user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    const payload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: newUser,
    };
  }

  async resendVerification(body: { email: string }) {
    const user = await (this.prisma as any).user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: {
        verificationCode,
        verificationExpires,
      },
    });

    await this.emailService.sendVerificationEmail(user.email, verificationCode);

    return { message: 'Verification code resent' };
  }

  async forgotPassword(body: { email: string }) {
    const user = await (this.prisma as any).user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    const resetPasswordCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: {
        resetPasswordCode,
        resetPasswordExpires,
      },
    });

    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetPasswordCode,
    );

    return { message: 'Reset code sent' };
  }

  async resetPassword(body: { email: string; code: string; password: any }) {
    const user = await (this.prisma as any).user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new BadRequestException('auth.forgot_password.error_email');
    }

    if (user.resetPasswordCode !== body.code) {
      throw new BadRequestException('auth.forgot_password.error_invalid_code');
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('auth.verify.expired_code');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  async requestPasswordChangeCode(userId: string) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('auth.forgot_password.error_email');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: {
        passwordChangeCode: code,
        passwordChangeExpires: expires,
      },
    });

    await this.emailService.sendPasswordChangeEmail(user.email, code);

    return { message: 'Change code sent' };
  }

  async changePasswordWithCode(userId: string, code: string, newPassword: any) {
    const user = await (this.prisma as any).user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('auth.forgot_password.error_email');
    }

    if (user.passwordChangeCode !== code) {
      throw new BadRequestException('auth.forgot_password.error_invalid_code');
    }

    if (user.passwordChangeExpires < new Date()) {
      throw new BadRequestException('auth.verify.expired_code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangeCode: null,
        passwordChangeExpires: null,
      },
    });

    return { message: 'Password change successful' };
  }

  private generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      licenseType: user.licenseType,
      status: user.status,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        licenseType: user.licenseType,
        status: user.status,
        profileImage: user.profileImage, // from social account or user profile
        username: user.username,
        googleLoginEnabled: user.googleLoginEnabled,
      },
    };
  }
}

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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailService;
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async register(data) {
        const { email, password, name } = data;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);
        const user = await this.prisma.user.create({
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
        }
        catch (e) {
            console.error('Failed to send verification email', e);
        }
        return {
            message: 'Verification code sent to your email',
            email: user.email,
            requiresVerification: true,
        };
    }
    async login(body) {
        const user = await this.prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Geçersiz e-posta veya şifre');
        }
        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Geçersiz e-posta veya şifre');
        }
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('NOT_VERIFIED');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                timezone: body.timezone || user.timezone,
            },
        });
        const refreshedUser = await this.prisma.user.findUnique({
            where: { id: user.id },
        });
        return this.generateToken(refreshedUser);
    }
    async socialLogin(platform, body) {
        let user = await this.prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: body.email,
                    name: body.name,
                    googleId: platform === 'google' ? body.googleId : undefined,
                    appleId: platform === 'apple' ? body.appleId : undefined,
                },
            });
        }
        else {
            const updateData = { lastLoginAt: new Date() };
            if (platform === 'google' && !user.googleId) {
                updateData.googleId = body.googleId;
            }
            else if (platform === 'apple' && !user.appleId) {
                updateData.appleId = body.appleId;
            }
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: updateData,
            });
        }
        return this.generateToken(user);
    }
    async verifyCode(body) {
        const user = await this.prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user) {
            throw new common_1.BadRequestException('auth.forgot_password.error_email');
        }
        if (user.verificationCode !== body.code) {
            throw new common_1.BadRequestException('auth.verify.invalid_code');
        }
        if (user.verificationExpires < new Date()) {
            throw new common_1.BadRequestException('auth.verify.expired_code');
        }
        const newUser = await this.prisma.user.update({
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
    async resendVerification(body) {
        const user = await this.prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                verificationCode,
                verificationExpires,
            },
        });
        await this.emailService.sendVerificationEmail(user.email, verificationCode);
        return { message: 'Verification code resent' };
    }
    async forgotPassword(body) {
        const user = await this.prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Kullanıcı bulunamadı');
        }
        const resetPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordCode,
                resetPasswordExpires,
            },
        });
        await this.emailService.sendPasswordResetEmail(user.email, resetPasswordCode);
        return { message: 'Reset code sent' };
    }
    async resetPassword(body) {
        const user = await this.prisma.user.findUnique({
            where: { email: body.email },
        });
        if (!user) {
            throw new common_1.BadRequestException('auth.forgot_password.error_email');
        }
        if (user.resetPasswordCode !== body.code) {
            throw new common_1.BadRequestException('auth.forgot_password.error_invalid_code');
        }
        if (user.resetPasswordExpires < new Date()) {
            throw new common_1.BadRequestException('auth.verify.expired_code');
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordCode: null,
                resetPasswordExpires: null,
            },
        });
        return { message: 'Password reset successful' };
    }
    async requestPasswordChangeCode(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('auth.forgot_password.error_email');
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordChangeCode: code,
                passwordChangeExpires: expires,
            },
        });
        await this.emailService.sendPasswordChangeEmail(user.email, code);
        return { message: 'Change code sent' };
    }
    async changePasswordWithCode(userId, code, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('auth.forgot_password.error_email');
        }
        if (user.passwordChangeCode !== code) {
            throw new common_1.BadRequestException('auth.forgot_password.error_invalid_code');
        }
        if (user.passwordChangeExpires < new Date()) {
            throw new common_1.BadRequestException('auth.verify.expired_code');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordChangeCode: null,
                passwordChangeExpires: null,
            },
        });
        return { message: 'Password change successful' };
    }
    generateToken(user) {
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
                profileImage: user.profileImage,
                username: user.username,
                googleLoginEnabled: user.googleLoginEnabled,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
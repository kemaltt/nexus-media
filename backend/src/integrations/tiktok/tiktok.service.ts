import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SocialAccountService } from '../../social-account/social-account.service';
import { Platform, TokenType } from '@prisma/client';

@Injectable()
export class TiktokService {
  private readonly logger = new Logger(TiktokService.name);

  constructor(
    private configService: ConfigService,
    private socialAccountService: SocialAccountService,
  ) {}

  getAuthUrl(userId: string) {
    const clientKey = this.configService.get('TIKTOK_CLIENT_KEY');
    const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/tiktok/callback`;
    const scopes = ['user.info.basic', 'video.publish', 'video.upload'];

    // TikTok OAuth 2.0 Authorize URL
    return `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scopes.join(',')}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${userId}`;
  }

  async handleCallback(code: string, userId: string) {
    const clientKey = this.configService.get('TIKTOK_CLIENT_KEY');
    const clientSecret = this.configService.get('TIKTOK_CLIENT_SECRET');
    const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/tiktok/callback`;

    // 1. Exchange code for access token
    const tokenResponse = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { access_token, refresh_token, expires_in, open_id, scope } =
      tokenResponse.data;

    // 2. Get user info
    const userResponse = await axios.get(
      'https://open.tiktokapis.com/v2/user/info/',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          fields: 'open_id,union_id,avatar_url,display_name',
        },
      },
    );

    const userData = userResponse.data.data.user;

    return this.socialAccountService.addAccount(userId, {
      platform: Platform.TIKTOK,
      platformId: open_id,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpires: new Date(Date.now() + expires_in * 1000),
      tokenType: TokenType.BEARER,
      scopes: scope ? scope.split(',') : [],
      username: userData.display_name,
      profileImage: userData.avatar_url,
    });
  }
}

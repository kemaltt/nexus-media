import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { SocialAccountService } from '../../social-account/social-account.service';
import { Platform, TokenType } from '@prisma/client';

@Injectable()
export class XService {
  private readonly logger = new Logger(XService.name);
  // Store code_verifiers temporarily. state -> verifier
  // NOTE: In production, use Redis or a DB with TTL for this!
  private verifiers = new Map<string, string>();

  constructor(
    private configService: ConfigService,
    private socialAccountService: SocialAccountService,
  ) {}

  getAuthUrl(userId: string) {
    const clientKey = this.configService.get('X_API_KEY');
    const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/x/callback`;

    // Generate PKCE
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    const state = `${userId}_${crypto.randomBytes(8).toString('hex')}`;
    this.verifiers.set(state, codeVerifier);

    // Clean up old verifiers after 10 mins
    setTimeout(() => this.verifiers.delete(state), 10 * 60 * 1000);

    const scopes = [
      'tweet.read',
      'tweet.write',
      'users.read',
      'offline.access',
    ];

    const url = new URL('https://twitter.com/i/oauth2/authorize');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', clientKey);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', scopes.join(' '));
    url.searchParams.append('state', state);
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append('code_challenge_method', 'S256');

    return url.toString();
  }

  async handleCallback(code: string, state: string) {
    const userId = state.split('_')[0];
    const codeVerifier = this.verifiers.get(state);

    if (!codeVerifier) {
      throw new Error('Invalid or expired state/code_verifier');
    }

    const clientKey = this.configService.get('X_API_KEY');
    const clientSecret = this.configService.get('X_API_SECRET');
    const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/x/callback`;

    // 1. Exchange code for token
    const authHeader = Buffer.from(`${clientKey}:${clientSecret}`).toString(
      'base64',
    );

    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authHeader}`,
        },
      },
    );

    const { access_token, refresh_token, expires_in, scope } =
      tokenResponse.data;

    // 2. Get user info
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        'user.fields': 'id,name,username,profile_image_url',
      },
    });

    const userData = userResponse.data.data;

    this.verifiers.delete(state);

    return this.socialAccountService.addAccount(userId, {
      platform: Platform.X,
      platformId: userData.id,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpires: new Date(Date.now() + expires_in * 1000),
      tokenType: TokenType.USER_CONTEXT,
      scopes: scope ? scope.split(' ') : [],
      username: userData.username,
      profileImage: userData.profile_image_url,
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { SocialAccountService } from '../../social-account/social-account.service';
import { Platform, TokenType } from '@prisma/client';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private oauth2Client: any;

  constructor(
    private configService: ConfigService,
    private socialAccountService: SocialAccountService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      `${this.configService.get('BACKEND_URL')}/integrations/youtube/callback`,
    );
  }

  getAuthUrl(userId: string) {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: userId, // Pass userId to link account in callback
    });
  }

  async handleCallback(code: string, userId: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });

    // Get user info and channel info
    const [userResponse, channelResponse] = await Promise.all([
      oauth2.userinfo.get(),
      youtube.channels.list({ part: ['snippet'], mine: true }),
    ]);

    const platformId =
      channelResponse.data.items?.[0]?.id || userResponse.data.id;
    const username =
      channelResponse.data.items?.[0]?.snippet?.title || userResponse.data.name;
    const profileImage =
      channelResponse.data.items?.[0]?.snippet?.thumbnails?.default?.url ||
      userResponse.data.picture;

    return this.socialAccountService.addAccount(userId, {
      platform: Platform.YOUTUBE,
      platformId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpires: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      tokenType: TokenType.BEARER,
      scopes: tokens.scope ? tokens.scope.split(' ') : [],
      username,
      profileImage,
    });
  }
}

// @Injectable()
// export class YoutubeService {
//   private readonly logger = new Logger(YoutubeService.name);

//   constructor(
//     private configService: ConfigService,
//     private socialAccountService: SocialAccountService,
//   ) {}

//   private createOAuthClient() {
//     return new google.auth.OAuth2(
//       this.configService.get('GOOGLE_CLIENT_ID'),
//       this.configService.get('GOOGLE_CLIENT_SECRET'),
//       `${this.configService.get('BACKEND_URL')}/integrations/youtube/callback`,
//     );
//   }

//   getAuthUrl(userId: string) {
//     const client = this.createOAuthClient();

//     const scopes = [
//       'https://www.googleapis.com/auth/youtube.upload',
//       'https://www.googleapis.com/auth/youtube.force-ssl',
//       'https://www.googleapis.com/auth/userinfo.profile',
//     ];

//     return client.generateAuthUrl({
//       access_type: 'offline',
//       scope: scopes,
//       prompt: 'consent',
//       state: userId,
//     });
//   }

//   async handleCallback(code: string, userId: string) {
//     const client = this.createOAuthClient();

//     const { tokens } = await client.getToken(code);
//     client.setCredentials(tokens);

//     const youtube = google.youtube({ version: 'v3', auth: client });
//     const oauth2 = google.oauth2({ version: 'v2', auth: client });

//     const [userResponse, channelResponse] = await Promise.all([
//       oauth2.userinfo.get(),
//       youtube.channels.list({
//         part: ['snippet'],
//         mine: true,
//       }),
//     ]);

//     if (!channelResponse.data.items?.length) {
//       throw new Error('No YouTube channel found for this account.');
//     }

//     const channel = channelResponse.data.items[0];

//     // 🔒 refresh_token overwrite protection
//     const existingAccount =
//       await this.socialAccountService.findByPlatform(
//         userId,
//         Platform.YOUTUBE,
//       );

//     const refreshToken =
//       tokens.refresh_token ?? existingAccount?.refreshToken ?? null;

//     return this.socialAccountService.addAccount(userId, {
//       platform: Platform.YOUTUBE,
//       platformId: channel.id,
//       accessToken: tokens.access_token!,
//       refreshToken,
//       tokenExpires: tokens.expiry_date
//         ? new Date(tokens.expiry_date)
//         : null,
//       tokenType: TokenType.BEARER,
//       scopes: tokens.scope ? tokens.scope.split(' ') : [],
//       username: channel.snippet?.title ?? userResponse.data.name,
//       profileImage:
//         channel.snippet?.thumbnails?.default?.url ??
//         userResponse.data.picture,
//     });
//   }
// }

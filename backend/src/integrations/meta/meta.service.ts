import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SocialAccountService } from '../../social-account/social-account.service';
import { Platform, TokenType } from '@prisma/client';

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(
    private configService: ConfigService,
    private socialAccountService: SocialAccountService,
  ) {}

  getAuthUrl(userId: string) {
    const appId = this.configService.get('FACEBOOK_APP_ID');
    const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/meta/callback`;
    const scopes = [
      'pages_manage_posts',
      'pages_manage_engagement',
      'pages_show_list',
      'pages_read_engagement',
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'public_profile',
      'email',
    ];

    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${userId}&scope=${scopes.join(',')}`;
  }

  async handleCallback(code: string, userId: string) {
    const appId = this.configService.get('FACEBOOK_APP_ID');
    const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
    const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/meta/callback`;

    // 1. Exchange code for user access token
    const tokenResponse = await axios.get(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        },
      },
    );

    const userToken = tokenResponse.data.access_token;

    // 2. Exchange for long-lived token
    const longLivedTokenResponse = await axios.get(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: userToken,
        },
      },
    );

    const longLivedUserToken = longLivedTokenResponse.data.access_token;

    // 3. Get Pages managed by user
    const pagesResponse = await axios.get(
      'https://graph.facebook.com/v18.0/me/accounts',
      {
        params: { access_token: longLivedUserToken },
      },
    );

    const accounts: any[] = [];

    for (const page of pagesResponse.data.data) {
      // Add Facebook Page
      const fbAccount = await this.socialAccountService.addAccount(userId, {
        platform: Platform.FACEBOOK,
        platformId: page.id,
        accessToken: page.access_token, // Page tokens are long-lived if exchanged from long-lived user token
        username: page.name,
        tokenType: TokenType.BEARER,
        scopes: [], // Meta doesn't return scopes in this endpoint
      });
      accounts.push(fbAccount);

      // 4. Check for linked Instagram accounts
      try {
        const igResponse = await axios.get(
          `https://graph.facebook.com/v18.0/${page.id}`,
          {
            params: {
              fields:
                'instagram_business_account{id,username,profile_picture_url}',
              access_token: page.access_token,
            },
          },
        );

        const igAccountData = igResponse.data.instagram_business_account;
        if (igAccountData) {
          const igAccount = await this.socialAccountService.addAccount(userId, {
            platform: Platform.INSTAGRAM,
            platformId: igAccountData.id,
            accessToken: page.access_token, // Instagram uses the Page's access token
            username: igAccountData.username,
            profileImage: igAccountData.profile_picture_url,
            tokenType: TokenType.BEARER,
            scopes: [],
          });
          accounts.push(igAccount);
        }
      } catch (e) {
        this.logger.warn(`No Instagram account linked to page ${page.id}`);
      }
    }

    return accounts;
  }
}



// @Injectable()
// export class MetaService {
//   private readonly logger = new Logger(MetaService.name);

//   constructor(
//     private configService: ConfigService,
//     private socialAccountService: SocialAccountService,
//   ) {}

//   getAuthUrl(userId: string) {
//     const appId = this.configService.get('FACEBOOK_APP_ID');
//     const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/meta/callback`;

//     const scopes = [
//       'pages_manage_posts',
//       'pages_manage_engagement',
//       'pages_show_list',
//       'pages_read_engagement',
//       'instagram_basic',
//       'instagram_content_publish',
//       'instagram_manage_comments',
//     ];

//     // 🔐 signed state (örnek: basit HMAC)
//     const state = Buffer.from(
//       JSON.stringify({ userId, ts: Date.now() }),
//     ).toString('base64');

//     return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes.join(',')}`;
//   }

//   async handleCallback(code: string, state: string) {
//     const { userId } = JSON.parse(
//       Buffer.from(state, 'base64').toString('utf8'),
//     );

//     const appId = this.configService.get('FACEBOOK_APP_ID');
//     const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
//     const redirectUri = `${this.configService.get('BACKEND_URL')}/integrations/meta/callback`;

//     // 1️⃣ user token
//     const tokenResponse = await axios.get(
//       'https://graph.facebook.com/v18.0/oauth/access_token',
//       {
//         params: {
//           client_id: appId,
//           client_secret: appSecret,
//           redirect_uri: redirectUri,
//           code,
//         },
//       },
//     );

//     // 2️⃣ long-lived user token
//     const longTokenResponse = await axios.get(
//       'https://graph.facebook.com/v18.0/oauth/access_token',
//       {
//         params: {
//           grant_type: 'fb_exchange_token',
//           client_id: appId,
//           client_secret: appSecret,
//           fb_exchange_token: tokenResponse.data.access_token,
//         },
//       },
//     );

//     const longLivedToken = longTokenResponse.data.access_token;
//     const expiresIn = longTokenResponse.data.expires_in; // seconds
//     const expiresAt = new Date(Date.now() + expiresIn * 1000);

//     // 3️⃣ pages
//     const pagesResponse = await axios.get(
//       'https://graph.facebook.com/v18.0/me/accounts',
//       { params: { access_token: longLivedToken } },
//     );

//     const results = [];

//     for (const page of pagesResponse.data.data) {
//       // ⛔ upsert assumed here
//       const fbAccount = await this.socialAccountService.upsertAccount(userId, {
//         platform: Platform.FACEBOOK,
//         platformId: page.id,
//         accessToken: page.access_token,
//         tokenType: TokenType.BEARER,
//         tokenExpires: expiresAt,
//         scopes: [
//           'pages_manage_posts',
//           'pages_manage_engagement',
//           'pages_show_list',
//         ],
//         username: page.name,
//       });

//       results.push(fbAccount);

//       // 4️⃣ Instagram Business
//       try {
//         const igResponse = await axios.get(
//           `https://graph.facebook.com/v18.0/${page.id}`,
//           {
//             params: {
//               fields:
//                 'instagram_business_account{id,username,profile_picture_url}',
//               access_token: page.access_token,
//             },
//           },
//         );

//         const ig = igResponse.data.instagram_business_account;
//         if (ig) {
//           const igAccount = await this.socialAccountService.upsertAccount(
//             userId,
//             {
//               platform: Platform.INSTAGRAM,
//               platformId: ig.id,
//               accessToken: page.access_token,
//               tokenType: TokenType.BEARER,
//               tokenExpires: expiresAt,
//               scopes: [
//                 'instagram_basic',
//                 'instagram_content_publish',
//                 'instagram_manage_comments',
//               ],
//               username: ig.username,
//               profileImage: ig.profile_picture_url,
//             },
//           );
//           results.push(igAccount);
//         }
//       } catch (err) {
//         this.logger.warn(
//           `Page ${page.id} has no Instagram Business account`,
//         );
//       }
//     }

//     return results;
//   }
// }
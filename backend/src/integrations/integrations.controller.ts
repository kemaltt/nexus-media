import { Controller, Get, Query, Res, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { YoutubeService } from './youtube/youtube.service';
import { MetaService } from './meta/meta.service';
import { TiktokService } from './tiktok/tiktok.service';
import { XService } from './x/x.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('integrations')
export class IntegrationsController {
  constructor(
    private youtubeService: YoutubeService,
    private metaService: MetaService,
    private tiktokService: TiktokService,
    private xService: XService,
  ) {}

  @Get('youtube/auth')
  @UseGuards(JwtAuthGuard)
  async youtubeAuth(@Req() req: any) {
    return { url: this.youtubeService.getAuthUrl(req.user.id) };
  }

  @Get('youtube/callback')
  async youtubeCallback(
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response,
  ) {
    if (!code || !userId) {
      return res.redirect('/error?message=missing_data');
    }
    await this.youtubeService.handleCallback(code, userId);
    return res.send(`
      <html>
        <body>
          <h2>YouTube Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  }

  @Get('meta/auth')
  @UseGuards(JwtAuthGuard)
  async metaAuth(@Req() req: any) {
    return { url: this.metaService.getAuthUrl(req.user.id) };
  }

  @Get('meta/callback')
  async metaCallback(
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response,
  ) {
    if (!code || !userId) {
      return res.redirect('/error?message=missing_data');
    }
    await this.metaService.handleCallback(code, userId);
    return res.send(`
      <html>
        <body>
          <h2>Facebook/Instagram Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  }

  @Get('tiktok/auth')
  @UseGuards(JwtAuthGuard)
  async tiktokAuth(@Req() req: any) {
    return { url: this.tiktokService.getAuthUrl(req.user.id) };
  }

  @Get('tiktok/callback')
  async tiktokCallback(
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response,
  ) {
    if (!code || !userId) {
      return res.redirect('/error?message=missing_data');
    }
    await this.tiktokService.handleCallback(code, userId);
    return res.send(`
      <html>
        <body>
          <h2>TikTok Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  }

  @Get('x/auth')
  @UseGuards(JwtAuthGuard)
  async xAuth(@Req() req: any) {
    return { url: this.xService.getAuthUrl(req.user.id) };
  }

  @Get('x/callback')
  async xCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      return res.redirect('/error?message=missing_data');
    }
    await this.xService.handleCallback(code, state);
    return res.send(`
      <html>
        <body>
          <h2>X (Twitter) Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  }
}

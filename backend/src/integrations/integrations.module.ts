import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube/youtube.service';
import { MetaService } from './meta/meta.service';
import { TiktokService } from './tiktok/tiktok.service';
import { XService } from './x/x.service';
import { IntegrationsController } from './integrations.controller';
import { SocialAccountModule } from '../social-account/social-account.module';

@Module({
  imports: [SocialAccountModule],
  controllers: [IntegrationsController],
  providers: [YoutubeService, MetaService, TiktokService, XService],
  exports: [YoutubeService, MetaService, TiktokService, XService],
})
export class IntegrationsModule {}

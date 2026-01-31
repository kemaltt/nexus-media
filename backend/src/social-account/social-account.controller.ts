import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SocialAccountService } from './social-account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('social-accounts')
@UseGuards(JwtAuthGuard)
export class SocialAccountController {
  constructor(private socialAccountService: SocialAccountService) {}

  @Post()
  async addAccount(@Req() req: any, @Body() body: any) {
    return this.socialAccountService.addAccount(req.user.id, body);
  }

  @Get()
  async getAccounts(@Req() req: any) {
    return this.socialAccountService.getAccounts(req.user.id);
  }

  @Delete(':id')
  async removeAccount(@Req() req: any, @Param('id') id: string) {
    return this.socialAccountService.removeAccount(req.user.id, id);
  }
}

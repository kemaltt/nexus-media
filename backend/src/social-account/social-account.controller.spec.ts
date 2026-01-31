import { Test, TestingModule } from '@nestjs/testing';
import { SocialAccountController } from './social-account.controller';

describe('SocialAccountController', () => {
  let controller: SocialAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialAccountController],
    }).compile();

    controller = module.get<SocialAccountController>(SocialAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

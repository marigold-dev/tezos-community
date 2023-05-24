import { Test, TestingModule } from '@nestjs/testing';
import { SiwtController } from './siwt.controller';

describe('SiwtController', () => {
  let controller: SiwtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiwtController],
    }).compile();

    controller = module.get<SiwtController>(SiwtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

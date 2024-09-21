import { Test, TestingModule } from '@nestjs/testing';
import { MoxfieldController } from './moxfield.controller';

describe('MoxfieldController', () => {
  let controller: MoxfieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoxfieldController],
    }).compile();

    controller = module.get<MoxfieldController>(MoxfieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

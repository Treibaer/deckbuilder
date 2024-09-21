import { Test, TestingModule } from '@nestjs/testing';
import { MoxfieldService } from './moxfield.service';

describe('MoxfieldService', () => {
  let service: MoxfieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoxfieldService],
    }).compile();

    service = module.get<MoxfieldService>(MoxfieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

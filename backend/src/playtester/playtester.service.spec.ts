import { Test, TestingModule } from '@nestjs/testing';
import { PlaytesterService } from './playtester.service';

describe('PlaytesterService', () => {
  let service: PlaytesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaytesterService],
    }).compile();

    service = module.get<PlaytesterService>(PlaytesterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

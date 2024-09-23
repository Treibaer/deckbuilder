import { Test, TestingModule } from '@nestjs/testing';
import { MoxfieldService } from './moxfield.service';
import { UsersService } from 'src/users/users.service';

describe('MoxfieldService', () => {
  let service: MoxfieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoxfieldService, UsersService],
    }).compile();

    service = module.get<MoxfieldService>(MoxfieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

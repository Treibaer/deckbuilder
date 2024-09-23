import { Test, TestingModule } from '@nestjs/testing';
import { MoxfieldController } from './moxfield.controller';
import { MoxfieldService } from './moxfield.service';
import { UsersService } from 'src/users/users.service';

describe('MoxfieldController', () => {
  let controller: MoxfieldController;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoxfieldController],
      providers: [MoxfieldService, UsersService],
    }).compile();

    controller = module.get<MoxfieldController>(MoxfieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


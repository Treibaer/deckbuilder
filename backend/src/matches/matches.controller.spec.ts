import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { UserService } from 'src/users/user.service';
import { PlaytestService } from 'src/decks/playtest.service';
import { MoxfieldService } from 'src/moxfield/moxfield.service';

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [UserService, PlaytestService, MoxfieldService],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

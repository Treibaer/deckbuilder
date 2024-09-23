import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { UsersService } from 'src/users/users.service';
import { PlaytestsService } from 'src/decks/playtests.service';
import { MoxfieldService } from 'src/moxfield/moxfield.service';

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [UsersService, PlaytestsService, MoxfieldService],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

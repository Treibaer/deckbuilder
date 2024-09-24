import { Injectable } from '@nestjs/common';
import { Wrapper } from './models/wrapper';
import { GameState } from 'src/decks/playtests.service';

@Injectable()
export class PlaytesterService {
  saveGameState(data: Wrapper<GameState>) {

  }
  saveFieldCard() {
    return 'This action adds a new field card';
  }
}

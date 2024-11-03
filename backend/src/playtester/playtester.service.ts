import { Injectable } from "@nestjs/common";
import { Playtest } from "src/decks/entities/playtest.entity";
import { GameCard, GameState } from "src/decks/playtest.service";
import { SettingsDto } from "./models/settings.dto";
import { Wrapper } from "./models/wrapper";

@Injectable()
export class PlaytesterService {
  saveGameState(playtest: Playtest, wrapper: Wrapper<GameState>) {
    playtest.game = JSON.stringify(wrapper.data);
    playtest.save();
  }

  saveFieldCard(playtest: Playtest, wrapper: Wrapper<GameCard>) {
    const game: GameState = JSON.parse(playtest.game);
    for (let i = 0; i < game.field.length; i++) {
      if (game.field[i].id === wrapper.data.id) {
        game.field[i] = wrapper.data;
        break;
      }
    }
    playtest.game = JSON.stringify(game);
    playtest.save();
  }

  saveSettings(playtest: Playtest, wrapper: Wrapper<SettingsDto>) {
    const game: GameState = JSON.parse(playtest.game);
    game.life = wrapper.data.life;
    game.counters = {
      ...game.counters,
      energy: wrapper.data.counters.energy,
      poison: wrapper.data.counters.poison,
      commanderDamage: wrapper.data.counters.commanderDamage,
    };
    playtest.game = JSON.stringify(game);
    playtest.save();
  }
}

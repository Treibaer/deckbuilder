import { Injectable } from "@nestjs/common";
import { DeckCard } from "./entities/deck-card.entity";
import { MagicCardDto } from "./dto/magic-card.dto";
import { Deck } from "./entities/deck.entity";
import { DeckDto } from "./dto/deck.dto";
import { RelatedCardDto } from "./dto/related-card.dto";
import { Card } from "./entities/card.entity";

@Injectable()
export class PlaytestsService {
  private createNewGame(): GameState {
    return {
      hand: [],
      field: [],
      graveyard: [],
      library: [],
      exile: [],
      commandZone: [],
      life: 40,
      history: [],
      counters: {
        energy: 0,
        poison: 0,
        experience: 0,
        storm: 0,
        commanderDamage: 0,
        infect: 0,
      },
      status: "waiting",
      settings: {
        libraryRevealTopCard: false,
        libraryRevealTopCardForMe: false,
        backgroundImage: "",
      },
    };
  }

  private createMagicCard(magicCardDto: MagicCardDto): MagicCard {
    return {
      name: magicCardDto.name,
      scryfallId: magicCardDto.scryfallId,
      flippable: magicCardDto.cardFaces.length > 1 ? true : undefined,
    };
  }

  private createMagicCardDto(deckCard: DeckCard): MagicCardDto {
    return {
      name: deckCard.card.name,
      scryfallId: deckCard.scryfallId,
      cardFaces: deckCard.card.cardFacesNames.split("###"),
      typeLine: "",
      reprint: false,
      printsSearchUri: "",
    };
  }

  createGameFromDeck(deck: Deck): GameState {
    const game: GameState = this.createNewGame();

    const mainBoardCards = deck.cards.filter(
      (card) => card.zone === "mainboard",
    );
    const commandZoneCards = deck.cards.filter(
      (card) => card.zone === "commandZone",
    );
    let index = 1;
    for (const card of commandZoneCards) {
      const dto: MagicCardDto = this.createMagicCardDto(card);
      const magicCard: MagicCard = this.createMagicCard(dto);

      for (let i = 0; i < card.quantity; i++) {
        game.commandZone.push(this.createGameCard(index, magicCard));
        index++;
      }
    }
    for (const card of mainBoardCards) {
      const dto: MagicCardDto = this.createMagicCardDto(card);
      const magicCard: MagicCard = this.createMagicCard(dto);
      for (let i = 0; i < card.quantity; i++) {
        game.library.push(this.createGameCard(index, magicCard));
        index++;
      }
    }

    return game;
  }

  createGameFromDeckDTO(deckDto: DeckDto): GameState {
    const game: GameState = this.createNewGame();
    let index = 1;

    for (const card of deckDto.commanders) {
      const mCard = this.createMagicCard(card.card);
      for (let i = 0; i < card.quantity; i++) {
        game.commandZone.push(this.createGameCard(index, mCard));
        index++;
      }
    }
    for (const card of deckDto.mainboard) {
      const mCard = this.createMagicCard(card.card);
      for (let i = 0; i < card.quantity; i++) {
        game.library.push(this.createGameCard(index, mCard));
        index++;
      }
    }
    return game;
  }

  async getRelatedCards(game: GameState): Promise<RelatedCardDto[]> {
    const allScryfallIds = this.getAllScryfallIds(game);
    const relatedCards = new Set<string>();
    for (const scryfallId of allScryfallIds) {
      const card = await Card.findByPk(scryfallId);
      if (!card) {
        continue;
      }
      const relCards = card.relatedScryfallIds.split("###");
      for (const rel of relCards) {
        relatedCards.add(rel);
      }
    }
    const result: RelatedCardDto[] = [];
    // iterate over related cards and get the card
    const relatedCardsArray = Array.from(relatedCards);
    for (const scryfallId of relatedCardsArray) {
      const card = await Card.findByPk(scryfallId);
      if (!card) {
        continue;
      }
      result.push({
        name: card.name,
        scryfallId: card.scryfallId,
      });
    }

    return result;
  }

  private createGameCard(index: number, card: MagicCard): GameCard {
    return {
      id: index,
      card,
      tapped: false,
      fieldPosition: undefined,
      zIndex: 0,
      counters: [],
      faceDown: false,
      flipped: false,
    };
  }

  getAllScryfallIds(game: GameState): string[] {
    const allScryfallIds = new Set<string>();
    for (const card of game.commandZone) {
      allScryfallIds.add(card.card.scryfallId);
    }
    for (const card of game.hand) {
      allScryfallIds.add(card.card.scryfallId);
    }
    for (const card of game.field) {
      allScryfallIds.add(card.card.scryfallId);
    }
    for (const card of game.graveyard) {
      allScryfallIds.add(card.card.scryfallId);
    }
    for (const card of game.library) {
      allScryfallIds.add(card.card.scryfallId);
    }
    for (const card of game.exile) {
      allScryfallIds.add(card.card.scryfallId);
    }
    return Array.from(allScryfallIds);
  }
}

export class GameState {
  hand: GameCard[];
  field: GameCard[];
  graveyard: GameCard[];
  library: GameCard[];
  exile: GameCard[];
  commandZone: GameCard[];
  life: number;
  history: string[];
  counters: PlayerCounters;
  status: string;
  settings: PlayerSettings;
}

export class GameCard {
  id: number;
  card: MagicCard;
  tapped: boolean;
  fieldPosition?: FieldPosition;
  zIndex: number;
  counters: any[];
  faceDown: boolean;
  flipped: boolean;
}

class MagicCard {
  name: string;
  scryfallId: string;
  flippable?: boolean;
}

class FieldPosition {
  x: number;
  y: number;
}

class PlayerCounters {
  energy: number;
  poison: number;
  experience: number = 0;
  storm: number = 0;
  commanderDamage: number = 0;
  infect: number = 0;
}

class PlayerSettings {
  libraryRevealTopCard: boolean;
  libraryRevealTopCardForMe: boolean;
  backgroundImage: string;
}

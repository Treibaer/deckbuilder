import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { PlaytestDto } from "./dto/playtest.dto";
import { Playtest } from "./entities/playtest.entity";
import { Deck } from "./entities/deck.entity";
import { MagicCardDto } from "./dto/magic-card.dto";
import { DeckCard } from "./entities/deck-card.entity";
import { Card } from "./entities/card.entity";
import { DeckDto } from "./dto/deck.dto";
import { MoxfieldService } from "src/moxfield/moxfield.service";
import { GameState, PlaytestsService } from "./playtests.service";

@Controller("api/v1/playtests")
export class PlayTestsContoller {
  constructor(
    private readonly userService: UsersService,
    private readonly moxfieldService: MoxfieldService,
    private readonly playtestService: PlaytestsService,
  ) {}

  @Get()
  async findAll(): Promise<PlaytestDto[]> {
    const playtests = await Playtest.findAll({
      where: {
        creator_id: this.userService.user.id,
      },
      attributes: ["id", "createdAt", "allScryfallIds", "promoId", "name", "moxfieldId"],
      order: [["id", "DESC"]],
    });
    return this.transformPlaytests(playtests);
  }

  @Get(":id")
  async findOne(@Param() body: {id: number}): Promise<PlaytestDto> {
    const playtest = await Playtest.findOne({
      where: {
        id: body.id,
        // creator_id: this.userService.user.id,
      },
      attributes: ["id", "createdAt", "promoId", "name", "moxfieldId", "relatedCards"],
    });
    if (!playtest) {
      throw new NotFoundException("Playtest not found");
    }
    return this.transformPlaytests([playtest])[0];
  }

  @Delete(":id")
  async delete(id: number): Promise<void> {
    await Playtest.destroy({
      where: {
        id,
        creator_id: this.userService.user.id,
      },
    });
  }

  @Post()
  async create(@Body() body: Record<string, any>): Promise<{ id: number }> {
    let game: GameState | undefined;
    let promoId = "";
    let name = "";
    let moxfieldId = "";

    if (body.deckId) {
      const deck = await Deck.findOne({
        where: {
          id: body.deckId,
          creator_id: this.userService.user.id,
        },
        include: [
          {
            model: DeckCard,
            include: [Card],
          },
        ],
      });
      if (!deck) {
        throw new NotFoundException("Deck not found");
      }
      game = this.playtestService.createGameFromDeck(deck);
      promoId = deck.promoId;
      name = deck.name;
    } else if (body.moxFieldDeckId) {
      const moxFieldDeck: DeckDto = await this.moxfieldService.loadDeckById(
        body.moxFieldDeckId,
      );
      game = this.playtestService.createGameFromDeckDTO(moxFieldDeck);
      promoId = moxFieldDeck.promoId;
      name = moxFieldDeck.name;
      moxfieldId = body.moxFieldDeckId;
    }
    if (!game) {
      throw new InternalServerErrorException("game not created");
    }
    // get all scryfall ids from the game
    // const allScryfallIds = this.playtestService.getAllScryfallIds(game);

    const relatedCards = await this.playtestService.getRelatedCards(game);

    const playtest = await Playtest.create({
      creator_id: this.userService.user.id,
      deck_id: body.deckId,
      game: JSON.stringify(game),
      createdAt: Math.floor(Date.now() / 1000),
      allScryfallIds: "",
      promoId,
      name,
      moxfieldId,
      relatedCards: JSON.stringify(relatedCards),
    });
    return { id: playtest.id };
  }

  private transformPlaytests(playtests: Playtest[]): PlaytestDto[] {
    return playtests.map((playtest) => {
      return {
        id: playtest.id,
        createdAt: playtest.createdAt,
        allScryfallIds: playtest.allScryfallIds
          ? JSON.parse(playtest.allScryfallIds)
          : [],
        promoId: playtest.promoId,
        name: playtest.name,
        moxfieldId: playtest.moxfieldId,
        relatedCards: playtest.relatedCards ? JSON.parse(playtest.relatedCards) : [],
      };
    });
  }
}

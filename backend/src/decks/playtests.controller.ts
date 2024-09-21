import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { PlaytestDto } from "./dto/playtest.dto";
import { Playtest } from "./entities/playtest.entity";
import { Deck } from "./entities/deck.entity";
import { MagicCardDto } from "./dto/card.dto";
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
      attributes: ["id", "createdAt"],
      order: [["id", "DESC"]],
    });
    return this.transformPlaytests(playtests);
  }

  @Get(":id")
  async findOne(id: number): Promise<PlaytestDto> {
    const playtest = await Playtest.findOne({
      where: {
        id,
        creator_id: this.userService.user.id,
      },
      attributes: ["id", "createdAt"],
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
    } else if (body.moxFieldDeckId) {
      const moxFieldDeck: DeckDto = await this.moxfieldService.loadDeckById(
        body.moxFieldDeckId,
      );
      game = this.playtestService.createGameFromDeckDTO(moxFieldDeck);
    }
    const playtest = await Playtest.create({
      creator_id: this.userService.user.id,
      deck_id: body.deckId,
      game: JSON.stringify(game),
      createdAt: Math.floor(Date.now() / 1000),
    });
    return { id: playtest.id };
  }

  private transformPlaytests(playtests: Playtest[]): PlaytestDto[] {
    return playtests.map((playtest) => {
      return {
        id: playtest.id,
        createdAt: playtest.createdAt,
      };
    });
  }
}

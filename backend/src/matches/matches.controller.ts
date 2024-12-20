import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { Op } from "sequelize";
import { Card } from "src/decks/entities/card.entity";
import { DeckCard } from "src/decks/entities/deck-card.entity";
import { Deck } from "src/decks/entities/deck.entity";
import { Game } from "src/decks/entities/game.entity";
import { Playtest } from "src/decks/entities/playtest.entity";
import { User } from "src/decks/entities/user.entity";
import { GameState, PlaytestService } from "src/decks/playtest.service";
import { MoxfieldService } from "src/moxfield/moxfield.service";
import { UserService } from "src/users/user.service";

@Controller("api/v1/matches")
export class MatchesController {
  constructor(
    private readonly userService: UserService,
    private readonly playtestService: PlaytestService,
    private readonly moxfieldService: MoxfieldService,
  ) {}

  @Get()
  async getMatches() {
    const games = await Game.findAll({
      where: {
        [Op.or]: [
          { player0_id: this.userService.user.id },
          { player1_id: this.userService.user.id },
        ],
      },
      include: [
        { model: User, as: "player0" },
        { model: User, as: "player1" },
        { model: Playtest, as: "playtest0" },
        { model: Playtest, as: "playtest1" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return games.map((game) => {
      return {
        id: game.id,
        player0: {
          id: game.player0.id,
          name: game.player0.username,
          deckSelected: game.playtest0 !== null,
          canSelectDeck:
            game.playtest0 === null &&
            game.player0.id === this.userService.user.id,
          playtest: {
            id: game.playtest0?.id,
            name: game.playtest0?.name,
            promoId: game.playtest0?.promoId,
            moxfieldId: game.playtest0?.moxfieldId,
          },
        },
        player1: {
          id: game.player1.id,
          name: game.player1.username,
          deckSelected: game.playtest1 !== null,
          canSelectDeck:
            game.playtest1 === null &&
            game.player1.id === this.userService.user.id,
          playtest: {
            id: game.playtest1?.id,
            name: game.playtest1?.name,
            promoId: game.playtest1?.promoId,
            moxfieldId: game.playtest1?.moxfieldId,
          },
        },
        createdAt: game.createdAt,
      };
    });
  }

  @Get(":id")
  async getMatch(@Param("id") id: string) {
    const game = await Game.findByPk(id, {
      include: [
        { model: User, as: "player0" },
        { model: User, as: "player1" },
        { model: Playtest, as: "playtest0" },
        { model: Playtest, as: "playtest1" },
      ],
    });
    if (!game) {
      throw new NotFoundException("Game not found");
    }

    return {
      id: game.id,
      player0: {
        id: game.player0.id,
        name: game.player0.username,
        deckSelected: game.playtest0 !== null,
        canSelectDeck:
          game.playtest0 === null &&
          game.player0.id === this.userService.user.id,
        playtestId: game.playtest0?.id,
        canControl: game.player0.id === this.userService.user.id,
      },
      player1: {
        id: game.player1.id,
        name: game.player1.username,
        deckSelected: game.playtest1 !== null,
        canSelectDeck:
          game.playtest1 === null &&
          game.player1.id === this.userService.user.id,
        playtestId: game.playtest1?.id,
        canControl: game.player1.id === this.userService.user.id,
      },
      createdAt: game.createdAt,
    };
  }

  @Delete(":id")
  async deleteMatch(@Param("id") id: string) {
    const game = await Game.findByPk(id);
    if (!game) {
      throw new NotFoundException("Game not found");
    }
    await game.destroy();
  }

  @Post()
  async createMatch(@Body() body: { enemyId: number }) {
    return await Game.create({
      createdAt: Math.floor(Date.now() / 1000),
      player0_id: this.userService.user.id,
      player1_id: body.enemyId,
      game0: "{}",
      game1: "{}",
    });
  }

  @Post(":id/selectDeck")
  async selectDeck(
    @Param("id") id: string,
    @Body()
    body: { deckId?: number; playerIndex: number; moxfieldId?: string },
  ) {
    let promoId = "";
    let name = "";
    let moxfieldId = "";
    if (!body.moxfieldId && !body.deckId) {
      throw new BadRequestException("id not provided");
    }

    const game = await Game.findByPk(id);
    if (!game) {
      throw new NotFoundException("Game not found");
    }

    let gameState: GameState;
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
      gameState = this.playtestService.createGameFromDeck(deck);
      promoId = deck.promoId;
      name = deck.name;
    } else if (body.moxfieldId) {
      const moxFieldDeck = await this.moxfieldService.loadDeckById(
        body.moxfieldId,
      );
      gameState = this.playtestService.createGameFromDeckDTO(moxFieldDeck);
      promoId = moxFieldDeck.promoId;
      name = moxFieldDeck.name;
      moxfieldId = body.moxfieldId;
    } else {
      throw new BadRequestException("id not provided");
    }

    
    const relatedCards = await this.playtestService.getRelatedCards(gameState);

    const createdPlaytest = await Playtest.create({
      creator_id: this.userService.user.id,
      createdAt: Math.floor(Date.now() / 1000),
      game: JSON.stringify(gameState),
      allScryfallIds: "",
      promoId,
      name,
      moxfieldId,
      relatedCards: JSON.stringify(relatedCards),
    });

    if (body.playerIndex === 0) {
      game.playtest0Id = createdPlaytest.id;
    } else {
      game.playtest1Id = createdPlaytest.id;
    }
    await game.save();

    return createdPlaytest;
  }
}

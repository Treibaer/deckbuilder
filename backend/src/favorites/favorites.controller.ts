import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { FavoriteDeck } from "src/decks/entities/favorite-deck";
import { MoxfieldService } from "src/moxfield/moxfield.service";
import { UsersService } from "src/users/users.service";

@Controller("api/v1/favorites")
export class FavoritesController {
  constructor(
    private readonly userService: UsersService,
    private readonly moxfieldService: MoxfieldService,
  ) {}

  @Get()
  async findAll() {
    const decks = await FavoriteDeck.findAll({
      where: {
        creatorId: this.userService.user.id,
      },
    });

    // fetch moxfield decks
    const moxfieldDecks = await Promise.all(
      decks.map((deck) => this.moxfieldService.loadDeckById(deck.moxfieldId)),
    );
    // clean mainboard
    moxfieldDecks.forEach((deck) => {
      deck.mainboard = [];
      deck.sideboard = [];
      deck.commanders = [];
    });
    return moxfieldDecks;
  }

  @Get(":id")
  async findOne() {
    return await FavoriteDeck.findOne();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() body: { moxfieldId: string; creator_id: number; createdAt: number },
  ) {
    const existing = await FavoriteDeck.findOne({
      where: {
        creatorId: this.userService.user.id,
        moxfieldId: body.moxfieldId,
      },
    });
    if (existing) {
      await existing.destroy();
      return {};
    }
    return await FavoriteDeck.create({
      ...body,
      createdAt: Math.floor(Date.now() / 1000),
      creatorId: this.userService.user.id,
    });
  }
}

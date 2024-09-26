import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { CardsService } from "src/cards/cards.service";
import { Card } from "src/decks/entities/card.entity";
import { FavoriteCard } from "src/decks/entities/favorite-card";
import { FavoriteDeck } from "src/decks/entities/favorite-deck";
import { MoxfieldService } from "src/moxfield/moxfield.service";
import { UsersService } from "src/users/users.service";

@Controller("api/v1/favorites")
export class FavoritesController {
  constructor(
    private readonly userService: UsersService,
    private readonly moxfieldService: MoxfieldService,
    private readonly cardService: CardsService,
  ) {}

  @Get()
  async findAll() {
    const decks = await FavoriteDeck.findAll({
      where: {
        creator_id: this.userService.user.id,
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

    const cards = await FavoriteCard.findAll({
      where: {
        creator_id: this.userService.user.id,
      },
    });

    let cardEntities = await Promise.all(
      cards.map((deck) => Card.findByPk(deck.scryfallId)),
    );

    // filter out null cards
    const cardEntities2: Card[] = cardEntities.filter((card) => card !== null);

    const transformedCards = await Promise.all(
      cardEntities2.map((card) => this.cardService.mapCard(card)),
    );
    transformedCards.sort((a, b) => a.name.localeCompare(b.name));
    return { moxfieldDecks, cards: transformedCards };
  }

  @Post("decks")
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: { moxfieldId: string; favorite: boolean }) {
    const existing = await FavoriteDeck.findOne({
      where: {
        creator_id: this.userService.user.id,
        moxfieldId: body.moxfieldId,
      },
    });
    if (existing) {
      if (!body.favorite) {
        await existing.destroy();
      }
      return {};
    }
    return await FavoriteDeck.create({
      ...body,
      createdAt: Math.floor(Date.now() / 1000),
      creator_id: this.userService.user.id,
    });
  }

  @Post("cards")
  @HttpCode(HttpStatus.OK)
  async createCard(@Body() body: { scryfallId: string; favorite: boolean }) {
    const existing = await FavoriteCard.findOne({
      where: {
        creator_id: this.userService.user.id,
        scryfallId: body.scryfallId,
      },
    });
    if (existing) {
      if (!body.favorite) {
        await existing.destroy();
      }
      return {};
    }
    return await FavoriteCard.create({
      scryfallId: body.scryfallId,
      createdAt: Math.floor(Date.now() / 1000),
      creator_id: this.userService.user.id,
    });
  }
  @Get("cards/:scryfallId")
  @HttpCode(HttpStatus.OK)
  async isFavorite(@Param("scryfallId") scryfallId: string) {
    console.log(scryfallId);
    const existing = await FavoriteCard.findOne({
      where: {
        creator_id: this.userService.user.id,
        scryfallId: scryfallId,
      },
    });
    return existing !== null;
  }
}

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CardService } from "src/cards/card.service";
import { Card } from "src/decks/entities/card.entity";
import { FavoriteCard } from "src/decks/entities/favorite-card";
import { FavoriteDeck } from "src/decks/entities/favorite-deck";
import { MoxfieldService } from "src/moxfield/moxfield.service";
import { UserService } from "src/users/user.service";

@Injectable()
export class FavoriteService {
  constructor(
    private readonly userService: UserService,
    private readonly moxfieldService: MoxfieldService,
    private readonly cardService: CardService,
  ) {}

  private get userId() {
    if (!this.userService.user) {
      throw new UnauthorizedException();
    }
    return this.userService.user.id;
  }

  async findAll() {
    const decks = await FavoriteDeck.findAll({
      where: {
        creator_id: this.userId,
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
        creator_id: this.userId,
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

  async addDeckToFavorites(moxfieldId: string, favorite: boolean) {
    const existing = await FavoriteDeck.findOne({
      where: {
        creator_id: this.userId,
        moxfieldId: moxfieldId,
      },
    });
    if (existing) {
      if (!favorite) {
        await existing.destroy();
      }
      return {};
    }
    return await FavoriteDeck.create({
      moxfieldId,
      favorite,
      createdAt: Math.floor(Date.now() / 1000),
      creator_id: this.userId,
    });
  }

  async addCardToFavorites(scryfallId: string, favorite: boolean) {
    const existing = await FavoriteCard.findOne({
      where: {
        creator_id: this.userService.user.id,
        scryfallId: scryfallId,
      },
    });
    if (existing) {
      if (!favorite) {
        await existing.destroy();
      }
      return {};
    }
    return await FavoriteCard.create({
      scryfallId,
      createdAt: Math.floor(Date.now() / 1000),
      creator_id: this.userService.user.id,
    });
  }

  async isFavorite(scryfallId: string) {
    const existing = await FavoriteCard.findOne({
      where: {
        creator_id: this.userService.user.id,
        scryfallId: scryfallId,
      },
    });
    return existing !== null;
  }
}

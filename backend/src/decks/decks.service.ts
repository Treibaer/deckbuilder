import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DeckDto } from "./dto/deck.dto";
import { PatchDeckDto } from "./dto/patch-deck.dto";
import { PostDeckCardsDto } from "./dto/post-deck-cards.dt";
import { Card } from "./entities/card.entity";
import { DeckCard } from "./entities/deck-card.entity";
import { Deck } from "./entities/deck.entity";
import { User } from "./entities/user.entity";

@Injectable()
export class DecksService {
  static userId = 3;
  constructor(
    @InjectModel(Deck) private deckModel: typeof Deck,
    // private readonly sequelize: Sequelize,
  ) {}

  async create(createDeckDto: DeckDto) {
    try {
      await this.deckModel.create({
        ...createDeckDto,
        creator_id: DecksService.userId,
        promoId: "",
        format: "",
        description: "",
      });
      return createDeckDto;
    } catch (e) {
      throw e;
    }
  }

  async findAll(): Promise<Deck[]> {
    return await this.deckModel.findAll({
      where: { creator_id: DecksService.userId },
      include: [DeckCard],
    });
  }

  async findOne(id: number) {
    return await this.deckModel.findByPk(id, {
      include: [
        User,
        {
          model: DeckCard,
          include: [Card],
        },
      ],
    });
  }

  async updatePut(id: number, patchDeckDto: PatchDeckDto) {
    const deck = await this.findOne(id);

    if (deck && deck.creator.id !== DecksService.userId) {
      throw new UnauthorizedException();
    }

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }
    if (
      patchDeckDto.action === "moveZone" &&
      patchDeckDto.originZone &&
      patchDeckDto.destinationZone
    ) {
      const originZone = patchDeckDto.originZone;
      const destinationZone = patchDeckDto.destinationZone;

      // search deck for card
      const oldDeckCard = deck.cards.find(
        (card) =>
          card.card.scryfallId === patchDeckDto.cardId &&
          card.zone === originZone,
      );
      if (!oldDeckCard) {
        throw new NotFoundException("Card not found in deck");
      }
      const existingCardInDestinationZone = deck.cards.find(
        (card) =>
          card.card.scryfallId === patchDeckDto.cardId &&
          card.zone === destinationZone,
      );
      if (existingCardInDestinationZone) {
        // update quantity
        existingCardInDestinationZone.quantity += oldDeckCard.quantity;
        await existingCardInDestinationZone.save();
        await oldDeckCard.destroy();
      } else {
        oldDeckCard.zone = destinationZone;
        await oldDeckCard.save();
      }
      return [];
    }
    if (
      patchDeckDto.action === "replaceCard" &&
      patchDeckDto.oldId &&
      patchDeckDto.newId
    ) {
      const oldId = patchDeckDto.oldId;
      const newId = patchDeckDto.newId;
      const oldDeckCard = deck.cards.find(
        (card) => card.card.scryfallId === oldId,
      );
      if (!oldDeckCard) {
        throw new NotFoundException("Card not found in deck");
      }
      const newCard = await Card.findByPk(newId);
      if (!newCard) {
        throw new NotFoundException("Card not found");
      }
      oldDeckCard.scryfallId = newCard.scryfallId;

      if (deck.promoId === oldId) {
        deck.promoId = newId;
      }
      await oldDeckCard.save();
      await deck.save();
      return [];
    }
    throw new BadRequestException("Invalid data");
  }

  async remove(id: number) {
    const deck = await this.findOne(id);

    if (deck && deck.creator.id !== DecksService.userId) {
      throw new UnauthorizedException();
    }

    await deck?.destroy();
  }

  async update(id: number, deckDto: DeckDto) {
    const deck = await this.findOne(id);

    if (deck && deck.creator.id !== DecksService.userId) {
      throw new UnauthorizedException();
    }

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    if (deckDto.promoId !== undefined) {
      deck.promoId = deckDto.promoId;
    }
    if (deckDto.name !== undefined) {
      deck.name = deckDto.name;
    }
    if (deckDto.description !== undefined) {
      deck.description = deckDto.description;
    }
    if (deckDto.format !== undefined) {
      deck.format = deckDto.format;
    }
    return await deck.save();
  }

  async modifyCard(id: number, cardDto: PostDeckCardsDto) {
    const deck = await this.findOne(id);
    const zone = cardDto.zone || "mainboard";

    if (deck && deck.creator.id !== DecksService.userId) {
      throw new UnauthorizedException();
    }

    if (!deck) {
      throw new NotFoundException("Deck not found");
    }

    const card = await Card.findByPk(cardDto.scryfallId);
    if (!card) {
      throw new NotFoundException("Card not found");
    }
    // check if card is already in deck in the same zone
    const existingCard = deck.cards.find(
      (card) =>
        card.card.scryfallId === cardDto.scryfallId && card.zone === zone,
    );

    if (cardDto.action === "modify" && cardDto.quantity === 0) {
      cardDto.action = "remove";
    }

    switch (cardDto.action) {
      case "add":
        if (deck.promoId === "") {
          deck.promoId = cardDto.scryfallId;
          await deck.save();
        }
        if (existingCard) {
          existingCard.quantity += cardDto.quantity;
          await existingCard.save();
          return existingCard;
        } else {
          const deckCard = await DeckCard.create({
            scryfall_id: cardDto.scryfallId,
            zone,
            quantity: cardDto.quantity,
            deck_id: deck.id,
          });
          return deckCard;
        }
      case "modify":
        if (!existingCard) {
          throw new NotFoundException("Card not found in deck");
        }
        existingCard.quantity = cardDto.quantity;
        await existingCard.save();
        return [];
      case "remove":
        if (!existingCard) {
          throw new NotFoundException("Card not found in deck");
        }
        await existingCard.destroy();
        if (deck.promoId === cardDto.scryfallId) {
          // search deck for card to replace promo
          // get first card
          const newPromo = deck.cards.find(
            (card) => card.card.scryfallId !== cardDto.scryfallId,
          );
          deck.promoId = newPromo?.scryfallId || "";
          await deck.save();
        }
        return [];
      default:
        throw new BadRequestException("invalid action");
    }
  }
}

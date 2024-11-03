import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserService } from "src/users/user.service";
import { DeckDto } from "./dto/deck.dto";
import { PatchDeckDto } from "./dto/patch-deck.dto";
import { PostDeckCardsDto } from "./dto/post-deck-cards.dt";
import { Card } from "./entities/card.entity";
import { DeckCard } from "./entities/deck-card.entity";
import { Deck } from "./entities/deck.entity";
import { User } from "./entities/user.entity";

@Injectable()
export class DeckService {
  constructor(
    @InjectModel(Deck) private deckModel: typeof Deck,
    private readonly userService: UserService,
    // private readonly sequelize: Sequelize,
  ) {}

  private get userId() {
    if (!this.userService.user) {
      throw new UnauthorizedException();
    }
    return this.userService.user.id;
  }

  async create(createDeckDto: DeckDto) {
    try {
      await this.deckModel.create({
        ...createDeckDto,
        creator_id: this.userId,
        promoId: "",
        format: "",
        description: "",
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      });
      return createDeckDto;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Failed to create deck");
    }
  }

  async findAll(folderId: number | null): Promise<Deck[]> {
    const filter: any =
      folderId !== null && folderId !== 0 ? { folder_id: folderId } : {};
    console.log(folderId);
    console.log(filter);
    return await this.deckModel.findAll({
      where: {
        ...filter,
        creator_id: this.userId,
        is_archived: folderId === 0,
      },
      include: [DeckCard],
    });
  }

  async findOne(id: number) {
    const deck = await this.deckModel.findByPk(id, {
      include: [
        User,
        {
          model: DeckCard,
          include: [Card],
        },
      ],
    });
    if (!deck) {
      throw new NotFoundException("Deck not found");
    }
    return deck;
  }

  async updatePut(id: number, patchDeckDto: PatchDeckDto) {
    const deck = await this.findOne(id);

    if (deck.creator.id !== this.userId) {
      throw new UnauthorizedException();
    }

    if (deck.isLocked) {
      throw new ForbiddenException("Deck is locked");
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
        existingCardInDestinationZone.quantity += oldDeckCard.quantity;
        await existingCardInDestinationZone.save();
        await oldDeckCard.destroy();
      } else {
        oldDeckCard.zone = destinationZone;
        deck.updatedAt = Math.floor(Date.now() / 1000);
        await deck.save();
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

      deck.updatedAt = Math.floor(Date.now() / 1000);
      await oldDeckCard.save();
      await deck.save();
      return [];
    }
    throw new BadRequestException("Invalid data");
  }

  async remove(id: number) {
    const deck = await this.findOne(id);

    if (deck.creator.id !== this.userId) {
      throw new UnauthorizedException();
    }
    if (deck.isLocked) {
      throw new ForbiddenException("Deck is locked");
    }
    await DeckCard.destroy({ where: { deck_id: id } });
    await deck.destroy();
  }

  async updatePatch(id: number, deckDto: DeckDto) {
    const deck = await this.findOne(id);

    if (deck.creator.id !== this.userId) {
      throw new UnauthorizedException();
    }
    if (deck.isLocked && deckDto.isLocked !== false) {
      throw new ForbiddenException("Deck is locked");
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
    if (deckDto.isLocked !== undefined) {
      deck.isLocked = deckDto.isLocked;
    }
    if (deckDto.folderId !== undefined) {
      (deck as any).folder_id = deckDto.folderId;
    }
    if (deckDto.isArchived !== undefined) {
      deck.isArchived = deckDto.isArchived;
      if (deck.isArchived) {
        (deck as any).folder_id = null;
      }
    }
    if (!deckDto.isLocked === undefined && !deckDto.isArchived === undefined) {
      deck.updatedAt = Math.floor(Date.now() / 1000);
    }
    return await deck.save();
  }

  async modifyCard(id: number, cardDto: PostDeckCardsDto) {
    const deck = await this.findOne(id);
    const zone = cardDto.zone || "mainboard";

    if (deck.creator.id !== this.userId) {
      throw new UnauthorizedException();
    }
    if (deck.isLocked) {
      throw new ForbiddenException("Deck is locked");
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
    deck.updatedAt = Math.floor(Date.now() / 1000);
    await deck.save();

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

import { Injectable, NotFoundException } from "@nestjs/common";
import { Op } from "sequelize";
import { CardDetailDto } from "src/decks/dto/card-detail.dto";
import { Card } from "src/decks/entities/card.entity";
import { FavoriteCard } from "src/decks/entities/favorite-card";
import { MoxFieldMapping } from "src/decks/entities/moxfield-mapping.entity";
import { UsersService } from "src/users/users.service";
import { UrlService } from "src/utils/urlservice";

@Injectable()
export class CardsService {
  constructor(
    private userService: UsersService,
    private urlService: UrlService,
  ) {}

  async random(): Promise<Card> {
    const count = await Card.count();

    const randomIndex = Math.floor(Math.random() * count);

    const randomCard = await Card.findOne({
      attributes: ["scryfallId", "name"],
      offset: randomIndex,
    });

    if (!randomCard) {
      throw new NotFoundException("Card not found");
    }

    return randomCard;
  }

  async searchByTerm(term: string): Promise<Card[]> {
    if (!term) {
      return [];
    }

    const cards = await Card.findAll({
      attributes: ["scryfallId", "name", "oracleId"],
      where: {
        name: {
          [Op.like]: `%${term}%`,
        },
      },
      group: ["oracleId"],
      limit: 100,
    });

    return cards;
  }

  async getWithPrintings(scryfallId: string) {
    const card = await Card.findByPk(scryfallId);
    if (!card) {
      throw new NotFoundException("Card not found");
    }

    const printings = await Card.findAll({
      where: { oracleId: card.oracleId },
      order: [["releasedAt", "DESC"]],
    });

    return { card, printings };
  }

  async mapCard(
    card: Card,
    checkFavorites: boolean = false,
  ): Promise<CardDetailDto> {
    const cardFacesNames = card.cardFacesNames.split("###");
    let cardFaces: any = [];
    if (cardFacesNames.length > 1) {
      cardFaces = cardFacesNames.map((cardFaceName) => {
        return {
          name: cardFaceName,
        };
      });
    }
    const moxFieldMapping = await MoxFieldMapping.findOne({
      where: { scryfallId: card.scryfallId },
    });

    let isFavorite = false;
    if (checkFavorites) {
      const favorites = await FavoriteCard.count({
        where: {
          scryfall_id: card.scryfallId,
          creator_id: this.userService.user.id,
        },
      });
      isFavorite = favorites > 0;
    }
    
    return {
      scryfallId: card.scryfallId,
      name: card.name,
      releasedAt: card.releasedAt,
      setCode: card.setCode,
      setName: card.setName,
      typeLine: card.typeLine,
      oracleText: card.oracleText,
      manaCost: card.manaCost,
      image: this.getLocalUrl(card.scryfallId),
      colors: card.colors,
      rarity: card.rarity,
      cardFaces: cardFaces,
      mapping: moxFieldMapping?.moxfieldId ?? "",
      isFavorite,
    };
  }

  getLocalUrl(scryfallId: string, type: string = "normal"): string {
    return `${this.urlService.getBackendUrl()}/image/card/${type}/${scryfallId}`;
  }
}

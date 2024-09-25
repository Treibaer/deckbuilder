import { Injectable, NotFoundException } from "@nestjs/common";
import { Op } from "sequelize";
import { Card } from "src/decks/entities/card.entity";

@Injectable()
export class CardsService {
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

  async getByTerm(term: string): Promise<Card[]> {
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
}

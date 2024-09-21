import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseFilters,
} from "@nestjs/common";
import { HttpExceptionFilter } from "../utils/http-exception.filter";
import { DecksService } from "./decks.service";
import { DeckDto } from "./dto/deck.dto";
import { Card } from "./entities/card.entity";
import { CardDetailDto } from "./dto/card-detail.dto";
import { UrlService } from "src/utils/urlservice";
import { MoxFieldMapping } from "./entities/moxfield-mapping.entity";
import { Sequelize } from "sequelize-typescript";
import { MagicCardDto } from "./dto/card.dto";

@Controller("api/v1/cards")
@UseFilters(HttpExceptionFilter)
export class CardController {
  constructor(
    private readonly decksService: DecksService,
    private readonly urlService: UrlService,
  ) {}

  @Get("random")
  async random(): Promise<any> {
    // First, get the count of all records
    const count = await Card.count();

    // Generate a random number for the offset
    const randomIndex = Math.floor(Math.random() * count);

    // Retrieve the random card using the offset
    const randomCard = await Card.findOne({
      offset: randomIndex,
    });

    if (!randomCard) {
      throw new NotFoundException("Card not found");
    }

    return {
      scryfallId: randomCard.scryfallId,
      name: randomCard.name,
      image: this.getLocalUrl(randomCard.scryfallId),
    };
  }

  @Get(":scryfallId([a-f0-9-]{36})") // Enforce UUID pattern for scryfallId
  async getWithPrintings(
    @Param("scryfallId") scryfallId: string,
  ): Promise<{ card: CardDetailDto; printings: CardDetailDto[] }> {
    const card = await Card.findByPk(scryfallId);
    if (!card) {
      throw new NotFoundException("Card not found");
    }
    const printings = await Card.findAll({
      where: { oracleId: card.oracleId },
      order: [["releasedAt", "DESC"]],
    });
    const transformedCard = await this.mapCard(card);
    const transformedPrintings = await Promise.all(
      printings.map((printing) => this.mapCard(printing)),
    );
    return { card: transformedCard, printings: transformedPrintings };
  }

  async mapCard(card: Card): Promise<CardDetailDto> {
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
    };
  }

  private getLocalUrl(scryfallId: string, type: string = "normal"): string {
    return `${this.urlService.getBackendUrl()}/image/card/${type}/${scryfallId}`;
  }
}

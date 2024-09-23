import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters
} from "@nestjs/common";
import { UrlService } from "src/utils/urlservice";
import { CardDetailDto } from "../decks/dto/card-detail.dto";
import { Card } from "../decks/entities/card.entity";
import { MoxFieldMapping } from "../decks/entities/moxfield-mapping.entity";
import { HttpExceptionFilter } from "../utils/http-exception.filter";
import { CardsService } from "./cards.service";

@Controller("api/v1/cards")
@UseFilters(HttpExceptionFilter)
export class CardController {
  constructor(
    private readonly cardService: CardsService,
    private readonly urlService: UrlService,
  ) {}

  @Get("random")
  async random(): Promise<any> {
    const randomCard = await this.cardService.random();
    return {
      scryfallId: randomCard.scryfallId,
      name: randomCard.name,
      image: this.getLocalUrl(randomCard.scryfallId),
    };
  }

  @Get()
  async getByTerm(@Query("term") term: string): Promise<any> {
    const cards = await this.cardService.getByTerm(term);
    return {
      cards: cards.map((card) => {
        return {
          scryfallId: card.scryfallId,
          name: card.name,
          image: this.getLocalUrl(card.scryfallId),
          imageSmall: this.getLocalUrl(card.scryfallId, "small"),
          imageLarge: this.getLocalUrl(card.scryfallId, "large"),
          imagePng: this.getLocalUrl(card.scryfallId, "png"),
        };
      }),
    };
  }

  @Get(":scryfallId([a-f0-9-]{36})") // Enforce UUID pattern for scryfallId
  async getWithPrintings(
    @Param("scryfallId") scryfallId: string,
  ): Promise<{ card: CardDetailDto; printings: CardDetailDto[] }> {
    const { card, printings } =
      await this.cardService.getWithPrintings(scryfallId);

    const transformedCard = await this.mapCard(card);
    const transformedPrintings = await Promise.all(
      printings.map((printing) => this.mapCard(printing)),
    );
    return { card: transformedCard, printings: transformedPrintings };
  }

  private async mapCard(card: Card): Promise<CardDetailDto> {
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

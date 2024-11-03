import { Controller, Get, Param, Query, UseFilters } from "@nestjs/common";
import { CardDetailDto } from "../decks/dto/card-detail.dto";
import { HttpExceptionFilter } from "../utils/http-exception.filter";
import { CardService } from "./card.service";

@Controller("api/v1/cards")
@UseFilters(HttpExceptionFilter)
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get("random")
  async random(): Promise<any> {
    const randomCard = await this.cardService.random();
    return {
      scryfallId: randomCard.scryfallId,
      name: randomCard.name,
      image: this.cardService.getLocalUrl(randomCard.scryfallId),
    };
  }

  @Get()
  async findByTerm(@Query("term") term: string): Promise<any> {
    const cards = await this.cardService.searchByTerm(term);
    return {
      cards: cards.map((card) => {
        return {
          scryfallId: card.scryfallId,
          name: card.name,
          image: this.cardService.getLocalUrl(card.scryfallId),
          imageSmall: this.cardService.getLocalUrl(card.scryfallId, "small"),
          imageLarge: this.cardService.getLocalUrl(card.scryfallId, "large"),
          imagePng: this.cardService.getLocalUrl(card.scryfallId, "png"),
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

    const transformedCard = await this.cardService.mapCard(card, true);
    const transformedPrintings = await Promise.all(
      printings.map((printing) => this.cardService.mapCard(printing)),
    );
    return { card: transformedCard, printings: transformedPrintings };
  }
}

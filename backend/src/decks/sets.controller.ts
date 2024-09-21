import { Controller, Get } from "@nestjs/common";
import { UrlService } from "src/utils/urlservice";
import { CardSetDto } from "./dto/card-set.dto";
import { CardSet } from "./entities/card-set.entity";

@Controller("api/v1/sets")
export class SetsController {
  constructor(private readonly urlService: UrlService) {}

  @Get()
  async findAll(): Promise<CardSetDto[]> {
    let cardSets = await CardSet.findAll({
      order: [["released_at", "DESC"]],
    });
    // filter out sets with cardcount <= 20
    cardSets = cardSets.filter((set) => set.cardCount > 20);
    return this.transformSets(cardSets);
  }

  private transformSets(sets: CardSet[]): CardSetDto[] {
    return sets.map((set) => {
      return {
        id: set.id,
        scryfallId: set.scryfallId,
        name: set.name,
        code: set.code,
        setType: set.setType,
        iconSvgUri: this.getLocalUrl(set.scryfallId),
        cardCount: set.cardCount,
        releasedAt: set.releasedAt,
      };
    });
  }

  private getLocalUrl(scryfallId: string): string {
    return `${this.urlService.getBackendUrl()}/image/set/${scryfallId}`;
  }
}

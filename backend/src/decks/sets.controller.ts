import { Controller, Get, Query } from "@nestjs/common";
import { UrlService } from "src/utils/urlservice";
import { CardSetDto } from "./dto/card-set.dto";
import { CardSet } from "./entities/card-set.entity";

@Controller("api/v1/sets")
export class SetsController {
  constructor(private readonly urlService: UrlService) {}

  private allowedSetTypes = [
    "core",
    "expansion",
    "commander",
    "default",
    "all",
  ];

  @Get()
  async findAll(@Query("setType") setType: string): Promise<CardSetDto[]> {
    let cardSets = await CardSet.findAll({
      order: [["released_at", "DESC"]],
    });
    // filter out sets with cardcount <= 20
    setType = this.allowedSetTypes.includes(setType) ? setType : "default";
    cardSets = cardSets.filter((set) => set.cardCount > 20);

    return this.transformSets(cardSets, setType);
  }

  private transformSets(sets: CardSet[], setType: string): CardSetDto[] {
    // filter sets with set name: core, expansion, commander
    switch (setType) {
      case "all":
        break;
      case "default":
        sets = sets.filter((set) => {
          return (
            set.setType === "core" ||
            set.setType === "expansion" ||
            set.setType === "commander"
          );
        });
        break;
      default:
        sets = sets.filter((set) => set.setType === setType);
        break;
    }
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

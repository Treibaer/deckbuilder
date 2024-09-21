import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MoxfieldService } from "./moxfield.service";

@Controller("api/v1/moxfield")
export class MoxfieldController {
  constructor(private readonly moxfieldService: MoxfieldService) {}

  @Get("decks")
  async getDecks(@Query("format") format: string, @Query("page") page: number) {
    return this.moxfieldService.loadDecks(format, page);
  }

  @Get("decks-by-card-id/:id")
  async getDecksById(
    @Query("format") format: string,
    @Query("page") page: number,
    @Query("commander") commander: number,
    @Param("id") id: string,
  ) {
    return this.moxfieldService.loadDecks(format, page, id, commander === 1);
  }

  @Get("decks/:id")
  async getDeckById(@Param("id") id: string) {
    return this.moxfieldService.loadDeckById(id);
  }

  @Post("decks/:id/clone")
  async cloneDeckById(@Param("id") id: string) {
    return this.moxfieldService.cloneDeckById(id);
  }

  @Get("import/sets")
  async importSets() {
    return this.moxfieldService.importSets();
  }
}

import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MoxfieldService } from "./moxfield.service";
import { config } from "process";
import { Settings } from "src/decks/entities/settings.entity";

@Controller("api/v1/moxfield")
export class MoxfieldController {
  constructor(private readonly moxfieldService: MoxfieldService) {}

  @Get("decks")
  async getDecks(
    @Query("format") format: string,
    @Query("page") page: number,
    @Query("sortType") sortType: string,
  ) {
    return this.moxfieldService.loadDecks({ format, page, sortType });
  }

  @Get("decks-by-card-id/:id")
  async getDecksById(
    @Query("format") format: string,
    @Query("page") page: number,
    @Query("sortType") sortType: string,
    @Query("commander") commander: number,
    @Param("id") id: string,
  ) {
    return this.moxfieldService.loadDecks({
      format,
      page,
      moxfieldId: id,
      sortType,
      commander: Number(commander) === 1,
    });
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
    await this.moxfieldService.importSets();
    const settings = await Settings.findOne();
    if (settings) {
      settings.lastImportMoxFieldMappings = Math.floor(Date.now() / 1000);
      await settings.save();
    }
    return settings;
  }
}

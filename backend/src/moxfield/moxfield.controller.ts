import {
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import { Settings } from "src/decks/entities/settings.entity";
import { MoxfieldService } from "./moxfield.service";

@Controller("api/v1/moxfield")
// @UseInterceptors(LoggingInterceptor)
export class MoxfieldController {
  constructor(private readonly moxfieldService: MoxfieldService) {}

  @Get("decks")
  async findAll(
    @Query("format") format: string,
    @Query("page") page: number,
    @Query("sortType") sortType: string,
  ) {
    try {
      return this.moxfieldService.fetchDecksFromApi({ format, page, sortType });
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  @Get("decks/:id")
  async findOne(@Param("id") id: string) {
    return this.moxfieldService.loadDeckById(id);
  }

  @Get("decks-by-card-id/:id")
  async findDecksById(
    @Query("format") format: string,
    @Query("page") page: number,
    @Query("sortType") sortType: string,
    @Query("commander") commander: number,
    @Param("id") id: string,
  ) {
    return this.moxfieldService.fetchDecksFromApi({
      format,
      page,
      moxfieldId: id,
      sortType,
      commander: Number(commander) === 1,
    });
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

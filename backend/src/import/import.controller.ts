import { Controller, Get, Query } from "@nestjs/common";
import { ImportService } from "./import.service";
import { Settings } from "src/decks/entities/settings.entity";

@Controller("api/v1/import")
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get("cards")
  async importCards(@Query("force") force: boolean = false) {
    // import cards from scryfall
    await this.importService.bulkImport(force);
    const settings = await Settings.findOne();
    if (settings) {
      settings.lastImportCards = Math.floor(Date.now() / 1000);
      await settings.save();
    }
    return settings;
  }

  @Get("symbols")
  async importSymbols() {
    // import symbols from scryfall
    await this.importService.importSymbols();
    const settings = await Settings.findOne();
    if (settings) {
      settings.lastImportSymbols = Math.floor(Date.now() / 1000);
      await settings.save();
    }
    return settings;
  }

  @Get("sets")
  async importSets() {
    await this.importService.importSets();
    const settings = await Settings.findOne();
    if (settings) {
      settings.lastImportSets = Math.floor(Date.now() / 1000);
      await settings.save();
    }
    return settings;
  }

  @Get("status")
  async getStatus() {
    return await Settings.findOne();
  }
}

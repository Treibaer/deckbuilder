import { Controller, Get } from "@nestjs/common";
import { ImportService } from "./import.service";

@Controller("api/v1/import")
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get("cards")
  async importCards() {
    // import cards from scryfall
    await this.importService.bulkImport(true);
  }
}

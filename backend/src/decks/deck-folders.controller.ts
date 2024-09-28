import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { DeckTransformer } from "./deck.transformer";
import { DecksService } from "./decks.service";
import { DeckFoldersService } from "./deck-folders.service";

@Controller("api/v1/decks/folders")
export class DeckFoldersController {
  constructor(private readonly deckFoldersService: DeckFoldersService) {}

  @Post()
  createFolder(@Body() folder: { name: string }) {
    return this.deckFoldersService.createFolder(folder.name);
  }

  @Patch(":id")
  updateFolder(@Param("id") id: string, @Body() folder: { name: string }) {
    return this.deckFoldersService.updateFolder(+id, folder.name);
  }

  @Get()
  async getFolders() {
    return this.deckFoldersService.getFolders();
  }

  @Delete(":id")
  deleteFolder(@Param("id") id: string) {
    return this.deckFoldersService.deleteFolder(+id);
  }
}

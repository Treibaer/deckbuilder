import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
} from "@nestjs/common";
import { DeckTransformer } from "./deck.transformer";
import { DecksService } from "./decks.service";
import { DeckDto } from "./dto/deck.dto";
import { PatchDeckDto } from "./dto/patch-deck.dto";
import { PostDeckCardsDto } from "./dto/post-deck-cards.dt";
import { HttpExceptionFilter } from "../utils/http-exception.filter";

@Controller("api/v1/decks")
@UseFilters(HttpExceptionFilter)
export class DecksController {
  constructor(
    private readonly decksService: DecksService,
    private readonly deckTransformer: DeckTransformer,
  ) {}

  @Post()
  create(@Body() createDeckDto: DeckDto) {
    return this.decksService.create(createDeckDto);
  }

  @Post("folders")
  createFolder(@Body() folder: { name: string }) {
    return this.decksService.createFolder(folder.name);
  }

  @Patch("folders/:id")
  updateFolder(@Param("id") id: string, @Body() folder: { name: string }) {
    return this.decksService.updateFolder(+id, folder.name);
  }

  @Delete("folders/:id")
  deleteFolder(@Param("id") id: string) {
    return this.decksService.deleteFolder(+id);
  }

  @Get("folders")
  async getFolders() {
    return this.decksService.getFolders();
  }

  @Get()
  async findAll(@Query("folderId") folderId?: string): Promise<DeckDto[]> {
    const decks = await this.decksService.findAll(folderId ? parseInt(folderId) : null);
    const transformedDecks = decks.map((deck) => {
      const cardCount = deck.cards.filter(
        (card) => card.zone !== "sideboard",
      ).length;
      return {
        id: deck.id,
        name: deck.name,
        description: deck.description,
        promoId: deck.promoId,
        format: "",
        cardCount: cardCount,
        viewCount: 0,
        colors: [],
        commanders: [],
        mainboard: [],
        sideboard: [],
        isLocked: deck.isLocked,
        updatedAt: deck.updatedAt,
        folderId: deck.folder_id,
        isArchived: deck.isArchived,
      };
    });
    return transformedDecks;
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<DeckDto> {
    const deck = await this.decksService.findOne(id);
    return this.deckTransformer.transformDeck(deck);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() patchDeckDto: PatchDeckDto) {
    return this.decksService.updatePut(+id, patchDeckDto);
  }

  @Patch(":id")
  updatePatch(@Param("id") id: string, @Body() deckDto: DeckDto) {
    return this.decksService.updatePatch(+id, deckDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.decksService.remove(+id);
  }

  // deprecated
  @Post(":id/cards")
  modifyCard(@Param("id") id: string, @Body() cardDto: PostDeckCardsDto) {
    return this.decksService.modifyCard(+id, cardDto);
  }
}

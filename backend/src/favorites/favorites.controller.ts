import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { FavoritesService } from "./favorites.service";

@Controller("api/v1/favorites")
export class FavoritesController {
  constructor(
    private readonly userService: UsersService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post("decks")
  @HttpCode(HttpStatus.OK)
  async addDeck(@Body() body: { moxfieldId: string; favorite: boolean }) {
    return await this.favoritesService.addDeckToFavorites(
      body.moxfieldId,
      body.favorite,
    );
  }

  @Post("cards")
  @HttpCode(HttpStatus.OK)
  async addCard(@Body() body: { scryfallId: string; favorite: boolean }) {
    return await this.favoritesService.addCardToFavorites(
      body.scryfallId,
      body.favorite,
    );
  }

  @Get("cards/:scryfallId")
  @HttpCode(HttpStatus.OK)
  async isFavorite(@Param("scryfallId") scryfallId: string) {
    return await this.favoritesService.isFavorite(scryfallId);
  }
}

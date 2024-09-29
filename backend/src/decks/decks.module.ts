import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { MoxfieldService } from "src/moxfield/moxfield.service";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { UrlService } from "src/utils/urlservice";
import { DeckFoldersController } from "./deck-folders.controller";
import { DeckTransformer } from "./deck.transformer";
import { DecksController } from "./decks.controller";
import { DecksService } from "./decks.service";
import { Card } from "./entities/card.entity";
import { DeckCard } from "./entities/deck-card.entity";
import { Deck } from "./entities/deck.entity";
import { MoxFieldMapping } from "./entities/moxfield-mapping.entity";
import { User } from "./entities/user.entity";
import { PlayTestsContoller } from "./playtests.controller";
import { PlaytestsService } from "./playtests.service";
import { SetsController } from "./sets.controller";
import { DeckFoldersService } from "./deck-folders.service";
import { DraftsController } from "./drafts.controller";
import { DraftsService } from "./drafts.service";

@Module({
  imports: [
    SequelizeModule.forFeature([Deck, User, DeckCard, Card, MoxFieldMapping]),
    UsersModule,
  ],
  controllers: [
    DecksController,
    PlayTestsContoller,
    SetsController,
    DeckFoldersController,
    DraftsController,
  ],
  providers: [
    DecksService,
    DeckTransformer,
    ConfigService,
    UrlService,
    UsersService,
    MoxfieldService,
    PlaytestsService,
    DeckFoldersService,
    DraftsService,
  ],
  exports: [
    SequelizeModule,
    // , DecksService
  ],
})
export class DecksModule {}

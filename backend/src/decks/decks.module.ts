import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { MoxfieldService } from "src/moxfield/moxfield.service";
import { UsersModule } from "src/users/users.module";
import { UserService } from "src/users/user.service";
import { UrlService } from "src/utils/urlservice";
import { DeckFoldersController } from "./deck-folders.controller";
import { DeckTransformer } from "./deck.transformer";
import { DecksController } from "./decks.controller";
import { DeckService } from "./deck.service";
import { Card } from "./entities/card.entity";
import { DeckCard } from "./entities/deck-card.entity";
import { Deck } from "./entities/deck.entity";
import { MoxFieldMapping } from "./entities/moxfield-mapping.entity";
import { User } from "./entities/user.entity";
import { PlayTestsContoller } from "./playtests.controller";
import { PlaytestService } from "./playtest.service";
import { SetsController } from "./sets.controller";
import { DeckFolderService } from "./deck-folder.service";
import { DraftsController } from "./drafts.controller";
import { DraftService } from "./draft.service";

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
    DeckService,
    DeckTransformer,
    ConfigService,
    UrlService,
    UserService,
    MoxfieldService,
    PlaytestService,
    DeckFolderService,
    DraftService,
  ],
  exports: [
    SequelizeModule,
    // , DecksService
  ],
})
export class DecksModule {}

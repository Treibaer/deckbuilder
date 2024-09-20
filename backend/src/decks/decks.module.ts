import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "src/users/users.module";
import { UsersService } from "src/users/users.service";
import { UrlService } from "src/utils/urlservice";
import { CardController } from "./cards.controller";
import { DeckTransformer } from "./deck.transformer";
import { DecksController } from "./decks.controller";
import { DecksService } from "./decks.service";
import { Card } from "./entities/card.entity";
import { DeckCard } from "./entities/deck-card.entity";
import { Deck } from "./entities/deck.entity";
import { MoxFieldMapping } from "./entities/moxfield.entity";
import { User } from "./entities/user.entity";
import { PlayTestsContoller } from "./playtests.controller";

@Module({
  imports: [SequelizeModule.forFeature([Deck, User, DeckCard, Card, MoxFieldMapping]), UsersModule],
  controllers: [DecksController, CardController, PlayTestsContoller],
  providers: [DecksService, DeckTransformer, ConfigService, UrlService, UsersService],
  exports: [
    SequelizeModule,
    // , DecksService
  ],
})
export class DecksModule {}

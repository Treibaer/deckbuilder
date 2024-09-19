import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UrlService } from "src/utils/urlservice";
import { CardController } from "./cards.controller";
import { DeckTransformer } from "./deck.transformer";
import { DecksController } from "./decks.controller";
import { DecksService } from "./decks.service";
import { Card } from "./entities/card.entity";
import { DeckCard } from "./entities/deck-card.entity";
import { Deck } from "./entities/deck.entity";
import { User } from "./entities/user.entity";
import { MoxFieldMapping } from "./entities/moxfield.entity";

@Module({
  imports: [SequelizeModule.forFeature([Deck, User, DeckCard, Card, MoxFieldMapping])],
  controllers: [DecksController, CardController],
  providers: [DecksService, DeckTransformer, ConfigService, UrlService],
  exports: [
    SequelizeModule,
    // , DecksService
  ],
})
export class DecksModule {}

import { Module } from "@nestjs/common";
import { DecksService } from "./decks.service";
import { DecksController } from "./decks.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Deck } from "./entities/deck.entity";
import { User } from "./entities/user.entity";
import { DeckCard } from "./entities/deck-card.entity";
import { Card } from "./entities/card.entity";
import { DeckTransformer } from "./deck.transformer";

@Module({
  imports: [SequelizeModule.forFeature([Deck, User, DeckCard, Card])],
  controllers: [DecksController],
  providers: [DecksService, DeckTransformer],
  exports: [
    SequelizeModule,
    // , DecksService
  ],
})
export class DecksModule {}

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DecksModule } from "./decks/decks.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Deck } from "./decks/entities/deck.entity";
import { User } from "./decks/entities/user.entity";
import { DeckCard } from "./decks/entities/deck-card.entity";
import { Card } from "./decks/entities/card.entity";

@Module({
  imports: [
    DecksModule,

    SequelizeModule.forRoot({
      dialect: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "magic_dev",
      models: [Deck, User, DeckCard, Card],
      autoLoadModels: true,
      logging: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

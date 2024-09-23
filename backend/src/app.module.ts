import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AccessToken } from "./auth/entities/access-token";
import { DecksController } from "./decks/decks.controller";
import { DecksModule } from "./decks/decks.module";
import { Card } from "./decks/entities/card.entity";
import { DeckCard } from "./decks/entities/deck-card.entity";
import { Deck } from "./decks/entities/deck.entity";
import { Playtest } from "./decks/entities/playtest.entity";
import { CardSet } from "./decks/entities/card-set.entity";
import { User } from "./decks/entities/user.entity";
import { ImageModule } from "./image/image.module";
import { UsersModule } from "./users/users.module";
import { logger } from "./utils/logger.middleware";
import { MoxfieldService } from "./moxfield/moxfield.service";
import { MoxfieldController } from "./moxfield/moxfield.controller";
import { MatchesController } from "./matches/matches.controller";
import { MatchesService } from "./matches/matches.service";
import { Game } from "./decks/entities/game.entity";
import { PlaytestsService } from "./decks/playtests.service";
import { ImportService } from "./import/import.service";
import { ImportController } from "./import/import.controller";
import { Settings } from "./decks/entities/settings.entity";
import { FavoriteDeck } from "./decks/entities/favorite-deck";
import { FavoritesController } from './favorites/favorites.controller';
import { Sequelize } from "sequelize";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    DecksModule,
    ImageModule,
    // SequelizeModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     dialect: "mariadb",
    //     host: configService.get("DB_HOST"),
    //     port: configService.get("DB_PORT"),
    //     username: configService.get("DB_USER"),
    //     password: configService.get("DB_PASSWORD"),
    //     database: configService.get("DB_NAME"),
    //     models: [Deck, User, DeckCard, Card, AccessToken, Playtest, CardSet, Game],
    //     autoLoadModels: true,
    //     logging: false,
    //   }),
    // }),

    SequelizeModule.forRoot({
      dialect: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "magic_dev",
      models: [
        Deck,
        User,
        DeckCard,
        Card,
        AccessToken,
        Playtest,
        CardSet,
        Game,
        Settings,
        FavoriteDeck,
      ],
      autoLoadModels: true,
      logging: false,
    }),

    ImageModule,
    AuthModule,
    UsersModule,
    // SequelizeModule.forFeature([Card, Deck, DeckCard, User, AccessToken, Playtest, CardSet, Game]),
  ],
  controllers: [
    AppController,
    MoxfieldController,
    MatchesController,
    ImportController,
    FavoritesController,
  ],
  providers: [
    AppService,
    ConfigService,
    MoxfieldService,
    MatchesService,
    PlaytestsService,
    ImportService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(DecksController);

    // Settings.sync({ alter: true });
    FavoriteDeck.sync({ alter: true });
    User.sync({ alter: true });
    
  }
}

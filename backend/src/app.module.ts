import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AccessToken } from "./auth/entities/access-token";
import { CardController } from "./cards/cards.controller";
import { CardService } from "./cards/card.service";
import { DecksModule } from "./decks/decks.module";
import { CardSet } from "./decks/entities/card-set.entity";
import { Card } from "./decks/entities/card.entity";
import { DeckCard } from "./decks/entities/deck-card.entity";
import { Deck } from "./decks/entities/deck.entity";
import { FavoriteCard } from "./decks/entities/favorite-card";
import { FavoriteDeck } from "./decks/entities/favorite-deck";
import { Game } from "./decks/entities/game.entity";
import { Playtest } from "./decks/entities/playtest.entity";
import { Settings } from "./decks/entities/settings.entity";
import { User } from "./decks/entities/user.entity";
import { PlaytestService } from "./decks/playtest.service";
import { FavoritesController } from "./favorites/favorites.controller";
import { ImageModule } from "./image/image.module";
import { ImportController } from "./import/import.controller";
import { ImportService } from "./import/import.service";
import { MatchesController } from "./matches/matches.controller";
import { MatchService } from "./matches/match.service";
import { MoxfieldController } from "./moxfield/moxfield.controller";
import { MoxfieldService } from "./moxfield/moxfield.service";
import { EventsModule } from "./playtester/playtester.module";
import { UsersModule } from "./users/users.module";
import { UrlService } from "./utils/urlservice";
import { DeckFolder } from "./decks/entities/deck-folder.entity";
import { FavoriteService } from "./favorites/favorite.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        ".env.local",
        ".env",
        "/projects/react/deckbuilder/backend/.env",
      ],
    }),
    DecksModule,
    ImageModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: "mariadb",
        host: configService.get("DB_HOST"),
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASS"),
        database: configService.get("DB_NAME"),
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
          FavoriteCard,
          DeckFolder,
        ],
        autoLoadModels: true,
        logging: false,
      }),
    }),
    ImageModule,
    AuthModule,
    UsersModule,
    EventsModule,
    // SequelizeModule.forFeature([Card, Deck, DeckCard, User, AccessToken, Playtest, CardSet, Game]),
  ],
  controllers: [
    AppController,
    MoxfieldController,
    MatchesController,
    ImportController,
    FavoritesController,
    CardController,
  ],
  providers: [
    AppService,
    ConfigService,
    MoxfieldService,
    MatchService,
    PlaytestService,
    ImportService,
    CardService,
    UrlService,
    FavoriteService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(logger).forRoutes(DecksController);
    return;
    Settings.sync({ alter: true });
    FavoriteDeck.sync({ alter: true });
    User.sync({ alter: true });
    Card.sync({ alter: true });
    Playtest.sync({ alter: true });
    Deck.sync({ alter: true });
    FavoriteCard.sync({ alter: true });
    DeckFolder.sync({ alter: true });
  }
}

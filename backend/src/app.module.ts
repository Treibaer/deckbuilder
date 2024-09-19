import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DecksModule } from "./decks/decks.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Deck } from "./decks/entities/deck.entity";
import { User } from "./decks/entities/user.entity";
import { DeckCard } from "./decks/entities/deck-card.entity";
import { Card } from "./decks/entities/card.entity";
import { logger } from "./utils/logger.middleware";
import { DecksController } from "./decks/decks.controller";
import { HttpExceptionFilter } from "./utils/http-exception.filter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ImageModule } from "./image/image.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AccessToken } from "./auth/entities/access-token";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    DecksModule,
    ImageModule,

    SequelizeModule.forRoot({
      dialect: "mariadb",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "magic_dev",
      models: [Deck, User, DeckCard, Card, AccessToken],
      autoLoadModels: true,
      logging: false,
    }),

    ImageModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes(DecksController);
  }
}

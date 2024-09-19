import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { UsersModule } from "src/users/users.module";
import { AuthGuard } from "./auth.guard";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: "your-secret-key",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    {
      provide: "APP_GUARD",
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}

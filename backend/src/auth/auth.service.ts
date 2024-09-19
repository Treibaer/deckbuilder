import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AccessToken } from "./entities/access-token";
import { User } from "src/decks/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid username or password");
    }

    // Create JWT token
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, );
    const token = await AccessToken.create({
      value: accessToken,
      user_id: user.id,
      client: "",
      ip: "",
      lastUsed: Math.floor(Date.now() / 1000),
      createdAt: Math.floor(Date.now() / 1000),
    });

    return { accessToken };
  }
}

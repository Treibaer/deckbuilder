import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "src/decks/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { AccessToken } from "./entities/access-token";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signIn(email: string, username: string, password: string, client: string) {
    const user = await this.userService.findOne(email, username);

    if (!user) {
      throw new UnauthorizedException("Invalid username or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid username or password");
    }
    return await this.createToken(user, client);
  }

  async register(username: string, email: string, password: string, client: string) {
    const user = await this.userService.findOne(email, username);
    if (user) {
      throw new UnauthorizedException("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return await this.createToken(newUser, client);
  }

  private async createToken(user: User, client: string) {
    // Create JWT token
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    await AccessToken.create({
      value: accessToken,
      user_id: user.id,
      client: client,
      ip: "",
      lastUsed: Math.floor(Date.now() / 1000),
      createdAt: Math.floor(Date.now() / 1000),
    });

    return { accessToken };
  }
}

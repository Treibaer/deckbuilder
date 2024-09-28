import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { User } from "src/decks/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get user() {
    return this.request.user;
  }

  async findOne(username: string): Promise<any | undefined> {
    return await User.findOne({
      where: {
        username,
      },
    });
  }
}

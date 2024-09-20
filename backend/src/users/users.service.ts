import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Op } from "sequelize";
import { User } from "src/decks/entities/user.entity";

@Injectable()
export class UsersService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get user() {
    return this.request.user;
  }

  async findOne(email: string, username: string): Promise<any | undefined> {
    return await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
  }
}

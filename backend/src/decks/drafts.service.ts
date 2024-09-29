import {
  Injectable,
  NotImplementedException,
  UnauthorizedException
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class DraftsService {
  constructor(private readonly userService: UsersService) {}

  private get userId() {
    if (!this.userService.user) {
      throw new UnauthorizedException();
    }
    return this.userService.user.id;
  }

  async create(name: string) {
  }

  async get(draftId: number) {
    return {
      id: draftId,
      name: "Draft",
      creatorId: this.userId,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };
  }

  async getAll() {
    return [];
  }
}

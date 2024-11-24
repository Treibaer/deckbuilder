import {
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { UserService } from "src/users/user.service";

@Injectable()
export class DraftService {
  constructor(private readonly userService: UserService) {}

  private get userId() {
    if (!this.userService.user) {
      throw new UnauthorizedException();
    }
    return this.userService.user.id;
  }

  async create(_name: string) {
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

import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("api/v1/users")
  async getUsers() {
    const users = await this.userService.getAllUsers();

    return users.map((user) => {
      return {
        id: user.id,
        username: user.username,
      };
    });
  }
}

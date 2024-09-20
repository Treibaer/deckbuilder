import { Controller, Get } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { PlaytestDto } from "./dto/playtest.dto";
import { Playtest } from "./entities/playtest.entity";

@Controller("api/v1/playtests")
export class PlayTestsContoller {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<PlaytestDto[]> {
    const playtests = await Playtest.findAll({
      where: {
        creator_id: this.userService.user.id,
      },
      attributes: ["id", "createdAt"],
      order: [["id", "DESC"]],
    });
    return this.transformPlaytests(playtests);
  }

  private transformPlaytests(playtests: Playtest[]): PlaytestDto[] {
    return playtests.map((playtest) => {
      return {
        id: playtest.id,
        createdAt: playtest.createdAt,
      };
    });
  }
}

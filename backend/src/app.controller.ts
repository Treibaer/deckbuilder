import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Settings } from "./decks/entities/settings.entity";
import { UserService } from "./users/user.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get("api/v1/app")
  async getApp() {
    const settings = await Settings.findOne();
    const lastImportCards = settings?.lastImportCards || 0;
    return { allowed: true, lastImportCards, userId: this.userService.user.id };
  }
}

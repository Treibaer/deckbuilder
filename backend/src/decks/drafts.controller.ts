import { Controller, Get, Param } from "@nestjs/common";
import { DraftsService } from "./drafts.service";

@Controller("api/v1/drafts")
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @Get()
  async getAll() {
    return this.draftsService.getAll();
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    return this.draftsService.get(+id);
  }
}

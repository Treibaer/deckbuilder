import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { join } from "path";
import { ImageService } from "./image.service";
import { Public } from "src/auth/auth.guard";

@Public()
@Controller("image/card")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get("backside.jpg")
  async getBackside(@Res() res: Response) {
    const title = "backside.jpg";
    const file = join(__dirname, "..", "..", "cache", title);
    res.setHeader("Content-Type", "image/jpeg");
    await this.imageService.loadImage(res, file, title);
  }

  @Get(":type/:scryfallId")
  async getCardImage(
    @Param("type") type: "normal" | "art_crop",
    @Param("scryfallId") scryfallId: string,
    @Param("force") force: string,
    @Query("faceSide") faceSide: string,
    @Res() res: Response,
  ) {
    const front = parseInt(faceSide || "0") === 0 ? "front" : "back";
    const card = await this.imageService.findCardByScryfallId(scryfallId);

    let url: string;
    if (!card) {
      const firstChar = scryfallId[0];
      const secondChar = scryfallId[1];
      url = `https://cards.scryfall.io/normal/${front}/${firstChar}/${secondChar}/${scryfallId}.jpg?1562894979`;
    } else {
      url = this.imageService.getCardImageUrl(card, type);
      url = url.split("?")[0];
    }

    if (front === "back") {
      url = url.replace("front", "back");
    }

    const localPath = this.imageService.getLocalPath(url, card, scryfallId);

    if (!(await this.imageService.fileExists(localPath)) || force === "true") {
      await this.imageService.downloadImage(url, localPath);
    }

    const paths = localPath.split(".");
    const fileExtension = paths[paths.length - 1];
    const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
    res.setHeader("Content-Type", mimeType);
    const title = `${scryfallId}.${fileExtension === "png" ? "png" : "jpg"}`;
    await this.imageService.loadImage(res, localPath, title);
  }
}

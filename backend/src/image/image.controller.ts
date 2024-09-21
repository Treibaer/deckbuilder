import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { ImageService } from "./image.service";
import { Public } from "src/auth/auth.guard";
import { CardSet } from "src/decks/entities/card-set.entity";
import * as https from "https";

@Public()
@Controller("image")
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get("card/backside.jpg")
  async getBackside(@Res() res: Response) {
    const title = "backside.jpg";
    const file = path.join(__dirname, "..", "..", "cache", title);
    res.setHeader("Content-Type", "image/jpeg");
    await this.imageService.loadImage(res, file, title);
  }

  @Get("card/:type/:scryfallId")
  async getCardImage(
    @Param("type") type: "normal" | "art_crop" | "large" | "png" | "small",
    @Param("scryfallId") scryfallId: string,
    @Query("force") force: string,
    @Query("faceSide") faceSide: string,
    @Res() res: Response,
  ) {
    const front = parseInt(faceSide || "0") === 0 ? "front" : "back";
    const card = await this.imageService.findCardByScryfallId(scryfallId);

    const firstChar = scryfallId[0];
    const secondChar = scryfallId[1];
    const extension = type === "png" ? "png" : "jpg";
    let url: string = `https://cards.scryfall.io/${type}/${front}/${firstChar}/${secondChar}/${scryfallId}.${extension}`;

    const localPath = this.imageService.getLocalPath(url, card, scryfallId);

    if (!(await this.imageService.fileExists(localPath)) || force === "true") {
      await this.imageService.downloadImage(url, localPath);
      console.log("Downloaded image");
    }

    const paths = localPath.split(".");
    const fileExtension = paths[paths.length - 1];
    const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
    res.setHeader("Content-Type", mimeType);
    const title = `${scryfallId}.${fileExtension === "png" ? "png" : "jpg"}`;
    await this.imageService.loadImage(res, localPath, title);
  }

  @Get("set/:scryfallId")
  async getSetIcon(
    @Param("scryfallId") scryfallId: string,
    @Res() res: Response,
  ) {
    // Find the set by scryfallId
    const set = await CardSet.findOne({ where: { scryfallId } });
    if (!set) {
      throw new NotFoundException("Set not found");
    }

    // Extract the base URL without query parameters
    const url = set.iconSvgUri.split("?")[0];

    // Extract the local path components
    const cacheExtract = url.replace("https://", "").split("/");
    cacheExtract[0] = ""; // Remove the first part
    const localPath = cacheExtract.join("/");
    cacheExtract.pop(); // Remove the last element for folder path
    const folderPath = cacheExtract.join("/");

    // Define the full paths for the image and cache folder
    const projectDir = path.resolve(__dirname, ".."); // Adjust as needed
    const imagePath = path.join(projectDir, "..", "cache", localPath);
    const cacheFolderPath = path.join(projectDir, "..", "cache", folderPath);

    // Check if the cache folder exists, create if it doesn't
    if (!fs.existsSync(cacheFolderPath)) {
      fs.mkdirSync(cacheFolderPath, { recursive: true });
    }

    // Check if the image file exists, download if it doesn't
    if (!fs.existsSync(imagePath)) {
      await this.downloadImage(url, imagePath);
    }

    // Set the response headers and send the file
    res.setHeader("Content-Type", "image/svg+xml");
    res.sendFile(imagePath);
  }

  // Helper function to download the image from the given URL
  private downloadImage(url: string, imagePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(imagePath);
      https
        .get(url, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        })
        .on("error", (err) => {
          fs.unlink(imagePath, () => {}); // Remove incomplete file
          reject(err);
        });
    });
  }
}

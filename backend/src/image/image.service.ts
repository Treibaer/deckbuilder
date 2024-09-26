// image.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import axios from "axios";
import { Response } from "express";
import { promises as fsPromises } from "fs";
import { join } from "path";
import { Card } from "src/decks/entities/card.entity";

@Injectable()
export class ImageService {
  async loadImage(res: Response, file: string, title: string) {
    const lastModified = (await fsPromises.stat(file)).mtime.getTime();
    const content = title;
    const etag = `"${lastModified}-${this.generateEtag(content)}"`;

    res.setHeader("Content-Disposition", `inline;filename="${title}"`);
    res.setHeader(
      "Content-Length",
      (await fsPromises.stat(file)).size.toString(),
    );
    res.setHeader("Last-Modified", new Date(lastModified).toUTCString());
    res.setHeader("Etag", etag);

    if (this.isNotModified(res, lastModified, etag)) {
      res.status(304).send();
      return;
    }

    res.sendFile(file);
  }

  isNotModified(res: Response, lastModified: number, etag: string): boolean {
    const modifiedSince = res.req.headers["if-modified-since"]
      ? new Date(res.req.headers["if-modified-since"]).getTime()
      : null;
    const etagHeader = res.req.headers["if-none-match"];

    return modifiedSince === lastModified && etagHeader === etag;
  }

  generateEtag(content: string): string {
    const crypto = require("crypto");
    return crypto.createHash("md5").update(content).digest("hex");
  }

  async findCardByScryfallId(scryfallId: string): Promise<any> {
    return Card.findByPk(scryfallId);
  }

  getLocalPath(url: string): string {
    const cacheExtract = url
      .replace("https://cards.scryfall.io", "")
      .split("/");
    const localPath = join(__dirname, "..", "..", "cache", ...cacheExtract);
    return localPath;
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fsPromises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async downloadImage(url: string, localPath: string): Promise<void> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const folderPath = localPath.substring(0, localPath.lastIndexOf("/"));

    await fsPromises.mkdir(folderPath, { recursive: true });
    await fsPromises.writeFile(localPath, response.data);
  }
}

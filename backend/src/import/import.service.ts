import {
  Inject,
  Injectable,
  InternalServerErrorException,
  PreconditionFailedException,
} from "@nestjs/common";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { Sequelize } from "sequelize-typescript";
import { Card } from "src/decks/entities/card.entity";

@Injectable()
export class ImportService {
  private cachePath = path.join(__dirname, "../../cache");

  constructor(private readonly sequelize: Sequelize) {}

  // import scryfall data
  async bulkImport(force: boolean) {
    if (!force) {
      throw new PreconditionFailedException(
        "You must pass the force parameter to import data",
      );
    }

    const cacheFolder = path.join(this.cachePath, "data");
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }

    const response = await axios.get("https://api.scryfall.com/bulk-data");

    const bulkData = response.data.data.find(
      (data: any) => data.type === "default_cards",
    );
    const uri = bulkData.download_uri;
    const fileName = uri.split("/").pop();

    const cacheName = path.join(cacheFolder, fileName);

    let content: string;
    if (!fs.existsSync(cacheName)) {
      const response = await axios.get(uri);
      content = response.data;
      content = JSON.stringify(content);
      fs.writeFileSync(cacheName, content);
    } else {
      content = fs.readFileSync(cacheName, "utf8");
    }

    // remove all cards from the database
    await this.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await Card.destroy({ truncate: true });
    await this.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

    // get amount of cards of entities
    const count = await Card.count();
    if (count > 0) {
      throw new PreconditionFailedException(
        "There are still cards in the database",
      );
    }

    const cards = JSON.parse(content);

    const processedIds: string[] = [];

    // iterate over all cards
    for (const card of cards) {
      // skip duplicates
      if (processedIds.includes(card.id)) {
        continue;
      }
      processedIds.push(card.id);

      if (!card.image_uris) {
        // search deeper
        if (!card.card_faces) {
          throw new InternalServerErrorException(
            "No image_uris and no card_faces",
          );
        }
        if (!card.card_faces[0].image_uris) {
          // placeholder cards like  https://scryfall.com/card/astx/66s/memory-lapse-memory-lapse?utm_source=api
          console.log("No image_uris in card_faces");
          continue;
        }
        let colors: string[] = [];
        for (const face of card.card_faces) {
          colors = colors.concat(face.colors);
        }
        card.colors = colors;
        if (!card.mana_cost) {
          card.mana_cost = card.card_faces[0].mana_cost;
        }
        if (!card.cmc) {
          card.cmc = card.card_faces[0].cmc;
        }
        if (!card.type_line) {
          card.type_line = card.card_faces[0].type_line;
        }
        if (!card.oracle_text) {
          card.oracle_text = card.card_faces[0].oracle_text;
        }
        if (!card.oracle_id) {
          card.oracle_id = card.card_faces[0].oracle_id;
        }
      } else {
        // remove card.card_faces
        delete card.card_faces;
      }

      const scryfallId = card.id;
      const cardFaces: any = [];
      if (card.card_faces) {
        
      }

      // create card entity
      await Card.create({
        scryfallId: card.id,
        name: card.name,
        typeLine: card.type_line,
        oracleText: card.oracle_text,
        manaCost: card.mana_cost,
        cmc: card.cmc,
        colors: card.colors,
        colorIdentity: card.color_identity,
        set: card.set,
        rarity: card.rarity,
        imageUris: card.image_uris,
        prices: card.prices,
      });
    }
  }
}

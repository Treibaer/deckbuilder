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
import { CardSet } from "src/decks/entities/card-set.entity";
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
      throw new PreconditionFailedException("file already exists");
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
      let cardFaces: any = [];
      if (card.card_faces) {
        cardFaces = card.card_faces.map((face: any) => ({
          name: face.name,
        }));
      }

      // create card entity
      await Card.create({
        scryfallId: scryfallId,
        oracleId: card.oracle_id,
        name: card.name,
        releasedAt: card.released_at,
        manaCost: card.mana_cost,
        cmc: card.cmc ?? 0,
        setCode: card.set,
        setId: card.set_id,
        setName: card.set_name,
        typeLine: card.type_line,
        oracleText: card.oracle_text ?? "",
        power: card.power ?? 0,
        toughness: card.toughness ?? 0,
        colors: card.colors.join("_"),
        rarity: card.rarity,
        reprint: card.reprint ?? false,
        printsSearchUri: card.prints_search_uri ?? "",
        cardFacesNames: cardFaces.join("###"),
        image: "",
        imageArtCrop: "",
      });
    }
  }

  async importSymbols() {
    const cacheFolder = path.join(this.cachePath, "card-symbols");
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }

    const response = await axios.get("https://api.scryfall.com/symbology");

    const symbols = response.data.data;

    for (const symbol of symbols) {
      const fileName = symbol.svg_uri.split("/").pop();
      const cacheName = path.join(cacheFolder, fileName);

      let content: string;
      if (!fs.existsSync(cacheName)) {
        const response = await axios.get(symbol.svg_uri);
        content = response.data;
        content = JSON.stringify(content);
        fs.writeFileSync(cacheName, content);
      } else {
        content = fs.readFileSync(cacheName, "utf8");
      }
    }
  }

  async importSets() {
    const cacheFolder = path.join(this.cachePath, "sets");
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }

    const response = await axios.get("https://api.scryfall.com/sets");

    const sets = response.data.data;

    for (const set of sets) {
      const scryfallId = set.id;
      const cardSet = await CardSet.findOne({ where: { scryfallId: scryfallId } });
      if (cardSet) {
        cardSet.name = set.name;
        cardSet.code = set.code;
        cardSet.setType = set.set_type;
        cardSet.releasedAt = set.released_at;
        cardSet.cardCount = set.card_count;
        cardSet.iconSvgUri = set.icon_svg_uri;
        await cardSet.save();
      } else {
        await CardSet.create({
          scryfallId: set.id,
          name: set.name,
          code: set.code,
          setType: set.set_type,
          releasedAt: set.released_at,
          cardCount: set.card_count,
          iconSvgUri: set.icon_svg_uri,
        });
      }
    }
  }
}

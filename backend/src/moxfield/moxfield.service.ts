import { Injectable, NotFoundException } from "@nestjs/common";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { DeckCardDto } from "src/decks/dto/deck-card.dto";
import { DeckDto } from "src/decks/dto/deck.dto";
import { Deck } from "src/decks/entities/deck.entity";
import { FavoriteDeck } from "src/decks/entities/favorite-deck";
import { MoxFieldMapping } from "src/decks/entities/moxfield-mapping.entity";
import { UsersService } from "src/users/users.service";
import { Card } from "../decks/entities/card.entity";
import { DeckCard } from "../decks/entities/deck-card.entity";
import { MagicCardDto } from "src/decks/dto/magic-card.dto";

const formats = ["modern", "commander", "commanderPrecons", "standard"];
const sortTypes = ["views", "created", "updated"];

class ConfigDto {
  format: string;
  page: number;
  sortType: string = "views";
  commander?: boolean;
  moxfieldId?: string;
}

@Injectable()
export class MoxfieldService {
  private cachePath = path.join(__dirname, "../../cache/moxfield");

  constructor(private readonly userService: UsersService) {}

  async fetchDecksFromApi(config: ConfigDto) {
    config.format = formats.includes(config.format) ? config.format : "all";
    config.sortType = sortTypes.includes(config.sortType)
      ? config.sortType
      : "views";

    const { page, commander, moxfieldId, format, sortType } = config;

    let folder: string;
    let localName: string;
    let referenceCard: Card | null = null;

    if (moxfieldId) {
      folder = "decks-by-card-id";
      localName = `${moxfieldId}-${format}-${sortType}-${commander ? 1 : 0}-${page}`;
      const scryfallId = await this.getMapping(moxfieldId);
      if (scryfallId) {
        referenceCard = await Card.findByPk(scryfallId);
      }
    } else {
      folder = "";
      localName = `all-filtered-by-${sortType}-${format}-${page}`;
    }

    const url = this.constructUrl(config);

    const content = await this.loadAndCache(folder, localName, url);

    const data = JSON.parse(content);

    const allDecks = await this.processDeckData(data.data);

    const { totalResults, totalPages, pageSize } = data;

    return {
      referenceCard: referenceCard,
      decks: allDecks,
      totalResults,
      totalPages,
      pageSize,
    };
  }

  private constructUrl(config: ConfigDto) {
    let url = `https://api2.moxfield.com/v2/decks/search?`;
    url += `pageNumber=${config.page}&pageSize=100&sortType=${config.sortType}&sortDirection=Descending`;
    if (config.format !== "all") {
      url += `&fmt=${config.format}`;
    }
    if (config.moxfieldId) {
      url += `&board=mainboard`;
      if (config.commander) {
        url += `&commanderCardId=${config.moxfieldId}`;
      } else {
        url += `&cardId=${config.moxfieldId}`;
      }
    }
    return url;
  }

  private async processDeckData(decks: any[]) {
    await Promise.all(
      decks.map(
        async (deck) =>
          deck.mainCardId &&
          (deck.mainScryfallId = await this.getMapping(deck.mainCardId)),
      ),
    );

    const allDecks: DeckDto[] = decks.map((deck: any) => {
      return {
        id: deck.publicId,
        name: deck.name,
        description: "",
        promoId: deck.mainScryfallId ?? "",
        format: deck.format,
        cardCount: deck.mainboardCount,
        viewCount: deck.viewCount,
        colors: deck.colors,
        commanders: [],
        mainboard: [],
        sideboard: [],
      };
    });
    return allDecks;
  }

  async cloneDeckById(id: string) {
    const deck = await this.loadDeckById(id);

    const newDeck = await Deck.create({
      name: deck.name,
      description: deck.description,
      promoId: deck.promoId,
      format: deck.format,
      isPublic: true,
      creator_id: this.userService.user.id,
    });

    await Promise.all([
      ...deck.commanders.map((card) =>
        this.createDeckCard(card, newDeck.id, "commandZone"),
      ),
      ...deck.mainboard.map((card) =>
        this.createDeckCard(card, newDeck.id, "mainboard"),
      ),
      // currently not supported
      // ...deck.sideboard.map(card => this.createDeckCard(card, newDeck.id, "sideboard")),
    ]);
    return newDeck;
  }

  private async createDeckCard(
    card: any,
    deckId: number,
    zone: "mainboard" | "sideboard" | "commandZone",
  ) {
    const scryfallId = card.card.scryfallId;
    const existingCard = await Card.findByPk(scryfallId);
    if (!existingCard) {
      throw new NotFoundException("Card not found");
    }
    await DeckCard.create({
      deck_id: deckId,
      scryfall_id: scryfallId,
      quantity: card.quantity,
      zone: zone,
    });
  }

  async loadDeckById(id: string) {
    const cacheFolder = path.join(this.cachePath, "decks");
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }
    const cacheName = path.join(cacheFolder, `${id}.json`);
    const deckUrl = `https://api2.moxfield.com/v2/decks/all/${id}`;
    let content: string;

    if (!fs.existsSync(cacheName)) {
      const response = await axios.get(deckUrl);
      content = response.data;
      content = JSON.stringify(content);
      fs.writeFileSync(cacheName, content);
    } else {
      content = fs.readFileSync(cacheName, "utf8");
    }
    const deck = JSON.parse(content);
    this.extractCardIdMappings(deck);
    let cardId = 0;
    let cardCount = 0;

    const commanders: DeckCardDto[] = Object.entries(deck.commanders).map(
      ([_, card]: [string, any]) => {
        cardId++;
        cardCount += card.quantity;
        return {
          id: cardId,
          card: this.convertCard(card.card),
          quantity: card.quantity,
        };
      },
    );

    const mainboard: DeckCardDto[] = Object.entries(deck.mainboard).map(
      ([_, card]: [string, any]) => {
        cardId++;
        cardCount += card.quantity;
        return {
          id: cardId,
          card: this.convertCard(card.card),
          quantity: card.quantity,
        };
      },
    );

    const _sideBoard: DeckCardDto[] = Object.entries(deck.sideboard).map(
      ([_, card]: [string, any]) => {
        cardId++;
        return {
          id: cardId,
          card: this.convertCard(card.card),
          quantity: card.quantity,
        };
      },
    );

    const favorite = await FavoriteDeck.findOne({
      where: { moxfieldId: deck.publicId },
    });

    const deckResponse: DeckDto = {
      id: deck.publicId,
      name: deck.name,
      description: deck.description,
      promoId: deck.main?.scryfall_id ?? "",
      format: deck.format,
      cardCount,
      viewCount: deck.viewCount,
      colors: deck.main.colors ?? [],
      commanders,
      mainboard,
      sideboard: [],
      isFavorite: favorite !== null,
    };
    return deckResponse;
  }

  private async extractCardIdMappings(deck: any) {
    if (deck.main) {
      await this.addMapping(deck.main.id, deck.main.scryfall_id);
    }
    for (const [_key, card] of Object.entries(deck.mainboard) as any[]) {
      await this.addMapping(card.card.id, card.card.scryfall_id);
    }
    for (const [_key, card] of Object.entries(deck.sideboard as any[])) {
      await this.addMapping(card.card.id, card.card.scryfall_id);
    }
  }

  async loadAndCache(
    folder: string,
    name: string,
    url: string,
    ignoreCache = false,
  ): Promise<string> {
    const cacheFolder = path.join(this.cachePath, folder);
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }
    const cacheName = path.join(cacheFolder, `${name}.json`);
    let content: string;

    if (!fs.existsSync(cacheName) || ignoreCache) {
      const response = await axios.get(url);
      content = response.data;
      content = JSON.stringify(content);
      fs.writeFileSync(cacheName, content);
    } else {
      content = fs.readFileSync(cacheName, "utf8");
    }
    return content;
  }

  private async addMapping(moxfieldId: string, scryfallId: string) {
    const exists = (await this.getMapping(moxfieldId)) !== null;
    if (exists) {
      return;
    }
    await MoxFieldMapping.create({
      moxfieldId,
      scryfallId,
    });
  }

  async getMapping(id: string): Promise<string | null> {
    const mapping = await MoxFieldMapping.findOne({
      where: { moxfield_id: id },
    });
    return mapping?.scryfallId ?? null;
  }

  private convertCard(card: any): MagicCardDto {
    const cardFaces =
      card.card_faces?.map((face: any) => ({
        name: face.name,
      })) ?? [];

    return {
      scryfallId: card.scryfall_id,
      name: card.name,
      typeLine: card.type_line ?? "",
      reprint: card.reprint,
      printsSearchUri: "",
      cardFaces: cardFaces,
    };
  }

  async importSets() {
    const url = "https://api2.moxfield.com/sets";
    const data = await this.loadAndCache("sets", "all", url);
    const sets = JSON.parse(data);
    for (const set of sets) {
      await this.importSet(set);
    }
  }

  private async importSet(set: {
    id: string;
    name: string;
    cardCount: number;
    releasedAt: string;
  }) {
    const releasedAt = new Date(set.releasedAt);
    const isFutureRelease = releasedAt > new Date();

    const url = `https://api2.moxfield.com/sets/${set.id}`;

    const data = await this.loadAndCache("sets", set.id, url, isFutureRelease);
    const setData = JSON.parse(data);
    const cards = setData.cards;
    for (const card of cards) {
      await this.addMapping(card.id, card.scryfall_id);
    }
  }
}

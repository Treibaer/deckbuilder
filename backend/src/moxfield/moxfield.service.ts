import { Injectable, NotFoundException } from "@nestjs/common";

import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { MagicCardDto } from "src/decks/dto/card.dto";
import { DeckCardDto } from "src/decks/dto/deck-card.dto";
import { DeckDto } from "src/decks/dto/deck.dto";
import { Card } from "src/decks/entities/card.entity";
import { DeckCard } from "src/decks/entities/deck-card.entity";
import { Deck } from "src/decks/entities/deck.entity";
import { FavoriteDeck } from "src/decks/entities/favorite-deck";
import { MoxFieldMapping } from "src/decks/entities/moxfield-mapping.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class MoxfieldService {
  private cachePath = path.join(__dirname, "../../cache/moxfield");
  constructor(private readonly userService: UsersService) {}

  async loadDecks(config: {
    format: string;
    page: number;
    sortType?: string;
    commander?: boolean;
    moxfieldId?: string;
  }) {
    const { page, commander, moxfieldId } = config;
    let { format, sortType } = config;

    const allowedFormats = [
      "modern",
      "commander",
      "commanderPrecons",
      "standard",
    ];
    const pageSize = 100;

    let fmt = "";
    if (allowedFormats.includes(format)) {
      fmt = `&fmt=${format}`;
    } else {
      format = "all";
    }
    // recently created, most views, recently updated
    const sortTypes = ["views", "created", "updated"];
    if (!sortTypes.includes(sortType ?? "")) {
      sortType = "views";
    }
    let midfix = "";
    let folder: string;
    let localName: string;
    let referenceCard: Card | null = null;

    if (moxfieldId) {
      if (commander) {
        midfix = `&commanderCardId=${moxfieldId}`;
      } else {
        midfix = `&cardId=${moxfieldId}`;
      }
      midfix += `&board=mainboard`;
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
    const params = `?pageNumber=${page}&pageSize=${pageSize}&sortType=${sortType}&sortDirection=Descending${midfix}${fmt}`;
    const decksUrl = `https://api2.moxfield.com/v2/decks/search${params}`;

    const content = await this.loadAndCache(folder, localName, decksUrl);

    const data = JSON.parse(content);
    const decks = data.data;

    for (const deck of decks) {
      if (!deck.mainCardId) {
        continue;
      }
      const mapping = await this.getMapping(deck.mainCardId);
      if (mapping) {
        deck.mainScryfallId = mapping;
      }
    }

    const allDecks = decks.map((deck: any) => {
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
    return {
      referenceCard: referenceCard,
      decks: allDecks,
      totalResults: data.totalResults,
      totalPages: data.totalPages,
      pageSize: data.pageSize,
    };
  }

  async cloneDeckById(id: string) {
    const deck = await this.loadDeckById(id);

    const deckResponse = await Deck.create({
      name: deck.name,
      description: deck.description,
      promoId: deck.promoId,
      format: deck.format,
      isPublic: true,
      creator_id: this.userService.user.id,
    });

    for (const [key, card] of Object.entries(deck.commanders)) {
      const existingCard = await Card.findByPk(card.card.scryfallId);
      if (!existingCard) {
        throw new NotFoundException("Card not found");
      }
      await DeckCard.create({
        deck_id: deckResponse.id,
        scryfall_id: card.card.scryfallId,
        quantity: card.quantity,
        zone: "commandZone",
      });
    }

    for (const [key, card] of Object.entries(deck.mainboard)) {
      const existingCard = await Card.findByPk(card.card.scryfallId);
      if (!existingCard) {
        throw new NotFoundException("Card not found");
      }
      await DeckCard.create({
        deck_id: deckResponse.id,
        scryfall_id: card.card.scryfallId,
        quantity: card.quantity,
        zone: "mainboard",
      });
    }

    for (const [key, card] of Object.entries(deck.sideboard)) {
      const existingCard = await Card.findByPk(card.card.scryfallId);
      if (!existingCard) {
        throw new NotFoundException("Card not found");
      }
      await DeckCard.create({
        deck_id: deckResponse.id,
        scryfall_id: card.card.scryfallId,
        quantity: card.quantity,
        zone: "sideboard",
      });
    }

    return deckResponse;
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
      ([_key, card]: [string, any]) => {
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
      ([_key, card]: [string, any]) => {
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
      ([_key, card]: [string, any]) => {
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
    const data = await this.loadAndCache(
      "sets",
      "all",
      "https://api2.moxfield.com/sets",
    );
    const sets = JSON.parse(data);
    for (const set of sets) {
      // console.log(set);
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

    const data = await this.loadAndCache(
      "sets",
      set.id,
      `https://api2.moxfield.com/sets/${set.id}`,
      isFutureRelease,
    );
    const setData = JSON.parse(data);
    const cards = setData.cards;
    for (const card of cards) {
      await this.addMapping(card.id, card.scryfall_id);
    }
  }
}

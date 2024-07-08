import fs from "fs";
import { Deck } from "./Models.js";

export default class DataService {
  loadDeck(id: number): Deck | undefined {
    const decks = this.loadDecks();
    return decks.find((d) => d.id === id);
  }
  saveDeck(deck: Deck): void {
    const decks = this.loadDecks();
    const existingDeck = decks.find((d) => d.id === deck.id);
    if (existingDeck) {
      existingDeck.name = deck.name;
      existingDeck.description = deck.description;
      existingDeck.promoId = deck.promoId;
    } else {
      decks.push(deck);
    }
    this.saveDecks(decks);
  }
  loadDecks(): Deck[] {
    if (!fs.existsSync("data/decks.json")) {
      return [];
    }
    const decks = fs.readFileSync("data/decks.json", "utf-8");
    return JSON.parse(decks);
  }

  saveDecks(decks: Deck[]): void {
    fs.writeFileSync("data/decks.json", JSON.stringify(decks, null, 2));
  }
}

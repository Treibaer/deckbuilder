import fs from "fs";
import { Deck } from "./Models.js";

export default class DataService {
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

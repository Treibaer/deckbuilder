import { Playtest } from "../models/dtos";
import Client from "./Client";

export default class PlaytestService {
  static shared = new PlaytestService();
  private client = Client.shared;
  private constructor() {}

  async create(deckId: number) {
    return this.client.post<{ id: number }>("/playtests", {
      deckId: deckId,
    }, true);
  }

  async createFromMoxfieldDeck(moxFieldDeckId: number) {
    const path = `/playtests`;
    const data = {
      moxFieldDeckId: moxFieldDeckId,
    };
    return this.client.post<{ id: number }>(path, data, true);
  }

  async getAll() {
    return this.client.get<Playtest[]>("/playtests", true);
  }
}

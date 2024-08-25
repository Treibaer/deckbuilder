import { Playtest } from "../pages/deck";
import Client from "./Client";

export default class PlaytestService {
  private client = Client.shared;
  static shared = new PlaytestService();
  private constructor() {}

  async create(deckId: number) {
    return this.client.post<{ id: number }>("/playtests", {
      deckId: deckId,
    });
  }

  async createFromMoxfieldDeck(moxFieldDeckId: number) {
    const path = `/playtests`;
    const data = {
      moxFieldDeckId: moxFieldDeckId,
    };
    return Client.shared.post<{ id: number }>(path, data);
  }

  async getAll() {
    return this.client.get<Playtest[]>("/playtests");
  }
}

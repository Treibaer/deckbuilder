import { Deck } from "../models/dtos";
import Client from "./Client";

export default class MoxfieldService {
  static shared = new MoxfieldService();
  private client = Client.shared;
  private constructor() {}

  async getDecks(format: string, page: number, shouldBeCommander: boolean) {
    const path = `/moxfield/decks?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }`;
    return this.client.get<any>(path, true);
  }

  async getDecksByCardId(moxFieldCardId: string, format: string, page: number, shouldBeCommander: boolean) {
    const path = `/moxfield/decks-by-card-id/${moxFieldCardId}?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }`;
    return this.client.get(path, true);
  }

  async getDeck(deckId: number) {
    return this.client.get<Deck>(`/moxfield/decks/${deckId}`, true);
  }

  async clone(moxfieldId : number) {
    const path = `/moxfield/decks/${moxfieldId}/clone`;
    return this.client.post<Deck>(path, {}, true);
  }
}

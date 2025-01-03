import { Deck } from "../models/dtos";
import Client from "./Client";

export default class MoxfieldService {
  static shared = new MoxfieldService();
  private client = Client.shared;
  private constructor() {}

  async getDecks(
    format: string,
    page: number,
    shouldBeCommander: boolean,
    sortType: string
  ) {
    const path = `/moxfield/decks?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }&sortType=${sortType}`;
    return this.client.get<any>(path);
  }

  async getDecksByCardId(
    moxFieldCardId: string,
    format: string,
    page: number,
    shouldBeCommander: boolean,
    sortType: string
  ) {
    const path = `/moxfield/decks-by-card-id/${moxFieldCardId}?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }&sortType=${sortType}`;
    return this.client.get(path);
  }

  async getDeck(deckId: string) {
    return this.client.get<Deck>(`/moxfield/decks/${deckId}`);
  }

  async clone(moxfieldId: string) {
    const path = `/moxfield/decks/${moxfieldId}/clone`;
    return this.client.post<Deck>(path, {});
  }

  async setFavoriteDeck(deckId: number, favorite: boolean) {
    const path = `/favorites/decks`;
    return this.client.post(path, { favorite, moxfieldId: deckId });
  }

  async setFavoriteCard(scryfallId: string, favorite: boolean) {
    const path = `/favorites/cards`;
    return this.client.post(path, { favorite, scryfallId });
  }

  async isFavoriteCard(scryfallId: string) {
    return this.client.get<boolean>(`/favorites/cards/${scryfallId}`);
  }
}

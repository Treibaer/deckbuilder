import Client from "./Client";

export default class MoxfieldService {
  static shared = new MoxfieldService();
  client = Client.shared;

  async getDecks(format, page, shouldBeCommander) {
    const path = `/moxfield/decks?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }`;
    return this.client.get(path);
  }

  async getDecksByCardId(moxFieldCardId, format, page, shouldBeCommander) {
    const path = `/moxfield/decks-search-by-card-id/${moxFieldCardId}?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }`;
    return this.client.get(path);
  }

  async getDeck(deckId) {
    return this.client.get(`/moxfield/decks/${deckId}`);
  }

  async clone(moxfieldId) {
    const path = `/moxfield/decks/${moxfieldId}/clone`;
    return await this.client.post(path, {});
  }
}

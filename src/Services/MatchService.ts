import { Match, User } from "../pages/deck";
import Client from "./Client";

export default class MatchService {
  private client = Client.shared;
  static shared = new MatchService();
  private constructor() {}

  async getAll() {
    return this.client.get<Match[]>("/matches");
  }

  async getUsers() {
    return this.client.get<User[]>("/users");
  }

  async createMatch(enemyId: number) {
    return await this.client.post("/matches", { enemyId: enemyId });
  }

  async selectDeck(
    selectedMatch: Match,
    selectedPlayerPosition: number,
    selectedDeckId: number
  ) {
    const path = `/matches/${selectedMatch.id}/selectDeck`;
    const data = {
      deckId: selectedDeckId,
      playerIndex: selectedPlayerPosition,
    };
    await this.client.post(path, data);
  }
}

import Client from "./Client";
import { Match, User } from "../models/dtos";

export default class MatchService {
  static shared = new MatchService();
  private client = Client.shared;
  private constructor() {}

  async getAll() {
    return this.client.get<Match[]>("/matches", true);
  }

  async getUsers() {
    return this.client.get<User[]>("/users");
  }

  async create(enemyId: number) {
    return this.client.post("/matches", { enemyId: enemyId }, true);
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
    await this.client.post(path, data, true);
  }
}

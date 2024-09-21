import { CardDetailWithPrintings, CardSet } from "../models/dtos";
import Client from "./Client";

export default class CardService {
  static shared = new CardService();
  private client = Client.shared;
  private constructor() {}

  async getSets() {
    return this.client.get<CardSet[]>("/sets", true);
  }

  async getWithPrintings(scryfallId: string) {
    return this.client.get<CardDetailWithPrintings>(`/cards/${scryfallId}`, true);
  }
}

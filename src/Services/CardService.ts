import { CardSet } from "../pages/deck";
import Client from "./Client";

export default class CardService {
  static shared = new CardService();
  private client = Client.shared;
  private constructor() {}

  async getSets() {
    return this.client.get<CardSet[]>("/sets");
  }

  async get(id: number) {
    return this.client.get(`/cards/${id}`);
  }
}

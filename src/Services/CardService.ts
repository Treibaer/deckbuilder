import { CardSet } from "../pages/deck";
import Client from "./Client";

export default class CardService {
  static shared = new CardService();
  client = Client.shared;

  async getSets() {
    return this.client.get<CardSet[]>("/sets");
  }

  async getCardById(id: number) {
    return Client.shared.get(`/cards/${id}`);
  }
}

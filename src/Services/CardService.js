import Client from "./Client";

export default class CardService {
  static shared = new CardService();
  client = Client.shared;

  async getSets() {
    return this.client.get("/sets");
  }

  async getCardById(id) {
    return Client.shared.get(`/cards/${id}`);
  }
}

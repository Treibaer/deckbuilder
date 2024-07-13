import Client from "./Client";

export default class CardService {
  static shared = new CardService();

  async getCardById(id) {
    return await Client.shared.get(`/cards/${id}`);
  }
}

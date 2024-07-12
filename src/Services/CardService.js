import Client from "./Client";

export default class CardService {
  api = "https://magic.treibaer.de/api/v1";

  static shared = new CardService();

  async getCardById(id) {
    return await Client.shared.get(this.api + "/cards/" + id);
  }
}

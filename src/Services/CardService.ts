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
    return this.client.get<CardDetailWithPrintings>(
      `/cards/${scryfallId}`,
      true
    );
  }

  async searchCards(q: string, page: string | null) {
    const sets = await this.getSets();

    sets.sort((a, b) => (a.name > b.name ? 1 : -1));
    if (q === "") {
      return { data: [], sets: sets };
    }

    q += " game:paper";

    let url = `https://api.scryfall.com/cards/search?q=${q}`;
    if (page) {
      url += `&page=${page}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      return { data: [], sets: sets, amount: 0, hasMore: false };
    }

    const json = await response.json();
    json.data.map((card: any) => {
      card.scryfallId = card.id;
      card.oracleId = card.oracle_id;
      return card;
    });

    return {
      data: json.data,
      hasMore: json.has_more,
      amount: json.total_cards,
      sets: sets,
    };
  }
}

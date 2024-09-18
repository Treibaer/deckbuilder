import { Deck, MagicCard } from "../models/dtos";
import Client from "./Client";
import MagicHelper from "./MagicHelper";

export default class DeckService {
  static shared = new DeckService();
  private client = Client.shared;
  private constructor() {}

  async getAll() {
    return this.client.get<Deck[]>("/decks", true);
  }

  async get(deckId: number) {
    const deck = await this.client.get<Deck>(`/decks/${deckId}`, true);
    deck.mainboard = deck.mainboard.sort((a, b) =>
      a.card.name.localeCompare(b.card.name)
    );
    return deck;
  }

  async create(name: string) {
    const path = `/decks`;
    const data = {
      name,
    };
    return await this.client.post(path, data, true);
  }

  async addCardToDeck(deck: Deck, card: MagicCard, zone: string, quantity = 1) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: card.scryfallId,
      quantity: quantity,
      zone: zone,
      action: "add",
    };
    return await this.client.post(path, cardObject, true);
  }

  async setPromoId(deck: Deck, promoId: string) {
    const url = `/decks/${deck.id}`;
    const cardObject = {
      promoId,
    };
    return await this.client.patch(url, cardObject, true);
  }

  async updateCardAmount(
    deck: Deck,
    card: MagicCard,
    zone: string,
    quantity: number
  ) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: card.scryfallId,
      quantity: quantity,
      zone: zone,
      action: "modify",
    };
    return await this.client.post(path, cardObject, true);
  }

  async setPrint(deck: Deck, card: MagicCard, print: MagicCard) {
    const path = `/decks/${deck.id}`;
    const data = {
      action: "replaceCard",
      oldId: card.scryfallId,
      newId: print.scryfallId,
    };
    return await this.client.put(path, data, true);
  }

  async moveZone(
    deck: Deck,
    card: MagicCard,
    originZone: string,
    destinationZone: string
  ) {
    const path = `/decks/${deck.id}`;
    const data = {
      action: "moveZone",
      cardId: card.scryfallId,
      originZone: originZone,
      destinationZone: destinationZone,
    };
    return await this.client.put(path, data, true);
  }

  async deleteDeck(deck: Deck) {
    return await this.client.delete(`/decks/${deck.id}`, true);
  }

  cardCount(deck: Deck) {
    return deck.mainboard.reduce((acc, card) => {
      return acc + card.quantity;
    }, 0);
  }

  isValid(deck: Deck) {
    let cardCount = this.cardCount(deck);
    for (let card of deck.mainboard) {
      if (
        card.quantity > 4 &&
        MagicHelper.determineCardType(card.card) !== "Land"
      ) {
        return false;
      }
    }
    return cardCount >= 60 && cardCount <= 100;
  }
}

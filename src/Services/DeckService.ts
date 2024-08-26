import { Deck, MagicCard } from "../pages/deck";
import Client from "./Client";
import MagicHelper from "./MagicHelper";

export default class DeckService {
  static shared = new DeckService();
  private client = Client.shared;
  private constructor() {}

  async getAll() {
    return this.client.get<Deck[]>("/decks");
  }

  async get(deckId: number) {
    const deck = await this.client.get<Deck>(`/decks/${deckId}`);
    deck.mainboard = deck.mainboard.sort((a, b) =>
      a.card.name.localeCompare(b.card.name)
    );
    return deck;
  }

  async create(name: string) {
    const path = `/decks`;
    const data = {
      id: 0,
      name: name,
      description: "",
      promoId: "",
    };
    // let startingTime = new Date().getTime();
    return await this.client.post(path, data);

    // let endingTime = new Date().getTime();
    // if (endingTime - startingTime < 700) {
    //   await new Promise((resolve) =>
    //     setTimeout(resolve, 700 - (endingTime - startingTime))
    //   );
    // }
  }

  async addCardToDeck(deck: Deck, card: MagicCard, zone: string, quantity = 1) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: card.scryfallId,
      quantity: quantity,
      zone: zone,
      action: "add",
    };
    return await this.client.post(path, cardObject);
  }

  async setPromoId(deck: Deck, promoId: string) {
    const url = `/decks/${deck.id}`;
    const cardObject = {
      promoId: promoId,
      action: "modify",
    };
    return await this.client.post(url, cardObject);
  }

  async updateCardAmount(deck: Deck, card: MagicCard, zone: string, quantity: number) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: card.scryfallId,
      quantity: quantity,
      zone: zone,
      action: "modify",
    };
    return await this.client.post(path, cardObject);
  }

  async setPrint(deck: Deck, card: MagicCard, print: MagicCard) {
    const path = `/decks/${deck.id}`;
    const data = {
      action: "replaceCard",
      oldId: card.scryfallId,
      newId: print.scryfallId,
    };
    return await this.client.put(path, data);
  }

  async moveZone(deck : Deck, card: MagicCard, originZone: string, destinationZone: string) {
    const path = `/decks/${deck.id}`;
    const data = {
      action: "moveZone",
      cardId: card.scryfallId,
      originZone: originZone,
      destinationZone: destinationZone,
    };
    return await this.client.put(path, data);
  }

  async deleteDeck(deck: Deck) {
    return await this.client.delete(`/decks/${deck.id}`);
  }

  cardCount(deck: Deck) {
    return deck.mainboard.reduce((acc, card) => {
      return acc + card.quantity;
    }, 0);
  }

  calculateWorth(deck: Deck) {
    return 0;
    // console.log(deck);
    // return deck.mainboard.reduce((acc, card) => {
    //   if (card.card.foil) {
    //     if (!card.card.prices.eur_foil) {
    //       return acc;
    //     }
    //     return acc + card.amount * parseInt(card.card.prices.eur_foil);
    //   }
    //   if (!card.card.prices.eur) {
    //     return acc;
    //   }
    //   return acc + card.amount * parseInt(card.card.prices.eur);
    // }, 0);
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

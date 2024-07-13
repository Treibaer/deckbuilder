import MagicHelper from "./MagicHelper";
import Constants from "./Constants.js";
import Client from "./Client.js";
// console.log(Settings());
export default class DeckService {
  client = Client.shared;

  static shared = new DeckService();

  async cloneMoxfieldDeck(moxfieldId) {
    const path = `/moxfield/decks/${moxfieldId}clone`;
    return await this.client.post(path, JSON.stringify({}));
  }

  async loadMyDecks() {
    return await this.client.get("/decks");
  }

  async loadDeck(deckId) {
    const resData = await this.client.get(`/decks/${deckId}`);
    resData.mainboard = resData.mainboard.sort((a, b) =>
      a.card.name.localeCompare(b.card.name)
    );
    return resData;
  }

  async createDeck(deck) {
    const path = `/decks`;
    const data = {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      promoId: deck.promoId,
    };
    // let startingTime = new Date().getTime();
    return await this.client.post(path, JSON.stringify(data));

    // let endingTime = new Date().getTime();
    // if (endingTime - startingTime < 700) {
    //   await new Promise((resolve) =>
    //     setTimeout(resolve, 700 - (endingTime - startingTime))
    //   );
    // }
  }

  async addCardToDeck(deck, card, zone, quantity = 1) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: card.id,
      quantity: quantity,
      zone: zone,
      action: "add",
    };
    return await this.client.post(path, JSON.stringify(cardObject));
  }

  async setPromoId(deck, promoId) {
    const url = `/decks/${deck.id}`;
    const cardObject = {
      promoId: promoId,
      action: "modify",
    };
    return await this.client.post(url, JSON.stringify(cardObject));
  }

  async updateCardAmount(deck, card, zone, quantity) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: card.id,
      quantity: quantity,
      zone: zone,
      action: "modify",
    };
    return await this.client.post(path, JSON.stringify(cardObject));
  }

  async setPrint(deck, card, print) {
    const path = `/decks/${deck.id}`;
    const data = {
      action: "replaceCard",
      oldId: card.id,
      newId: print.id,
    };
    return await this.client.put(path, JSON.stringify(data));
  }

  async moveZone(deck, card, originZone, destinationZone) {
    const path = `/decks/${deck.id}`;
    const data = {
      action: "moveZone",
      cardId: card.id,
      originZone: originZone,
      destinationZone: destinationZone,
    };
    return await this.client.put(path, JSON.stringify(data));
  }

  async deleteDeck(deck) {
    return await this.client.delete(`/decks/${deck.id}`);
  }

  cardCount(deck) {
    return deck.mainboard.reduce((acc, card) => {
      return acc + card.amount;
    }, 0);
  }

  calculateWorth(deck) {
    return 0;
    console.log(deck);
    return deck.mainboard.reduce((acc, card) => {
      if (card.card.foil) {
        if (!card.card.prices.eur_foil) {
          return acc;
        }
        return acc + card.amount * parseInt(card.card.prices.eur_foil);
      }
      if (!card.card.prices.eur) {
        return acc;
      }
      return acc + card.amount * parseInt(card.card.prices.eur);
    }, 0);
  }

  isValid(deck) {
    let cardCount = this.cardCount(deck);
    for (let card of deck.mainboard) {
      if (
        card.amount > 4 &&
        MagicHelper.determineCardType(card.card) !== "Land"
      ) {
        return false;
      }
    }
    return cardCount >= 60 && cardCount <= 100;
  }
}

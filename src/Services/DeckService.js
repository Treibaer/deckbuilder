import MagicHelper from "./MagicHelper";

export default class DeckService {
  api = "https://magic.treibaer.de/api/v1";

  static shared = new DeckService();

  async cloneMoxfieldDeck(moxfieldId) {
    const response = await fetch(
      this.api + "/moxfield/decks/" + moxfieldId + "/clone",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      throw new Error("Error cloning deck");
    }
    return response.json();
  }

  async loadMyDecks() {
    const response = await fetch(this.api + "/decks");
    return response.json();
  }

  async loadDeck(deckId) {
    const response = await fetch(this.api + "/decks/" + deckId);
    // sort mainboard by name ascending
    const resData = await response.json();
    resData.mainboard = resData.mainboard.sort((a, b) =>
      a.card.name.localeCompare(b.card.name)
    );
    return resData;
  }

  async createDeck(deck) {
    // let startingTime = new Date().getTime();
    const response = await fetch(`${this.api}/decks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: deck.id,
        name: deck.name,
        description: deck.description,
        promoId: deck.promoId,
      }),
    });
    // let endingTime = new Date().getTime();
    // if (endingTime - startingTime < 700) {
    //   await new Promise((resolve) =>
    //     setTimeout(resolve, 700 - (endingTime - startingTime))
    //   );
    // }

    if (!response.ok) {
      throw new Error("Error creating deck");
    }
    return response.json();
  }

  async addCardToDeck(deck, card, type = "mainboard") {
    const cardObject = {
      scryfallId: card.id,
      quantity: 1,
      type: type,
      action: "add",
    };
    const response = await fetch(this.api + "/decks/" + deck.id + "/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardObject),
    });

    if (!response.ok) {
      throw new Error("Error adding card to deck");
    }
    return response.json();
  }

  async removeCardFromDeck(deck, card, type = "mainboard") {
    const cardObject = {
      scryfallId: card.id,
      quantity: 1,
      type: type,
      action: "remove",
    };
    const response = await fetch(this.api + "/deck/" + deck.id + "/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardObject),
    });

    if (!response.ok) {
      throw new Error("Error adding card to deck");
    }
    return response.json();
  }

  async setPromoId(deck, promoId) {
    const cardObject = {
      promoId: promoId,
      action: "modify",
    };
    const response = await fetch(this.api + "/decks/" + deck.id + "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardObject),
    });

    if (!response.ok) {
      throw new Error("Error adding card to deck");
    }
    return response.json();
  }

  async updateCardAmount(deck, card, quantity, type = "mainboard") {
    const cardObject = {
      scryfallId: card.id,
      quantity: quantity,
      type: type,
      action: "modify",
    };
    const response = await fetch(this.api + "/decks/" + deck.id + "/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardObject),
    });

    if (!response.ok) {
      throw new Error("Error adding card to deck");
    }
    return response.json();
  }

  async setPrint(deck, card, print) {
    const response = await fetch(this.api + "/decks/" + deck.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldId: card.id, newId: print.id }),
    });

    if (!response.ok) {
      throw new Error("Error updating card amount");
    }
    return response.json();
  }

  async deleteDeck(deck) {
    const response = await fetch(this.api + "/decks/" + deck.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error deleting deck");
    }
    return response.json();
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

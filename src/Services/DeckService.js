import MagicHelper from "./MagicHelper";

export default class DeckService {
  url = "http://localhost:3456/api/decks";

  static shared = new DeckService();

  async loadMyDecks() {
    const response = await fetch(this.url);
    return response.json();
  }

  async loadDeck(deckId) {
    const response = await fetch(this.url + "/" + deckId);
    // sort mainboard by name ascending
    const resData = await response.json();
    resData.mainboard = resData.mainboard.sort((a, b) =>
      a.card.name.localeCompare(b.card.name)
    );
    return resData;
  }

  async createDeck(deck) {
    // let startingTime = new Date().getTime();
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deck),
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

  async addCardToDeck(deck, card) {
    const response = await fetch(this.url + "/" + deck.id + "/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    });

    if (!response.ok) {
      throw new Error("Error adding card to deck");
    }
    return response.json();
  }

  async removeCardFromDeck(deck, card) {
    const response = await fetch(
      this.url + "/" + deck.id + "/cards/" + card.id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error reducing card from deck");
    }
    return response.json();
  }

  async updateCardAmount(deck, card, amount) {
    const response = await fetch(
      this.url + "/" + deck.id + "/cards/" + card.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
      }
    );

    if (!response.ok) {
      throw new Error("Error updating card amount");
    }
    return response.json();
  }

  cardCount(deck) {
    return deck.mainboard.reduce((acc, card) => {
      return acc + card.amount;
    }, 0);
  }

  calculateWorth(deck) {
    return deck.mainboard.reduce((acc, card) => {
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

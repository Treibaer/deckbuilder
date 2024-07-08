import MagicHelper from "./MagicHelper";

export default class Client {
  static shared = new Client();

  token = localStorage.getItem("token");

  constructor() {}

  async getFinancesDashboard() {
    let data = await fetch(
      "https://mac.treibaer.de/api/v2/accounts/dashboard",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return await data.json();
  }

  async getDecks() {
    let data = await fetch("https://magic.treibaer.de/api/v1/moxfield/decks");
    let resData = await data.json();
    let decks = resData;
    decks = decks.filter((deck) => {
      if (deck.format === "commander") {
        return deck.cardCount <= 110 && deck.cardCount >= 99;
      }
      return deck.cardCount <= 60 && deck.cardCount >= 59;
    });
    return decks;
  }

  async getDeck(deckId) {
    let deckData = await fetch(
      `https://magic.treibaer.de/api/v1/moxfield/decks/${deckId}`
    );
    let resData = await deckData.json();
    return resData;
  }

  findCardFaces(card) {
    if (!card.card.card_faces || card.card.card_faces.length === 0) {
      return undefined;
    }
    const faces = [];
    for (let i = 0; i < card.card.card_faces.length; i++) {
      faces.push({
        image: MagicHelper.getImageUrl(card.card.scryfall_id, "normal", i),
      });
    }
    return faces;
  }

  async loadSets() {
    let data = await fetch("https://magic.treibaer.de/api/v1/sets");
    let resData = await data.json();
    return resData.reverse();
  }
}

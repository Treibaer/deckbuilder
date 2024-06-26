export default class Client {
  static shared = new Client();

  token = "7be4dd9b0da9f118093186c6f2c1c0bd68648a0f";

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
    let data = await fetch("https://magic.treibaer.de/decks");
    let resData = await data.json();

    let decks = resData.data.map((deck) => {
      return {
        id: deck.id,
        publicId: deck.publicId,
        name: deck.name,
        format: deck.format,
        viewCount: deck.viewCount,
        // cards: deck.cards,
        mainboardCount: deck.mainboardCount,
        colors: deck.colors,
      };
    });

    decks = decks.filter((deck) => {
      if (deck.format === "commander") {
        return deck.mainboardCount <= 110 && deck.mainboardCount >= 99;
      }
      return deck.mainboardCount <= 60 && deck.mainboardCount >= 59;
    });
    return decks;
  }

  async getDeck(deckId) {
    let deckData = await fetch(`https://magic.treibaer.de/decks/${deckId}`);
    let resData = await deckData.json();

    let index = 1;
    let cards = [];

    for (let card of Object.values(resData.commanders)) {
      cards.push({
        id: index,
        isCommander: true,
        name: card.card.name,
        quantity: card.quantity,
        type: card.card.type_line,
        colors: card.card.colors,
        manaCost: card.card.mana_cost,
        image:
          "https://magic.treibaer.de/image/card/normal/" +
          card.card.scryfall_id,
      });
      index++;
    }

    for (let card of Object.values(resData.mainboard)) {
      cards.push({
        id: index,
        isCommander: false,
        name: card.card.name,
        quantity: card.quantity,
        type: card.card.type_line,
        colors: card.card.colors,
        manaCost: card.card.mana_cost,
        image:
          "https://magic.treibaer.de/image/card/normal/" +
          card.card.scryfall_id,
      });
      index++;
    }
    return cards;
  }
  async loadSets() {
    let data = await fetch("https://magic.treibaer.de/sets");
    let resData = await data.json();
    return resData.reverse();
  }
}

import MagicHelper from "./MagicHelper";

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
        promoId: deck.mainScryfallId,
      };
    });

    decks = decks.filter((deck) => {
      // if (deck.name === "🌽Sneaky Farm🚜") {
      //   console.log(deck);
      // }
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
        id: card.card.scryfall_id,
        isCommander: true,
        name: card.card.name,
        quantity: card.quantity,
        card_faces: this.findCardFaces(card),
        type: card.card.type_line,
        colors: card.card.colors,
        manaCost: card.card.mana_cost,
        image: card.card.card_faces?.length
          ? MagicHelper.getCardFace(card.card.scryfall_id, 0)
          : MagicHelper.getImageUrl(card.card.scryfall_id),
      });
      index++;
    }

    for (let card of Object.values(resData.mainboard)) {
      cards.push({
        id: card.card.scryfall_id,
        isCommander: false,
        name: card.card.name,
        quantity: card.quantity,
        card_faces: this.findCardFaces(card),
        type: card.card.type_line,
        colors: card.card.colors,
        manaCost: card.card.mana_cost,
        image: MagicHelper.getImageUrl(card.card.scryfall_id),
      });
      index++;
    }
    return { name: resData.name, publicId: resData.publicId, cards: cards };
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
    let data = await fetch("https://magic.treibaer.de/sets");
    let resData = await data.json();
    return resData.reverse();
  }
}

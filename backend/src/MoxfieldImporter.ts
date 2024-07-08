import DeckService from "./DeckService.js";
import { Deck } from "./Models";

const deckService = new DeckService();

export default class MoxfieldImporter {
  async loadMoxfieldDeck(deckId: String) {
    let clone = await fetch(`https://magic.treibaer.de/api/v1/moxfield/decks/${deckId}`);
    clone = await clone.json();
    console.log("loading moxfield deck");

    const response = await fetch(`https://magic.treibaer.de/decks/${deckId}`);
    const data = await response.json();

    let cards = [];
    let commanderData: any = Object.values(data.commanders);
    for (let commander of commanderData) {
      cards.push({
        id: cards.length + 1,
        scryfallId: commander.card.scryfall_id,
        card: {
          name: commander.card.name,
          image_uris: {
            normal: commander.card.image_uris.normal,
          },
          prices: {
            usd: commander.card.prices.usd,
          },
        },
        amount: commander.quantity,
      });
    }

    const mainboard: any = Object.values(data.mainboard);
    for (let card of mainboard) {
      cards.push({
        id: cards.length + 1,
        scryfallId: card.card.scryfall_id,
        card: {
          name: card.card.name,

          image_uris: {
            normal: card.card.image_uris.normal,
          },
          prices: {
            usd: card.card.prices.usd,
          },
        },
        amount: card.quantity,
      });
    }

    // determine deck id
    
    const deck: Deck = {
      id: deckService.getNewDeckId(),
      name: data.name,
      description: data.description,
      mainboard: cards,
      promoId: data.promo_id,
      isPublic: false,
    };
    deckService.dataService.saveDeck(deck);
    return deck;
  }
}

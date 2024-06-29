import DataService from "./DataService.js";
import { Deck, ScryfallCard } from "./Models.js";

const dataService = new DataService();

export default class DeckService {
  decreaseCardAmount(deckId: number, scryfallId: string) {
    const decks = dataService.loadDecks();
    const deck = decks.find((d) => d.id === deckId);
    if (!deck) {
      throw new Error("Deck not found");
    }
    const cardIndex = deck.mainboard.findIndex(
      (c) => c.scryfallId === scryfallId
    );

    if (cardIndex === -1) {
      throw new Error("Card not found");
    }
    deck.mainboard[cardIndex].amount = deck.mainboard[cardIndex].amount - 1;

    if (deck.mainboard[cardIndex].amount === 0) {
      deck.mainboard.splice(cardIndex, 1);
      if (deck.promoId === scryfallId) {
        if (deck.mainboard.length > 0) {
          deck.promoId = deck.mainboard[0].scryfallId;
        } else {
          deck.promoId = "";
        }
      }
    }
    dataService.saveDecks(decks);
  }

  createOrUpdateDeck(deck: Deck) {
    const decks = dataService.loadDecks();
    let existingDeck = decks.find((d) => d.id === deck.id);

    if (existingDeck) {
      existingDeck.name = deck.name;
      existingDeck.description = deck.description;
      existingDeck.promoId = deck.promoId;
    } else {
      let maxId = 0;
      if (decks.length > 0) {
        maxId = Math.max(...decks.map((d) => d.id));
      }
      deck.id = maxId + 1;
      deck.mainboard = [];
      deck.promoId = "";
      decks.push(deck);
    }
    dataService.saveDecks(decks);
  }

  getDeck(deckId: number): Deck | undefined {
    const decks = dataService.loadDecks();
    return decks.find((d) => d.id === deckId);
  }

  addCardToDeck(deckId: number, card: ScryfallCard) {
    if (!card.id) {
      throw new Error("Invalid card");
    }

    const decks = dataService.loadDecks();
    const deck = decks.find((d) => d.id === deckId);

    if (!deck) {
      throw new Error("Deck not found");
    }

    let existingCard = deck.mainboard.find((c) => c.scryfallId === card.id);

    if (existingCard) {
      existingCard.amount = existingCard.amount + 1;
    } else {
      let maxId = 0;
      if (deck.mainboard.length > 0) {
        maxId = Math.max(...deck.mainboard.map((c) => c.id));
      }
      deck.mainboard.push({
        id: maxId + 1,
        scryfallId: card.id,
        card: card,
        amount: 1,
      });
      if (deck.promoId === "") {
        deck.promoId = card.id;
      }
    }
    dataService.saveDecks(decks);
  }

  replaceCard(deckId: number, oldId: string, newCard: any) {
    const decks = dataService.loadDecks();
    const deck = decks.find((d) => d.id === deckId);

    if (!deck) {
      throw new Error("Deck not found");
    }

    const oldCardIndex = deck.mainboard.findIndex((c) => c.scryfallId === oldId);
    // const newCardIndex = deck.mainboard.findIndex((c) => c.scryfallId === newId);

    if (oldCardIndex === -1) {
      throw new Error("Card not found");
    }

    deck.mainboard[oldCardIndex].card = newCard;
    deck.mainboard[oldCardIndex].scryfallId = newCard.id;
    if (deck.promoId === oldId) {
      deck.promoId = newCard.id;
    }
    dataService.saveDecks(decks);
  }
}

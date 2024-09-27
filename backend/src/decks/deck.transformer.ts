import { Injectable } from "@nestjs/common";
import { DeckDto } from "./dto/deck.dto";
import { Deck } from "./entities/deck.entity";

@Injectable()
export class DeckTransformer {
  transformDeckWithoutCards(deck: Deck): DeckDto {
    const cardCount = deck.cards.filter(
      (card) => card.zone !== "sideboard",
    ).length;
    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      promoId: deck.promoId,
      format: "",
      cardCount: cardCount,
      viewCount: 0,
      colors: [],
      commanders: [],
      mainboard: [],
      sideboard: [],
      isLocked: deck.isLocked,
      updatedAt: deck.updatedAt,
    };
  }

  transformDeck(deck: Deck): DeckDto {
    let cardCount = 0;
    const commanderCards = deck.cards
      .filter((card) => card.zone === "commandZone")
      .map((card) => {
        const cardFacesNames = card.card.cardFacesNames.split("###");
        let cardFaces: any = [];
        if (cardFacesNames.length > 1) {
          cardFaces = cardFacesNames.map((cardFaceName) => {
            return {
              name: cardFaceName,
            };
          });
        }
        cardCount += card.quantity;
        return {
          id: 0,
          card: {
            scryfallId: card.card.scryfallId,
            name: card.card.name,
            typeLine: card.card.typeLine,
            reprint: card.card.isReprint,
            printsSearchUri: card.card.printsSearchUri,
            cardFaces: cardFaces,
          },
          quantity: card.quantity,
        };
      });

    const mainboard = deck.cards
      .filter((card) => card.zone === "mainboard")
      .map((card) => {
        const cardFacesNames = card.card.cardFacesNames.split("###");
        let cardFaces: any = [];
        if (cardFacesNames.length > 1) {
          cardFaces = cardFacesNames.map((cardFaceName) => {
            return {
              name: cardFaceName,
            };
          });
        }
        cardCount += card.quantity;
        return {
          id: 0,
          card: {
            scryfallId: card.card.scryfallId,
            name: card.card.name,
            typeLine: card.card.typeLine,
            reprint: card.card.isReprint,
            printsSearchUri: card.card.printsSearchUri,
            cardFaces: cardFaces,
          },
          quantity: card.quantity,
        };
      });

    const sideboard = deck.cards
      .filter((card) => card.zone === "sideboard")
      .map((card) => {
        const cardFacesNames = card.card.cardFacesNames.split("###");
        let cardFaces: any = [];
        if (cardFacesNames.length > 1) {
          cardFaces = cardFacesNames.map((cardFaceName) => {
            return {
              name: cardFaceName,
            };
          });
        }
        cardCount += card.quantity;
        return {
          id: 0,
          card: {
            scryfallId: card.card.scryfallId,
            name: card.card.name,
            typeLine: card.card.typeLine,
            reprint: card.card.isReprint,
            printsSearchUri: card.card.printsSearchUri,
            cardFaces: cardFaces,
          },
          quantity: card.quantity,
        };
      });
    return {
      id: deck.id,
      name: deck.name,
      description: deck.description,
      promoId: deck.promoId,
      format: "",
      cardCount: cardCount,
      viewCount: 0,
      colors: [],
      commanders: commanderCards,
      mainboard: mainboard,
      sideboard: sideboard,
      isLocked: deck.isLocked,
      updatedAt: deck.updatedAt,
    };
  }
}

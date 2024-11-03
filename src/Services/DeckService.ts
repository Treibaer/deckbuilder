import { Deck, DeckFolder, MagicCard } from "../models/dtos";
import Client from "./Client";
import MagicHelper from "./MagicHelper";

export default class DeckService {
  static shared = new DeckService();
  private client = Client.shared;
  private constructor() {}

  async getAll(folderId: number | null = null) {
    const folderIdQuery = folderId !== null ? `?folderId=${folderId}` : "";
    return this.client.get<Deck[]>(`/decks${folderIdQuery}`);
  }

  async get(deckId: number) {
    const deck = await this.client.get<Deck>(`/decks/${deckId}`);
    deck.mainboard = deck.mainboard.sort((a, b) =>
      a.card.name.localeCompare(b.card.name)
    );
    return deck;
  }

  async create(name: string, folder_id: number | null) {
    return await this.client.post(`/decks`, { name, folder_id });
  }

  async createFolder(name: string) {
    return await this.client.post(`/decks/folders`, { name });
  }

  async updateFolder(folderId: number, name: string) {
    return await this.client.patch(`/decks/folders/${folderId}`, { name });
  }

  async deleteFolder(folderId: number) {
    return await this.client.delete(`/decks/folders/${folderId}`);
  }

  async getFolders() {
    return await this.client.get<DeckFolder[]>(`/decks/folders`);
  }

  async addCardToDeck(
    deck: Deck,
    scryfallId: string,
    zone: string,
    quantity = 1
  ) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: scryfallId,
      quantity: quantity,
      zone: zone,
      action: "add",
    };
    return await this.client.post(path, cardObject);
  }

  async updateDeck(deck: Deck, name: string, folderId: number | null) {
    const url = `/decks/${deck.id}`;
    const data = {
      name,
      folderId,
    };
    return await this.client.patch(url, data);
  }

  async toggleArchive(deck: Deck) {
    const url = `/decks/${deck.id}`;
    const cardObject = {
      isArchived: !deck.isArchived,
    };
    return await this.client.patch(url, cardObject);
  }

  async toggleLock(deck: Deck) {
    const url = `/decks/${deck.id}`;
    const cardObject = {
      isLocked: !deck.isLocked,
    };
    return await this.client.patch(url, cardObject);
  }

  async setPromoId(deck: Deck, promoId: string) {
    const url = `/decks/${deck.id}`;
    const cardObject = {
      promoId,
    };
    return await this.client.patch(url, cardObject);
  }

  async updateCardAmount(
    deck: Deck,
    scryfallId: string,
    zone: string,
    quantity: number
  ) {
    const path = `/decks/${deck.id}/cards`;
    const cardObject = {
      scryfallId: scryfallId,
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

  async moveZone(
    deck: Deck,
    card: MagicCard,
    originZone: string,
    destinationZone: string
  ) {
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

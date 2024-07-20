import Constants from "./Constants";
import MagicHelper from "./MagicHelper";

export default class Client {
  static shared = new Client();
  api = `${Constants.backendUrl}/api/v1`;

  getAuthToken() {
    return localStorage.getItem("token");
  }

  constructor() {}

  async get(url) {
    const response = await fetch(this.api + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }

  async post(url, data) {
    const response = await fetch(this.api + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: data,
    });

    if (!response.ok) {
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }

  async put(url, data) {
    const response = await fetch(this.api + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: data,
    });

    if (!response.ok) {
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }

  async delete(url) {
    const response = await fetch(this.api + url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("Error creating deck");
    }
    return await response.json();
  }

  async getDecks(format, page, shouldBeCommander) {
    const path = `/moxfield/decks?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }`;
    return await this.get(path);
  }

  async getDecksByCardId(moxFieldCardId, format, page, shouldBeCommander) {
    const path = `/moxfield/decks-search-by-card-id/${moxFieldCardId}?format=${format}&page=${page}&commander=${
      shouldBeCommander ? 1 : 0
    }`;
    return await this.get(path);
  }

  async getDeck(deckId) {
    const path = `/moxfield/decks/${deckId}`;
    return await this.get(path);
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
    const path = "/sets";
    let data = await this.get(path);
    return data.reverse();
  }
}

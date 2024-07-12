import MagicHelper from "./MagicHelper";

export default class Client {
  static shared = new Client();

  getAuthToken() {
    return localStorage.getItem("token");
  }

  constructor() {}

  async get(url) {
    console.log(this.token);
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // location.href = "/";
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
    const response = await fetch(url, {
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
    const response = await fetch(url, {
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
    const response = await fetch(url, {
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

  async getFinancesDashboard() {
    let data = await get("https://mac.treibaer.de/api/v2/accounts/dashboard");
    return await data.json();
  }

  api = "https://magic.treibaer.de/api/v1/moxfield";

  async getDecks(format, page, shouldBeCommander) {
    let resData = await this.get(
      `${this.api}/decks?format=${format}&page=${page}&commander=${
        shouldBeCommander ? 1 : 0
      }`
    );
    // let decks = resData;
    // decks = decks.filter((deck) => {
    //   if (deck.format === "commander") {
    //     return deck.cardCount <= 110 && deck.cardCount >= 99;
    //   }
    //   return deck.cardCount <= 60 && deck.cardCount >= 59;
    // });
    return resData;
  }

  async getDecksByCardId(moxFieldCardId, format, page, shouldBeCommander) {
    return await this.get(
      `${
        this.api
      }/decks-search-by-card-id/${moxFieldCardId}?format=${format}&page=${page}&commander=${
        shouldBeCommander ? 1 : 0
      }`
    );
  }

  async getDeck(deckId) {
    let resData = await this.get(
      `https://magic.treibaer.de/api/v1/moxfield/decks/${deckId}`
    );
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
    let data = await this.get("https://magic.treibaer.de/api/v1/sets");
    return data.reverse();
  }
}

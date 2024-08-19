import Constants from "./Constants";
import MagicHelper from "./MagicHelper";

export default class Client {
  static shared = new Client();

  api = `${Constants.backendUrl}/api/v1`;

  constructor() {}

  async get(url) {
    return this.request(url, { method: "GET" });
  }

  async post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(url, data) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(url) {
    return this.request(url, { method: "DELETE" });
  }

  getAuthToken() {
    return localStorage.getItem("token");
  }

  async request(url, options) {
    const response = await fetch(this.api + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
    });
    return this.handleResponse(response);
  }

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      const responseJson = await response.json();
      if (responseJson.error) {
        throw new Error(responseJson.error);
      }
      throw new Error("An error occurred");
    }
    return response.json();
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
}

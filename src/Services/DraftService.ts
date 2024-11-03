import { Deck } from "../models/dtos";
import Client from "./Client";

export default class DraftService {
  static shared = new DraftService();
  private client = Client.shared;
  private constructor() {}

  async getAll(folderId: number | null = null) {
    const folderIdQuery = folderId !== null ? `?folderId=${folderId}` : "";
    return this.client.get<Deck[]>(`/decks${folderIdQuery}`);
  }

  async get(draftId: number) {
    return await this.client.get<Deck>(`/drafts/${draftId}`);
  }

  async create(name: string, folder_id: number | null) {
    return await this.client.post(`/decks`, { name, folder_id });
  }
}

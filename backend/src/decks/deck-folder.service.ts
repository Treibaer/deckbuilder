import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/users/user.service";
import { DeckFolder } from "./entities/deck-folder.entity";
import { Deck } from "./entities/deck.entity";

@Injectable()
export class DeckFolderService {
  constructor(private readonly userService: UserService) {}

  private get userId() {
    if (!this.userService.user) {
      throw new UnauthorizedException();
    }
    return this.userService.user.id;
  }

  async createFolder(name: string) {
    // check if folder already exists
    const existingFolder = await DeckFolder.findOne({
      where: { creator_id: this.userId, name },
    });
    if (existingFolder) {
      throw new BadRequestException("Folder already exists");
    }
    try {
      const folder = await DeckFolder.create({
        creator_id: this.userId,
        name,
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      });
      return folder;
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Failed to create deck");
    }
  }

  async getFolders() {
    return await DeckFolder.findAll({
      where: { creator_id: this.userId },
      order: [["name", "ASC"]],
    });
  }

  async updateFolder(id: number, name: string) {
    const folder = await DeckFolder.findByPk(id);
    if (!folder) {
      throw new NotFoundException("Folder not found");
    }
    if (folder.creator_id !== this.userId) {
      throw new UnauthorizedException();
    }
    folder.name = name;
    folder.updatedAt = Math.floor(Date.now() / 1000);
    return await folder.save();
  }

  async deleteFolder(id: number) {
    const folder = await DeckFolder.findByPk(id);
    if (!folder) {
      throw new NotFoundException("Folder not found");
    }
    if (folder.creator_id !== this.userId) {
      throw new UnauthorizedException();
    }
    const decks = await Deck.findAll({ where: { folder_id: id } });
    if (decks.length > 0) {
      throw new BadRequestException("Folder is not empty");
    }
    await DeckFolder.destroy({ where: { id } });
  }
}

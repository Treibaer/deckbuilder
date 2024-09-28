import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { DeckCard } from "./deck-card.entity";
import { DeckFolder } from "./deck-folder.entity";

@Table({ tableName: "deck", timestamps: false })
export class Deck extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  format: string;

  @Column({ field: "promo_id" })
  promoId: string;

  @Column({ field: "is_locked", allowNull: false, defaultValue: false })
  isLocked: boolean;

  @Column({ field: "public", defaultValue: true })
  isPublic: boolean;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, "creator_id")
  creator: User;

  @HasMany(() => DeckCard, "deck_id")
  cards: DeckCard[];

  @ForeignKey(() => DeckFolder)
  @Column
  folder_id: number;

  @BelongsTo(() => DeckFolder, "folder_id")
  folder: DeckFolder;

  @Column({ field: "created_at", allowNull: false })
  createdAt: number;

  @Column({ field: "updated_at", allowNull: false })
  updatedAt: number;

  @Column({ field: "is_archived", allowNull: false, defaultValue: false })
  isArchived: boolean;
}

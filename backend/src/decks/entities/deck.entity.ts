import {
  BelongsTo,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { DeckCard } from "./deck-card.entity";

@Table({ tableName: "deck", timestamps: false })
export class Deck extends Model {
  @PrimaryKey
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

  @Column({ field: "public", defaultValue: true })
  isPublic: boolean;

  @BelongsTo(() => User, "creator_id")
  creator: User;

  @HasMany(() => DeckCard, "deck_id")
  cards: DeckCard[];
}
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { Card } from "./card.entity";

@Table({ tableName: "favorite_card", timestamps: false })
export class FavoriteCard extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false, field: "scryfall_id" })
  scryfallId: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  creator_id: number;

  @BelongsTo(() => User, "creator_id")
  creator: User;

  @Column({ field: "created_at", allowNull: false })
  createdAt: number;
}

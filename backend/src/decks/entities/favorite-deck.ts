import {
  AutoIncrement,
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";

@Table({ tableName: "favorite_deck", timestamps: false })
export class FavoriteDeck extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  moxfieldId: string;

  @BelongsTo(() => User, "creator_id")
  creator: User;

  @Column({ field: "created_at" })
  createdAt: number;
}

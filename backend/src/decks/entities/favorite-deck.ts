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

@Table({ tableName: "favorite_deck", timestamps: false })
export class FavoriteDeck extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false })
  moxfieldId: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  creatorId: number;

  @BelongsTo(() => User)
  creator: User;

  @Column({ field: "created_at", allowNull: false })
  createdAt: number;
}

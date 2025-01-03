import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from "sequelize-typescript";
import { User } from "./user.entity";

@Table({ tableName: "deck_folder", timestamps: false })
export class DeckFolder extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, "creator_id")
  creator: User;

  @Column({ field: "created_at", allowNull: false })
  createdAt: number;

  @Column({ field: "updated_at", allowNull: false })
  updatedAt: number;
}

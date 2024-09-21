import { AutoIncrement, BelongsTo, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./user.entity";

@Table({ tableName: "playtest", timestamps: false })
export class Playtest extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  
  @Column
  game: string;

  @Column({ field: "created_at" })
  createdAt: number;

  @BelongsTo(() => User, "creator_id")
  creator: User;
}

import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Playtest } from "./playtest.entity";
import { User } from "./user.entity";

@Table({ tableName: "game", timestamps: false })
export class Game extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @BelongsTo(() => User, "player0_id")
  player0: User;

  @BelongsTo(() => User, "player1_id")
  player1: User;

  @Column({ field: "created_at" })
  createdAt: number;

  @ForeignKey(() => Playtest)
  @Column({ field: "playtest0_id" })
  playtest0Id: number;

  @ForeignKey(() => Playtest)
  @Column({ field: "playtest1_id" })
  playtest1Id: number;

  @BelongsTo(() => Playtest, "playtest0_id")
  playtest0: Playtest;

  @BelongsTo(() => Playtest, "playtest1_id")
  playtest1: Playtest;

  @Column
  game0: string;

  @Column
  game1: string;
}

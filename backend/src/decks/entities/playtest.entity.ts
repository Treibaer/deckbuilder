import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { User } from "./user.entity";
import { Deck } from "./deck.entity";

@Table({ tableName: "playtest", timestamps: false })
export class Playtest extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ allowNull: false, defaultValue: "", type: DataType.TEXT("long") })
  game: string;

  @Column({
    field: "all_scryfalll_ids",
    allowNull: false,
    type: DataType.TEXT("long"),
  })
  allScryfallIds: string;

  @Column({ field: "created_at", allowNull: false })
  createdAt: number;

  @Column({ field: "promo_id", allowNull: false })
  promoId: string;

  @Column({ field: "name", allowNull: false })
  name: string;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, "creator_id")
  creator: User;
  
  @Column({ field: "moxfield_id", allowNull: false })
  moxfieldId: string;

  @Column({ allowNull: false, field: "related_cards", type: DataType.TEXT })
  relatedCards: string;
}

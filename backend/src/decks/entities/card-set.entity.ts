import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "card_set", timestamps: false })
export class CardSet extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  
  @Column({ field: "scryfall_id" })
  scryfallId: string;

  @Column
  code: string;

  @Column
  name: string;

  @Column({ field: "set_type" })
  setType: string;

  @Column({ field: "released_at" })
  releasedAt: string;

  @Column({ field: "icon_svg_uri" })
  iconSvgUri: string;

  @Column({ field: "card_count" })
  cardCount: number;
}

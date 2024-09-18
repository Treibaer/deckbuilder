import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Card } from "./card.entity";

@Table({ tableName: "deck_card", timestamps: false })
export class DeckCard extends Model {
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => Card)
  @Column({ field: "scryfall_id" })
  scryfallId: string;

  @Column
  zone: string;

  @Column
  quantity: number;

  @BelongsTo(() => Card, { foreignKey: 'scryfall_id', targetKey: 'scryfallId' })
  card: Card; 
}

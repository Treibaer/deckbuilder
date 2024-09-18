import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { DeckCard } from "./deck-card.entity";

@Table({ tableName: "card", timestamps: false })
export class Card extends Model {
  @PrimaryKey
  @Column({ field: "scryfall_id" })
  scryfallId: string;

  @Column({ field: "oracle_id" })
  oracleId: string;

  @Column
  name: string;

  @Column({ field: "released_at" })
  releasedAt: string;

  @Column
  image: string;

  @Column({ field: "type_line" })
  typeLine: string;

  @Column({ field: "reprint" })
  isReprint: boolean;
  
  @Column({ field: "prints_search_uri" })
  printsSearchUri: string;

  @Column({ field: "card_faces_names" })
  cardFacesNames: string;

  // Define the hasMany association here
  static associate() {
    Card.hasMany(DeckCard, { foreignKey: 'scryfallId', sourceKey: 'scryfallId' });
  }
}

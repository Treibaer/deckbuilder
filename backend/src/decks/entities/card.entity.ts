import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { DeckCard } from "./deck-card.entity";

@Table({
  tableName: "card",
  timestamps: false,
  indexes: [
    { fields: ["scryfall_id"] },
    { fields: ["oracle_id"] },
    { fields: ["name"] },
    { fields: ["set_code"] },
    { fields: ["set_name"] },
  ],
})
export class Card extends Model {
  @PrimaryKey
  @Column({ allowNull: false, field: "scryfall_id" })
  scryfallId: string;

  @Column({ allowNull: false, field: "oracle_id" })
  oracleId: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false, field: "released_at" })
  releasedAt: string;

  @Column({ allowNull: false })
  image: string;

  @Column({ allowNull: false, field: "type_line" })
  typeLine: string;

  @Column({ allowNull: false, field: "reprint" })
  isReprint: boolean;

  @Column({ allowNull: false, field: "prints_search_uri" })
  printsSearchUri: string;

  @Column({ allowNull: false, field: "card_faces_names" })
  cardFacesNames: string;

  @Column({ allowNull: false, field: "set_code" })
  setCode: string;

  @Column({ allowNull: false, field: "set_name" })
  setName: string;

  @Column({ allowNull: false, field: "oracle_text", type: DataType.TEXT })
  oracleText: string;

  @Column({ allowNull: false, field: "mana_cost" })
  manaCost: string;

  @Column({ allowNull: false })
  colors: string;

  @Column({ allowNull: false })
  rarity: string;

  @Column({ allowNull: false })
  cmc: string;

  @Column({ allowNull: false })
  power: string;

  @Column({ allowNull: false })
  toughness: string;

  @Column({ allowNull: false, field: "set_id" })
  setId: string;

  @Column({ allowNull: false })
  reprint: boolean;

  @Column({ allowNull: false, field: "image_art_crop" })
  imageArtCrop: string;

  // Define the hasMany association here
  // static associate() {
  //   Card.hasMany(DeckCard, {
  //     foreignKey: "scryfallId",
  //     sourceKey: "scryfallId",
  //   });
  // }
}

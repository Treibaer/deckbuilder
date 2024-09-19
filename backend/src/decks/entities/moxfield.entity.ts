import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "moxfield_mapping", timestamps: false })
export class MoxFieldMapping extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column({ field: "moxfield_id" })
  moxFieldId: string;

  @Column({ field: "scryfall_id" })
  scryfallId: string;
}

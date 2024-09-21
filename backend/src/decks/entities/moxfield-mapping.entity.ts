import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "moxfield_mapping", timestamps: false })
export class MoxFieldMapping extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ field: "moxfield_id" })
  moxfieldId: string;

  @Column({ field: "scryfall_id" })
  scryfallId: string;
}

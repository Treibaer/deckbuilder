import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "settings", timestamps: false })
export class Settings extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ field: "last_import_cards" })
  lastImportCards: number;

  @Column({ field: "last_import_symbols" })
  lastImportSymbols: number;

  @Column({ field: "last_import_sets" })
  lastImportSets: number;

  @Column({ field: "last_import_mox_field_mappings" })
  lastImportMoxFieldMappings: number;
}

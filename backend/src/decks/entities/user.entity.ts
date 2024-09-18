import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "user", timestamps: false })
export class User extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  username: string;
}

import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "user", timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({defaultValue: "[]"})
  roles: string;

  // @Column({defaultValue: "{}"})
  // settings: string;
}

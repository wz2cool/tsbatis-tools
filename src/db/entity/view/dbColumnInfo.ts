import { column, Entity } from "tsbatis";

export class DbColumnInfo extends Entity {
  @column("name")
  public name: string;
  @column("type")
  public type: string;
  @column("pk")
  public pk: number;
  @column("auto_increment")
  public autoIncrement: number;
  @column("column_comment")
  public comment: string;
}

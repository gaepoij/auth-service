import { Model } from "objection";

export class User extends Model {
  id: number;
  username: string;
  password: string;

  static get tableName() {
    return "user";
  }
}

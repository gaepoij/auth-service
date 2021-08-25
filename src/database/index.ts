import { Model } from "objection";
import Knex from "knex";

export const initDb = async () => {
  const knex = Knex({
    client: "postgres",
    useNullAsDefault: true,
    connection: {
      user: "postgres",
      host: "localhost",
      database: "user",
      port: 5432,
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  });

  knex.migrate.latest();
  Model.knex(knex);

  console.log("database initialized..");
};

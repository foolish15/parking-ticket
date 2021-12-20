import * as dotenv from "dotenv";

dotenv.config();

module.exports = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  pool: { min: 0, max: 10 },
  migrations: {
    tableName: 'migrations',
    extension: 'ts',
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

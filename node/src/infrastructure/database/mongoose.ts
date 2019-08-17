import * as mongoose from "mongoose";

let dbString = "mongodb://";

if (process.env.DB_USER && process.env.DB_PWD) {
  dbString += `${process.env.DB_USER}:${process.env.DB_PWD}@`;
}

dbString += process.env.DB_HOST;

if (process.env.DB_AUTH_DB) {
  dbString += `?authSource=${process.env.DB_AUTH_DB}`;
}

mongoose
  .connect(dbString, { useNewUrlParser: true })
  .then(() => console.debug("Mongoose connected."))
  .catch(console.error.bind(console, "connection error:"));

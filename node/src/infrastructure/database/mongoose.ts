import mongoose from "mongoose";

let dbString = "mongodb://";

if (process.env.DB_USER && process.env.DB_PWD) {
  dbString += `${process.env.DB_USER}:${process.env.DB_PWD}@`;
}

dbString += process.env.DB_HOST_AND_DBNAME;

if (process.env.DB_AUTH_DB) {
  dbString += `?authSource=${process.env.DB_AUTH_DB}`;
}

if (dbString.indexOf("?") > -1) {
  dbString += "&replSet=rs";
} else {
  dbString += "?replSet=rs";
}

mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    autoIndex: !process.env.MIGRATION,
    useCreateIndex: true
  })
  .then(() => console.debug("Mongoose connected.")) // tslint:disable-line:no-console
  .catch(console.error.bind(console, "connection error:")); // tslint:disable-line:no-console

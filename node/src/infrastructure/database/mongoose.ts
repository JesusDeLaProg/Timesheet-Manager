import mongoose from "mongoose";

const dbString = process.env.DB_CONNECTION_URI || "";

mongoose
  .connect(dbString, {
    autoIndex: !process.env.MIGRATION,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.debug("Mongoose connected.")) // tslint:disable-line:no-console
  .catch(console.error.bind(console, "connection error:")); // tslint:disable-line:no-console

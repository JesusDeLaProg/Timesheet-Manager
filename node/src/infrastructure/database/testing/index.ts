import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
export { ModelModule } from "../models";

export const mongoServer = new MongoMemoryServer();

mongoServer.getConnectionString().then(
  mongoConnectionString =>
    mongoose
      .connect(mongoConnectionString, { useNewUrlParser: true })
      .then(() => console.debug("Mongoose connected.")) // tslint:disable-line:no-console
      .catch(console.error.bind(console, "connection error:")) // tslint:disable-line:no-console
);

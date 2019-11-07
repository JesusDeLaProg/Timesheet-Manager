/* tslint:disable:object-literal-sort-keys */
import { Schema } from "mongoose";

import unique from "../validators/unique";

export const ClientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Vous devez entrer un nom unique pour ce client."],
      unique: true,
      trim: true,
      validate: [
        unique(
          "Client",
          "name",
          "Vous devez entrer un nom unique pour ce client."
        )
      ]
    }
  },
  {
    timestamps: true
  }
);

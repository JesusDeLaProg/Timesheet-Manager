/* tslint:disable:object-literal-sort-keys */
import { Schema } from "mongoose";

import unique from "../../validators/unique";

export const ActivitySchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Vous devez entrer un code unique pour cette activité."],
      unique: true,
      trim: true,
      validate: [
        unique(
          "Activity",
          "code",
          "Vous devez entrer un code unique pour cette activité."
        )
      ]
    },
    name: {
      type: String,
      required: [true, "Vous devez entrer un nom pour cette activité."],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

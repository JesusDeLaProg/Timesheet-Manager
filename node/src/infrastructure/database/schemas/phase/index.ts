/* tslint:disable:object-literal-sort-keys */
import { Schema } from "mongoose";

import idexists from "../../validators/idexists";
import unique from "../../validators/unique";

export const PhaseSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Vous devez entrer un code unique pour cette phase."],
      unique: true,
      trim: true,
      validate: [
        unique(
          "Phase",
          "code",
          "Vous devez entrer un code unique pour cette phase."
        )
      ]
    },
    name: {
      type: String,
      required: [true, "Vous devez entrer un nom pour cette phase."],
      trim: true
    },
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity"
      }
    ]
  },
  {
    timestamps: true
  }
);

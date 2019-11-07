/* tslint:disable:object-literal-sort-keys */
import { Schema } from "mongoose";
import { $enum } from "ts-enum-util";

import { ProjectType } from "../../../constants/enums/project-type";
import idexists from "../validators/idexists";
import unique from "../validators/unique";

export const ProjectSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Vous devez entrer un code unique pour ce projet."],
      unique: true,
      trim: true,
      validate: [
        unique(
          "Project",
          "code",
          "Vous devez entrer un code unique pour ce projet."
        )
      ]
    },
    name: {
      type: String,
      required: [true, "Vous devez entrer un nom pour ce projet."],
      trim: true
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Vous devez entrer un client."],
      validate: [idexists("Client", "Ce client n'existe pas.")]
    },
    type: {
      type: String,
      required: [true, "Vous devez entrer un type de projet."],
      enum: {
        values: $enum(ProjectType).getValues(),
        message: `Le type de projet doit être dans [${$enum(
          ProjectType
        ).getValues()}].`
      }
    },
    isActive: {
      type: Boolean,
      required: [true, "Vous devez entrer un statut pour ce projet."],
      default: true
    }
  },
  {
    timestamps: true
  }
);

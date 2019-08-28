import { Schema } from "mongoose";

import idexists from "../../validators/idexists";
import unique from "../../validators/unique";

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
      validate: [idexists("Client", "Ce client n'existe pas.")]
    },
    fees: {
      type: Number
    },
    method: {
      type: String,
      enum: {
        values: ["Forfait", "Horaire avec budget"],
        message: "Cette méthode de paiement n'existe pas."
      }
    },
    isActive: {
      type: Boolean,
      required: [true, "Vous devez entrer un statut pour ce projet."]
    }
  },
  {
    timestamps: true
  }
);

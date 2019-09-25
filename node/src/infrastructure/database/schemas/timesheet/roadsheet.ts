/* tslint:disable:object-literal-sort-keys */
import { Schema, Types } from "mongoose";

import {
  IRoadsheetLine,
  ITimesheet,
  ITravel
} from "../../../../../../types/datamodels";
import datecompare from "../../validators/datecompare";
import idexists from "../../validators/idexists";

const ExpenseSchema = new Schema({
  description: {
    type: String,
    required: [true, "Vous devez entrer une description pour cette dépense."]
  },
  amount: {
    type: Number,
    required: [true, "Vous devez entrer un montant pour cette dépense."]
  }
});

const TravelSchema = new Schema({
  date: {
    type: Date,
    required: [true, "Vous devez entrer une date pour ce déplacement."],
    validate: [
      datecompare(
        (doc: ITimesheet) => doc.begin,
        (doc: ITimesheet) => doc.end,
        "day",
        "[]",
        "La date de ce déplacement doit se situer entre le début et la fin de cette feuille de temps."
      )
    ]
  },
  from: {
    type: String,
    required: [
      function(this: ITravel) {
        return (
          this.expenses.filter(
            (expense) => expense.amount && expense.description
          ).length === 0
        );
      },
      "Vous devez entrer un point de départ si vous n'entrez pas de dépenses."
    ]
  },
  to: {
    type: String,
    required: [
      function(this: ITravel) {
        return (
          this.expenses.filter(
            (expense) => expense.amount && expense.description
          ).length === 0
        );
      },
      "Vous devez entrer un point d'arrivée si vous n'entrez pas de dépenses."
    ]
  },
  distance: {
    type: Number,
    required: [
      function(this: ITravel) {
        return (
          this.expenses.filter(
            (expense) => expense.amount && expense.description
          ).length === 0
        );
      },
      "Vous devez entrer une distance si vous n'entrez pas de dépenses."
    ],
    min: 0
  },
  expenses: {
    type: [ExpenseSchema],
    required: [true, "Vous devez fournir une liste de dépenses."]
  }
});

export const RoadsheetLineSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Vous devez choisir un projet pour ce déplacement."],
    index: true,
    validate: [
      idexists("Project", "Ce projet n'existe pas."),
      {
        type: "InternalUniquenessValidator",
        msg:
          "Vous ne pouvez pas utiliser plusieurs fois le même projet sur une même feuille de route",
        validator(this: Types.Embedded, value: string | Types.ObjectId) {
          if (!value) {
            return true;
          } // Only validate if value is set.

          const id =
            value instanceof Types.ObjectId
              ? (value as Types.ObjectId)
              : new Types.ObjectId(value);
          const lines = this.parentArray() as unknown[]; // Wide cast for next cast to IRoadsheetLine[]
          const filtered = (lines as IRoadsheetLine[]).filter((line) =>
            id.equals(line.project)
          );
          return filtered.length === 1;
        }
      }
    ]
  },
  travels: {
    type: [TravelSchema],
    required: [true, "Vous devez entrer une liste de déplacement."]
  }
});

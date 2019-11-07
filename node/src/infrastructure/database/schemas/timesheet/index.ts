/* tslint:disable:object-literal-sort-keys */
import mongoose, { Schema, Types } from "mongoose";

import { ObjectId } from "bson";
import moment from "moment";
import {
  ITimesheet,
  ITimesheetEntry,
  ITimesheetLine,
  StringId
} from "../../../../../../types/datamodels";
import { IViewPhase, IViewTimesheet } from "../../../../../../types/viewmodels";
import {
  PhaseDocument,
  TimesheetDocument
} from "../../../../interfaces/models";
import arrayLength from "../../validators/arraylength";
import datecompare from "../../validators/datecompare";
import idexists from "../../validators/idexists";
import min from "../../validators/min";
import { RoadsheetLineSchema } from "./roadsheet";

function lineInternalUniquenessValidator() {
  return {
    type: "InternalUniquenessValidator",
    msg:
      "Une seule ligne peut avoir la même combinaison de projet/phase/activité/divers.",
    validator(
      this: Types.Embedded &
        ITimesheetLine<
          string | Types.ObjectId,
          string | Types.ObjectId,
          string | Types.ObjectId
        >,
      value: string | Types.ObjectId
    ) {
      if (!this.project || !this.phase || !this.activity) {
        return true;
      } // Only validate if all values are set

      const project =
        this.project instanceof ObjectId
          ? (this.project as ObjectId)
          : new ObjectId(this.project);
      const phase =
        this.phase instanceof ObjectId
          ? (this.phase as ObjectId)
          : new ObjectId(this.phase);
      const activity =
        this.activity instanceof ObjectId
          ? (this.activity as ObjectId)
          : new ObjectId(this.activity);

      const lines = this.parentArray() as unknown[];
      const filtered = (lines as ITimesheetLine[]).filter(
        (line) =>
          project.equals(line.project) &&
          phase.equals(line.phase) &&
          activity.equals(line.activity) &&
          this.divers === line.divers
      );
      return filtered.length === 1;
    }
  };
}

function periodUniquenessValidator() {
  return {
    type: "UniqueValidator",
    msg:
      "Un employé ne peut avoir qu'une seule feuille de temps pour une même période.",
    async validator(this: IViewTimesheet, value: Date) {
      if (!this.begin || !this.end || !this.user) {
        return true;
      } // Validate only if values are set.
      const result = await mongoose.model("Timesheet").find({
        _id: { $ne: this._id },
        user: this.user,
        $or: [
          { begin: { $lte: this.begin }, end: { $gte: this.begin } },
          { begin: { $gte: this.begin, $lte: this.end } }
        ]
      });
      return result.length === 0;
    }
  };
}

const TimesheetEntrySchema = new Schema({
  date: {
    type: Date,
    required: [true, "Vous devez entrer une date pour cette entrée."],
    validate: [
      datecompare(
        (doc: ITimesheet) => doc.begin,
        (doc: ITimesheet) => doc.end,
        "day",
        "[]",
        "La date de cette entrée doit être située entre le début et la fin de cette feuille de temps."
      )
    ]
  },
  time: {
    type: Number,
    required: [true, "Vous devez entrer un temps pour cette entrée."],
    default: 0,
    validate: [
      min(
        0,
        "Vous devez entrer une valeur égale ou supérieure à 0 pour cette entrée.",
        true
      )
    ]
  }
});

const TimesheetLineSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Vous devez choisir un projet pour cette ligne."],
    index: true,
    validate: [
      idexists("Project", "Ce projet n'existe pas."),
      lineInternalUniquenessValidator()
    ]
  },
  phase: {
    type: Schema.Types.ObjectId,
    ref: "Phase",
    required: [true, "Vous devez entrer une phase pour cette ligne"],
    validate: [
      idexists("Phase", "Cette phase n'existe pas."),
      lineInternalUniquenessValidator()
    ]
  },
  activity: {
    type: Schema.Types.ObjectId,
    ref: "Activity",
    required: [true, "Vous devez entrer une activité pour cette ligne."],
    validate: [
      idexists("Activity", "Cette activité n'existe pas."),
      lineInternalUniquenessValidator(),
      {
        type: "PhaseActivityCompatibilityValidator",
        msg:
          "Vous ne pouvez pas entrer cette activité avec la phase présente sur cette ligne.",
        async validator(
          this: ITimesheetLine,
          value: StringId | Types.ObjectId
        ) {
          if (!value || !this.phase) {
            return true;
          } // Only validate if values are set.
          const id = value instanceof ObjectId ? value : new ObjectId(value);
          const phase = (await mongoose
            .model<PhaseDocument>("Phase")
            .findById(this.phase)) as IViewPhase;
          return phase.activities.findIndex((act) => id.equals(act)) !== -1;
        }
      }
    ]
  },
  divers: {
    type: String,
    validate: [lineInternalUniquenessValidator()]
  },
  entries: {
    type: [TimesheetEntrySchema],
    required: [true, "Vous devez entrer une liste d'entrées pour cette ligne"],
    validate: {
      type: "ListLenghtValidator",
      msg:
        "Vous devez entrer le nombre d'entrées indiqué par les dates de début et de fin de la feuille de temps.",
      validator(this: Types.Embedded, value: ITimesheetEntry[]) {
        const timesheet = (this.ownerDocument() as unknown) as ITimesheet;
        const numberOfDays =
          Math.floor(
            moment
              .duration(moment(timesheet.end).diff(timesheet.begin))
              .asDays()
          ) + 1; // Add 1 to include the first day.
        return value.length === numberOfDays;
      }
    }
  }
});

export const TimesheetSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "Vous devez attribuer cette feuille de temps à un employé."
      ],
      validate: [idexists("User", "Cet employé n'existe pas.")]
    },
    begin: {
      type: Date,
      required: [true, "Vous devez entrer une date de début."],
      validate: [
        {
          type: "DateMinimumValidator",
          msg: "La date de début doit être avant la date de fin.",
          validator(this: ITimesheet, value: Date) {
            if (!value || !this.end) {
              return true;
            } // Validate only if values are set.
            return moment(value).isBefore(this.end);
          }
        },
        periodUniquenessValidator()
      ]
    },
    end: {
      type: Date,
      required: [true, "Vous devez entrer une date de fin."],
      validate: [
        {
          type: "DateMaximumValidator",
          msg: "La date de fin doit être après la date de début.",
          validator(this: ITimesheet, value: Date) {
            if (!value || !this.begin) {
              return true;
            } // Validate only if values are set.
            return moment(value).isAfter(this.begin);
          }
        },
        periodUniquenessValidator()
      ]
    },
    lines: {
      type: [TimesheetLineSchema],
      required: [
        true,
        "Vous devez entrer une liste de ligne sur cette feuille de temps."
      ],
      validate: [
        arrayLength(
          1,
          null,
          "Vous devez entrer au moins une ligne sur cette feuille de temps."
        )
      ]
    },
    roadsheetLines: {
      type: [RoadsheetLineSchema]
    }
  },
  {
    timestamps: true
  }
);

TimesheetSchema.pre("validate", function(this: TimesheetDocument) {
  this.begin =
    this.begin &&
    moment(this.begin)
      .startOf("day")
      .toDate();
  this.end =
    this.end &&
    moment(this.end)
      .startOf("day")
      .toDate();
  this.lines =
    this.lines &&
    this.lines.map((line) => {
      line.entries =
        line.entries &&
        line.entries.map((entry) => {
          entry.date =
            entry.date &&
            moment(entry.date)
              .startOf("day")
              .toDate();
          return entry;
        });
      return line;
    });
  this.roadsheetLines =
    this.roadsheetLines &&
    this.roadsheetLines.map((line) => {
      line.travels =
        line.travels &&
        line.travels.map((travel) => {
          travel.date =
            travel.date &&
            moment(travel.date)
              .startOf("day")
              .toDate();
          return travel;
        });
      return line;
    });
});

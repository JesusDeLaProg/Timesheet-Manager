/* tslint:disable:object-literal-sort-keys */
import base64url from "base64url";
import crypto from "crypto";
import { promisify } from "util";
import sortBy from "lodash.sortby";
import moment from "moment";
import { Schema, SchemaTypeOpts, Types } from "mongoose";
import { $enum } from "ts-enum-util";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

import {
  IBillingGroup,
  IBillingRate,
  IUser
} from "../../../../../types/datamodels";
import { ProjectType } from "../../../constants/enums/project-type";
import { UserRole } from "../../../constants/enums/user-role";
import min from "../validators/min";
import unique from "../validators/unique";

function timelineDensityValidators(): SchemaTypeOpts.ValidateOpts[] {
  return [
    {
      type: "TimelineDensityValidator",
      msg: "Un taux horaire doit être actif en tout temps.",
      validator(this: IBillingRate & Types.Embedded, value: Date) {
        const sortedBillingRates = sortBy(
          (this.parentArray() as unknown) as IBillingRate[],
          "begin"
        );
        for (let i = 0; i < sortedBillingRates.length - 1; ++i) {
          const end = sortedBillingRates[i].end;
          const nextBegin = sortedBillingRates[i + 1].begin;
          if (
            moment.duration(moment(end).diff(nextBegin)).asMilliseconds() > 1
          ) {
            return false;
          }
        }
        return true;
      }
    },
    {
      type: "TimelineNoOverlapValidator",
      msg: "Un seul taux horaire doit être actif en tout temps.",
      validator(this: IBillingRate & Types.Embedded, value: Date) {
        const sortedBillingRates = sortBy(
          (this.parentArray() as unknown) as IBillingRate[],
          "begin"
        );
        for (let i = 0; i < sortedBillingRates.length - 1; ++i) {
          const end = sortedBillingRates[i].end;
          const nextBegin = sortedBillingRates[i + 1].begin;
          if (moment(end).isSameOrAfter(nextBegin, "day")) {
            return false;
          }
        }
        return true;
      }
    }
  ];
}

export const BillingRateSchema = new Schema({
  begin: {
    type: Date,
    required: [
      true,
      "Vous devez entrer une date de début pour ce taux horaire."
    ],
    validate: [
      {
        type: "FirstElementValidator",
        msg: "Le premier taux horaire doit débuter le 1er janvier 1970.",
        validator(this: IBillingRate & Types.Embedded, value: Date) {
          const sortedBillingRates = sortBy(
            (this.parentArray() as unknown) as IBillingRate[],
            "begin"
          );
          if (sortedBillingRates.indexOf(this) === 0) {
            return moment([1970, 0, 1]).isSame(value, "day");
          } else {
            return true;
          }
        }
      },
      {
        type: "DateMinimumValidator",
        msg: "La date de début doit se situer avant la date de fin.",
        validator(this: IBillingRate, value: Date) {
          if (!value || !this.end) {
            return true;
          }
          return moment(this.end).isAfter(value);
        }
      },
      ...timelineDensityValidators()
    ]
  },
  end: {
    type: Date,
    required: [
      function(this: IBillingRate & Types.Embedded) {
        const sortedBillingRates = sortBy(
          (this.parentArray() as unknown) as IBillingRate[],
          "begin"
        );
        return (
          sortedBillingRates.indexOf(this) !== sortedBillingRates.length - 1
        );
      },
      "Vous devez entrer une date de fin pour ce taux horaire."
    ],
    validate: [
      ...timelineDensityValidators(),
      {
        type: "LastElementValidator",
        msg: "Le dernier taux horaire ne doit pas avoir de date de fin.",
        validator(this: IBillingRate & Types.Embedded, value: Date) {
          const sortedBillingRates = sortBy(
            (this.parentArray() as unknown) as IBillingRate[],
            "begin"
          );
          if (
            sortedBillingRates.indexOf(this) ===
            sortedBillingRates.length - 1
          ) {
            return value == null;
          } else {
            return true;
          }
        }
      }
    ]
  },
  rate: {
    type: Number,
    required: [true, "Vous devez entrer un montant pour ce taux horaire."],
    validate: [min(0, "Vous devez entrer un montant supérieur à 0.")]
  },
  jobTitle: {
    type: String,
    required: [true, "Vous devez entrer un nom de poste pour ce taux horaire."]
  }
});

export const BillingGroupSchema = new Schema({
  projectType: {
    type: String,
    required: [
      true,
      "Vous devez entrer un type de projet pour ce groupe de taux horaire."
    ],
    enum: {
      values: $enum(ProjectType).getValues(),
      message: `Le type de projet doit être dans [${$enum(
        ProjectType
      ).getValues()}].`
    }
  },
  timeline: {
    type: [BillingRateSchema],
    required: [
      true,
      "Vous devez entrer une liste de taux horaire pour ce type de projet."
    ],
    validate: [
      {
        type: "ArrayLengthValidator",
        msg:
          "Vous devez entrer au moins un taux horaire pour ce type de projet.",
        validator(value: IBillingRate[]) {
          return value && value.length > 0;
        }
      }
    ]
  }
});

export const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Vous devez entrer un nom d'utilisateur unique."],
    unique: true,
    trim: true,
    index: true,
    validate: [
      unique(
        "User",
        "username",
        "Vous devez entrer un nom d'utilisateur unique."
      ),
      {
        type: "StringLengthValidator",
        msg: "Le nom d'utilisateur doit avoir au moins 3 caractères.",
        validator(value: string) {
          return !!value && isLength(value, { min: 3 });
        }
      }
    ]
  },
  firstName: {
    type: String,
    trim: true,
    required: [
      function(this: IUser) {
        return (
          !!(this.firstName || this.lastName) &&
          (this.firstName.trim() || this.lastName.trim())
        );
      },
      "Vous devez entrer au moins soit un prénom, soit un nom de famille."
    ]
  },
  lastName: {
    type: String,
    trim: true,
    required: [
      function(this: IUser) {
        return (
          !!(this.firstName || this.lastName) &&
          (this.firstName.trim() || this.lastName.trim())
        );
      },
      "Vous devez entrer au moins soit un prénom, soit un nom de famille."
    ]
  },
  role: {
    type: Number,
    required: [true, "Vous devez entrer un rôle pour cet utilisateur."],
    enum: {
      values: $enum(UserRole).getValues(),
      message: `Le rôle de l'utilisateur doit être dans [${$enum(
        UserRole
      ).getValues()}].`
    }
  },
  email: {
    type: String,
    validate: [
      {
        type: "EmailValidator",
        msg: "Vous devez entrer un courriel valide.",
        validator(value: string) {
          return !value || isEmail(value);
        }
      }
    ]
  },
  password: {
    type: String,
    required: [true, "Vous devez entrer un mot de passe."],
    validate: [
      {
        type: "StringLengthValidator",
        msg:
          "Votre mot de passe doit avoir une longueur d'au moins 3 caractères.",
        validator(value: string) {
          return !!value && isLength(value, { min: 3 });
        }
      },
      {
        type: "PasswordEncryptionValidation",
        msg:
          "Une erreur est survenue lors de la sauvegarde de votre mot de passe.",
        validator(value: string) {
          if (!value || !isLength(value, { min: 3 })) {
            return true;
          } // Only validate if the password was encrypted.

          const parts = value.split(".");
          return (
            parts.length === 5 &&
            parts.every((part) => isLength(part, { min: 1 }))
          );
        }
      }
    ]
  },
  isActive: {
    type: Boolean,
    required: [true, "Vous devez entrer un statut pour cet utilisateur."]
  },
  billingGroups: {
    type: [BillingGroupSchema],
    required: [
      true,
      "Vous devez entrer une liste de taux horaire pour cet employé."
    ],
    validate: [
      {
        type: "ProjectTypeCoverageValidator",
        msg:
          "Vous devez entrer une et une seule liste de taux horaire pour chaque type de projet.",
        validator(value: IBillingGroup[]) {
          if (value.length === 0) {
            return true;
          }

          let projectTypes = $enum(ProjectType).getValues();
          for (const billingGroup of value) {
            if (projectTypes.length === 0) {
              return false;
            }
            projectTypes = projectTypes.filter(
              (projectType) => projectType !== billingGroup.projectType
            );
          }
          return projectTypes.length === 0;
        }
      }
    ]
  }
});

async function encryptPassword(
  password: string,
  salt: string = "",
  encryptionFunction: string = "",
  iterationCount: number = 0,
  outLength: number = 0
) {
  salt =
    salt ||
    crypto
      .randomBytes(parseInt(process.env.SALTSIZE as string, 10))
      .toString("hex");
  encryptionFunction = encryptionFunction || (process.env.ENCFUNC as string);
  iterationCount =
    iterationCount || parseInt(process.env.ITERCOUNT as string, 10);
  outLength = outLength || parseInt(process.env.OUTLENGTH as string, 10);

  const asyncEncFn = promisify(crypto.pbkdf2);

  return [
    base64url.encode(iterationCount.toString(16)),
    base64url.encode(encryptionFunction),
    base64url.encode(outLength.toString(16)),
    base64url.encode(salt),
    base64url.encode(
      (await asyncEncFn(
        password,
        salt,
        iterationCount,
        outLength,
        encryptionFunction
      )).toString("hex")
    )
  ].join(".");
}

UserSchema.methods.setPassword = async function(plainTextPassword: string) {
  this.password = await encryptPassword(plainTextPassword);
};

UserSchema.methods.checkPassword = async function(
  this: IUser,
  password: string
) {
  if (!password) {
    return false;
  }

  const parts = (this.password as string).split(".");
  const iterationCount = parseInt(base64url.decode(parts[0]), 16);
  const encryptionFunction = base64url.decode(parts[1]);
  const outLength = parseInt(base64url.decode(parts[2]), 16);
  const salt = base64url.decode(parts[3]);

  return (
    this.password ===
    (await encryptPassword(
      password,
      salt,
      encryptionFunction,
      iterationCount,
      outLength
    ))
  );
};

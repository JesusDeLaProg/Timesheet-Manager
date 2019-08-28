/* tslint:disable:object-literal-sort-keys */
import base64url from "base64url";
import crypto from "crypto";
import { Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

import { IUser } from "../../../../../../types/datamodels";
import unique from "../../validators/unique";

export const UserSchema = new Schema({
  nomUsager: {
    type: String,
    required: [true, "Vous devez entrer un nom d'usager unique."],
    unique: true,
    trim: true,
    validate: [
      unique("User", "nomUsager", "Vous devez entrer un nom d'usager unique."),
      {
        type: "StringLengthValidator",
        msg: "Le nom d'usager doit avoir au moins 3 caractères.",
        validator(value: string) {
          return !!value && isLength(value, { min: 3 });
        }
      }
    ]
  },
  prenom: {
    type: String,
    trim: true,
    required: [
      function(this: IUser) {
        return (
          !!(this.prenom || this.nom) && (this.prenom.trim() || this.nom.trim())
        );
      },
      "Vous devez entrer au moins soit un prénom, soit un nom de famille."
    ]
  },
  nom: {
    type: String,
    trim: true,
    required: [
      function(this: IUser) {
        return (
          !!(this.prenom || this.nom) && (this.prenom.trim() || this.nom.trim())
        );
      },
      "Vous devez entrer au moins soit un prénom, soit un nom de famille."
    ]
  },
  role: {
    type: Number
  },
  courriel: {
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
  motDePasse: {
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
  }
});

function encryptPassword(
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

  return [
    base64url.encode(iterationCount.toString(16)),
    base64url.encode(encryptionFunction),
    base64url.encode(outLength.toString(16)),
    base64url.encode(salt),
    base64url.encode(
      crypto
        .pbkdf2Sync(
          password,
          salt,
          iterationCount,
          outLength,
          encryptionFunction
        )
        .toString("hex")
    )
  ].join(".");
}

UserSchema.virtual("plainTextPassword")
  .get(() => "")
  .set(function(this: IUser, plainTextPassword: string) {
    if (!isLength(plainTextPassword, { min: 3 })) {
      this.motDePasse = ".".repeat((plainTextPassword || { length: 0 }).length);
    } else {
      this.motDePasse = encryptPassword(plainTextPassword);
    }
  });

UserSchema.methods.checkPasswords = function(this: IUser, password: string) {
  if (!password) {
    return false;
  }

  const parts = (this.motDePasse as string).split(".");
  const iterationCount = parseInt(base64url.decode(parts[0]), 16);
  const encryptionFunction = base64url.decode(parts[1]);
  const outLength = parseInt(base64url.decode(parts[2]), 16);
  const salt = base64url.decode(parts[3]);

  return (
    this.motDePasse ===
    encryptPassword(
      password,
      salt,
      encryptionFunction,
      iterationCount,
      outLength
    )
  );
};

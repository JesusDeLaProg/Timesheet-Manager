import { ObjectId } from "bson";
import { Request } from "express";
import fs from "fs";
import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import path from "path";

import { IUserRole } from "../../../../types/datamodels";
import { JWTPayload } from "../../interfaces/routers";

declare type DoneFunction = (
  err: any,
  result: { _id: ObjectId; role: IUserRole } | false
) => unknown;
declare type VerifyFunction = (
  payload: JWTPayload,
  done: DoneFunction
) => unknown;

export default function setup(verifyFunction: VerifyFunction) {
  const jwtSecretOrKey =
    process.env.JWTSECRET ||
    fs.readFileSync(path.resolve(process.cwd(), "keys/jwt/server.crt"));

  function extractJWT(req: Request) {
    let jwt = null;
    if (req && req.cookies && req.cookies.SESSIONID) {
      jwt = req.cookies.SESSIONID;
    }
    return jwt;
  }

  passport.use(
    new JWTStrategy(
      {
        algorithms: [
          process.env.JWTSECRET ? "HS256" : process.env.JWTALGO || ""
        ],
        issuer: process.env.APPNAME,
        jwtFromRequest: extractJWT,
        secretOrKey: jwtSecretOrKey
      },
      verifyFunction
    )
  );
}

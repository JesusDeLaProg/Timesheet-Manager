import { Request } from "express";
import { Types } from "mongoose";
import { Router } from "express-serve-static-core";
import { ObjectId } from "bson";

import { IUserRole } from "../../../types/datamodels";

export interface JWTPayload {
  user: string
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      _id: ObjectId,
      role: IUserRole
    }
  }
}

export interface HasRouter {
  readonly router: Router;
}

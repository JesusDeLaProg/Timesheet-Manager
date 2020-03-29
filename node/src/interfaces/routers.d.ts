import { ObjectId } from "bson";
import { Router } from "express-serve-static-core";

import { IUserRole } from "../../../types/datamodels";

export interface IJWTPayload {
  user: string;
}

declare module "express-serve-static-core" {
  // tslint:disable-next-line
  interface Request {
    user?: {
      _id: ObjectId;
      role: IUserRole;
    };
  }
}

export interface IHasRouter {
  readonly router: Router;
}

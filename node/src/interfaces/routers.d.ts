import { Request } from "express";
import { Types } from "mongoose";
import { Router } from "express-serve-static-core";

export interface RequestWithUser extends Request {
  user: {
    _id: Types.ObjectId
  };
}

export interface HasRouter {
  readonly router: Router;
}

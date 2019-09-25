import { NextFunction, Request, Response } from "express";

import { UserRole } from "../../constants/enums/user-role";
import { CrudResult } from "../utils/crud-result";

interface IAuthorizeOptions {
  allow?: UserRole[];
  block?: UserRole[];
}

export default function authorize(options: IAuthorizeOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not enough permissions.") as Error & {
      code: number;
    };
    error.code = 403;

    if (!req.user || !req.user.role) {
      return next(CrudResult.Failure(error));
    }

    if (options.allow) {
      for (const role of options.allow) {
        if (role === req.user.role) {
          return next();
        }
      }
      return next(CrudResult.Failure(error));
    } else if (options.block) {
      for (const role of options.block) {
        if (role === req.user.role) {
          return next(CrudResult.Failure(error));
        }
      }
      return next();
    } else {
      return next(CrudResult.Failure(error));
    }
  };
}

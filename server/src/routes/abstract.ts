import { NextFunction, Request, Response } from "express";

import { ICrudResult } from "../../../types/viewmodels";
import { CrudResult } from "../infrastructure/utils/crud-result";
import { IQueryOptions } from "../interfaces/controllers";

export default {
  sendResultOrGiveToErrorHandler(
    result: ICrudResult,
    res: Response,
    next: NextFunction
  ) {
    if (result.success) {
      res.type("json").status(200).send(result);
    } else {
      next(result);
    }
  },

  buildErrorCrudResultFromError(error: any) {
    if (error instanceof CrudResult) {
      return error;
    } else {
      return CrudResult.Failure(error);
    }
  },

  buildQueryOptionsFromRequest(req: Request): IQueryOptions {
    return {
      limit: +((req.query || {}).limit || 0),
      skip: +((req.query || {}).skip || 0),
      sort: (req.query || {}).sort || "",
    };
  },
};

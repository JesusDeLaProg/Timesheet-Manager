import { NextFunction, Request, Response } from "express";

import { ICrudResult } from "../../../../types/viewmodels";
import { QueryOptions } from "../../interfaces/controllers";

export default {
  sendResultOrGiveToErrorHandler(
    result: ICrudResult,
    res: Response,
    next: NextFunction
  ) {
    if (result.success) {
      res
        .type("json")
        .status(200)
        .send(result);
    } else {
      next(result);
    }
  },

  buildErrorCrudResultFromError(error: any): ICrudResult {
    return {
      message: error.message,
      result: error,
      success: false
    };
  },

  buildQueryOptionsFromRequest(req: Request): QueryOptions {
    return {
      limit: +((req.query || {}).limit || 0),
      skip: +((req.query || {}).skip || 0),
      sort: (req.query || {}).sort || ""
    };
  }
};

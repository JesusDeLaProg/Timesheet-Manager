import { NextFunction, Response, Request } from "express";

import { CrudResult } from "../../../../types/viewmodels";
import { QueryOptions } from "../../interfaces/controllers";

export abstract class AbstractRouter {
  protected sendResultOrGiveToErrorHandler(
    result: CrudResult,
    res: Response,
    next: NextFunction
  ) {
    if (result.success) {
      res
        .type("json")
        .status(200)
        .send(result);
    }
  }

  protected buildErrorCrudResultFromError(error: any): CrudResult {
    return {
      success: false,
      message: error.message,
      result: error
    };
  }

  protected buildQueryOptionsFromRequest(req: Request): QueryOptions {
    return {
      limit: +((req.params || {}).limit || 0),
      skip: +((req.params || {}).skip || 0),
      sort: (req.params || {}).sort || ""
    };
  }
}

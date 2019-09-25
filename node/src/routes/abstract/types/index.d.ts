import { NextFunction, Request, Response } from "express";
import { ICrudResult } from "../../../../types/viewmodels";
import { QueryOptions } from "../../interfaces/controllers";
declare const _default: {
    sendResultOrGiveToErrorHandler(result: ICrudResult<any>, res: Response, next: NextFunction): void;
    buildErrorCrudResultFromError(error: any): ICrudResult<any>;
    buildQueryOptionsFromRequest(req: Request): QueryOptions;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
import { NextFunction, Request, Response } from "express";
import { CrudResult } from "../../../../types/viewmodels";
import { QueryOptions } from "../../interfaces/controllers";
declare const _default: {
    sendResultOrGiveToErrorHandler(result: CrudResult<any>, res: Response, next: NextFunction): void;
    buildErrorCrudResultFromError(error: any): CrudResult<any>;
    buildQueryOptionsFromRequest(req: Request): QueryOptions;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
import { ICrudResult } from "../../../../types/viewmodels";
export declare class CrudResult<T = any> implements ICrudResult<T> {
    static Success<U>(result: U, message?: string): CrudResult<U>;
    static Failure<U>(error: U, message?: string): CrudResult<U>;
    readonly message: string;
    readonly result: T | null;
    readonly success: boolean;
    constructor(crudResult: ICrudResult<T>);
}
//# sourceMappingURL=crud-result.d.ts.map
import { Document, Error, Model as ModelType } from "mongoose";
import { CrudResult, QueryOptions, IController } from "../../interfaces/controllers";
export declare abstract class AbstractController<T extends Document> implements IController<T> {
    private Model;
    constructor(Model: ModelType<T>);
    getById(id: string): CrudResult<T>;
    getAll(options?: QueryOptions): CrudResult<T[]>;
    count(): CrudResult<number>;
    validate(document: T): CrudResult<Error.ValidationError>;
    save(document: T): CrudResult<T | Error.ValidationError>;
    deleteById(id: string): CrudResult;
}
//# sourceMappingURL=index.d.ts.map
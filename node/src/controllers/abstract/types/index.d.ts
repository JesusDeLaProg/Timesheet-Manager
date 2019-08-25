import { Document, Error, Model as ModelType } from "mongoose";
import { QueryOptions, IController } from "../../interfaces/controllers";
import { IViewInterface, CrudResult } from "../../../../types/viewmodels";
export declare abstract class AbstractController<T extends IViewInterface> implements IController<T> {
    private Model;
    constructor(Model: ModelType<T & Document>);
    getById(id: string): Promise<CrudResult<T>>;
    getAll(options?: QueryOptions): Promise<CrudResult<T[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: T): Promise<CrudResult<Error.ValidationError>>;
    save(document: T): Promise<CrudResult<T | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult>;
}
//# sourceMappingURL=index.d.ts.map
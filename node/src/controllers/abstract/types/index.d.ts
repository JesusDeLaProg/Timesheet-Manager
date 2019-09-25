import { Document, DocumentQuery, Error as MongooseError, Model as ModelType } from "mongoose";
import { ICrudResult, IViewInterface } from "../../../../types/viewmodels";
import { IController, QueryOptions } from "../../interfaces/controllers";
export declare abstract class AbstractController<T extends IViewInterface> implements IController<T> {
    private Model;
    constructor(Model: ModelType<T & Document>);
    getById(id: string): Promise<ICrudResult<T>>;
    getAll(options?: QueryOptions): Promise<ICrudResult<T[]>>;
    count(): Promise<ICrudResult<number>>;
    validate(input: T): Promise<ICrudResult<MongooseError.ValidationError>>;
    save(input: T): Promise<ICrudResult<T | MongooseError.ValidationError>>;
    protected applyQueryOptions<U, V extends Document>(query: DocumentQuery<U, V>, options?: QueryOptions): DocumentQuery<U, V>;
    protected objectToDocument(input: T): Promise<T & Document>;
}
//# sourceMappingURL=index.d.ts.map
import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { CrudResult, QueryOptions, IUserController } from "../../interfaces/controllers";
import { UserModel, UserDocument } from "../../interfaces/models";
export declare class UserController extends AbstractController<UserDocument> implements IUserController {
    private User;
    constructor(User: UserModel);
    getById(id: string): CrudResult<UserDocument>;
    getAll(options?: QueryOptions | undefined): CrudResult<UserDocument[]>;
    count(): CrudResult<number>;
    validate(document: UserDocument): CrudResult<Error.ValidationError>;
    save(document: UserDocument): CrudResult<UserDocument | Error.ValidationError>;
    deleteById(id: string): CrudResult<any>;
}
//# sourceMappingURL=index.d.ts.map
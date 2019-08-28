import { Error } from "mongoose";
import { CrudResult, IViewUser } from "../../../../types/viewmodels";
import { IUserController, QueryOptions } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class UserController extends AbstractController<IViewUser> implements IUserController {
    private User;
    constructor(User: UserModel);
    getById(id: string): Promise<CrudResult<IViewUser>>;
    getAll(options?: QueryOptions | undefined): Promise<CrudResult<IViewUser[]>>;
    count(): Promise<CrudResult<number>>;
    validate(document: IViewUser): Promise<CrudResult<Error.ValidationError>>;
    save(document: IViewUser): Promise<CrudResult<IViewUser | Error.ValidationError>>;
    deleteById(id: string): Promise<CrudResult<any>>;
}
//# sourceMappingURL=index.d.ts.map
import { Error } from "mongoose";
import { AbstractController } from "../abstract";
import { QueryOptions, IUserController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import { IViewUser, CrudResult } from "../../../../types/viewmodels";
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
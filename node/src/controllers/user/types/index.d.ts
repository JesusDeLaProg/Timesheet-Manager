import { Error as MongooseError } from "mongoose";
import { StringId } from "../../../../types/datamodels";
import { ICrudResult, IViewUser } from "../../../../types/viewmodels";
import { IUserController } from "../../interfaces/controllers";
import { UserDocument, UserModel } from "../../interfaces/models";
import { AbstractController } from "../abstract";
export declare class UserController extends AbstractController<IViewUser> implements IUserController {
    private User;
    constructor(User: UserModel);
    validate(input: IViewUser, authenticatedUserId?: StringId): Promise<ICrudResult<MongooseError.ValidationError>>;
    save(input: IViewUser, authenticatedUserId?: StringId): Promise<ICrudResult<IViewUser | MongooseError.ValidationError>>;
    protected objectToDocument(input: IViewUser): Promise<UserDocument>;
    private getAuthenticatedUser;
    private validatePrivileges;
    private checkUpdatePrivileges;
    private checkCreatePrivileges;
}
//# sourceMappingURL=index.d.ts.map
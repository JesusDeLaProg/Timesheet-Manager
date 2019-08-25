import { IAuthController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import { CrudResult } from "../../../../types/viewmodels";
export declare class AuthController implements IAuthController {
    private User;
    constructor(User: UserModel);
    login(username: string, password: string): Promise<CrudResult<string>>;
}
//# sourceMappingURL=index.d.ts.map
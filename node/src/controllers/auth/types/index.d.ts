import { CrudResult } from "../../../../types/viewmodels";
import { IAuthController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
export declare class AuthController implements IAuthController {
    private User;
    constructor(User: UserModel);
    login(username: string, password: string): Promise<CrudResult<string>>;
}
//# sourceMappingURL=index.d.ts.map
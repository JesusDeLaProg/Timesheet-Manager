import { IAuthController, CrudResult } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
export declare class AuthController implements IAuthController {
    private User;
    constructor(User: UserModel);
    login(username: string, password: string): CrudResult<string>;
}
//# sourceMappingURL=index.d.ts.map
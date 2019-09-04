import { ICrudResult } from "../../../../types/viewmodels";
import { IAuthController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
export declare class AuthController implements IAuthController {
    private User;
    constructor(User: UserModel);
    login(username: string, password: string): Promise<ICrudResult<string>>;
}
//# sourceMappingURL=index.d.ts.map
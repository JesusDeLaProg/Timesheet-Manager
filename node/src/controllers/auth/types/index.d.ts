import { ICrudResult } from "../../../../types/viewmodels";
import { IAuthController } from "../../interfaces/controllers";
import { UserModel } from "../../interfaces/models";
import { JWTPayload } from "../../interfaces/routers";
export declare class AuthController implements IAuthController {
    private User;
    private readonly _jwtKeyOrSecret;
    constructor(User: UserModel);
    login(username: string, password: string): Promise<ICrudResult<string>>;
    createJWT(payload: JWTPayload): string;
}
//# sourceMappingURL=index.d.ts.map
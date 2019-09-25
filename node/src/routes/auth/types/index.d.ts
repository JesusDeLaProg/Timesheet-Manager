import { IAuthController, IUserController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class AuthRouter implements HasRouter {
    private _authController;
    private _userController;
    readonly router: import("express-serve-static-core").Router;
    readonly authenticationMiddlewares: import("express-serve-static-core").Router;
    constructor(_authController: IAuthController, _userController: IUserController);
    private _init;
    private _setAuthCookieAndHeader;
}
//# sourceMappingURL=index.d.ts.map
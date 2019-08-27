import { IAuthController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class AuthRouter implements HasRouter {
    private _authController;
    readonly router: import("express-serve-static-core").Router;
    constructor(_authController: IAuthController);
    private _init;
}
//# sourceMappingURL=index.d.ts.map
import { IUserController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class UserRouter implements HasRouter {
    private _userController;
    readonly router: import("express-serve-static-core").Router;
    constructor(_userController: IUserController);
    private _init;
}
//# sourceMappingURL=index.d.ts.map
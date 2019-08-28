import { IClientController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class ClientRouter implements HasRouter {
    private _clientController;
    readonly router: import("express-serve-static-core").Router;
    constructor(_clientController: IClientController);
    private _init;
}
//# sourceMappingURL=index.d.ts.map
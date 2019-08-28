import { IPhaseController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class PhaseRouter implements HasRouter {
    private _phaseController;
    readonly router: import("express-serve-static-core").Router;
    constructor(_phaseController: IPhaseController);
    private _init;
}
//# sourceMappingURL=index.d.ts.map
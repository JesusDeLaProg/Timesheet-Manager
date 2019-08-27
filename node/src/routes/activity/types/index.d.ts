import { IActivityController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class ActivityRouter implements HasRouter {
    private _activityController;
    readonly router: import("express-serve-static-core").Router;
    constructor(_activityController: IActivityController);
    private _init;
}
//# sourceMappingURL=index.d.ts.map
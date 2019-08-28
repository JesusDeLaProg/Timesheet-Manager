import { ITimesheetController } from "../../interfaces/controllers";
import { HasRouter } from "../../interfaces/routers";
export declare class TimesheetRouter implements HasRouter {
    private _timesheetController;
    readonly router: import("express-serve-static-core").Router;
    constructor(_timesheetController: ITimesheetController);
    private _init;
}
//# sourceMappingURL=index.d.ts.map
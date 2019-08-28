import { ContainerModule } from "inversify";
import { HasRouter } from "../interfaces/routers";
import { ActivityRouter } from "./activity";
import { AuthRouter } from "./auth";
import { ClientRouter } from "./client";
import { PhaseRouter } from "./phase";
import { ProjectRouter } from "./project";
import { TimesheetRouter } from "./timesheet";
import { UserRouter } from "./user";
export declare class ApiRouter implements HasRouter {
    private _activityRouter;
    private _authRouter;
    private _clientRouter;
    private _phaseRouter;
    private _projectRouter;
    private _timesheetRouter;
    private _userRouter;
    readonly router: import("express-serve-static-core").Router;
    constructor(_activityRouter: ActivityRouter, _authRouter: AuthRouter, _clientRouter: ClientRouter, _phaseRouter: PhaseRouter, _projectRouter: ProjectRouter, _timesheetRouter: TimesheetRouter, _userRouter: UserRouter);
    private _init;
}
export declare const RouterModule: ContainerModule;
//# sourceMappingURL=index.d.ts.map
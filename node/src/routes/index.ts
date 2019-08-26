import { ContainerModule, inject, injectable } from "inversify";

import Routers from "../constants/symbols/routers";
import { ActivityRouter } from "./activity";
import { AuthRouter } from "./auth";
import { ClientRouter } from "./client";
import { PhaseRouter } from "./phase";
import { ProjectRouter } from "./project";
import { TimesheetRouter } from "./timesheet";
import { UserRouter } from "./user";
import { Router } from "express";

@injectable()
export class ApiRouter {
  readonly router = Router();

  constructor(
    @inject(Routers.ActivityRouter) private _activityRouter: ActivityRouter,
    @inject(Routers.AuthRouter) private _authRouter: AuthRouter,
    @inject(Routers.ClientRouter) private _clientRouter: ClientRouter,
    @inject(Routers.PhaseRouter) private _phaseRouter: PhaseRouter,
    @inject(Routers.ProjectRouter) private _projectRouter: ProjectRouter,
    @inject(Routers.TimesheetRouter) private _timesheetRouter: TimesheetRouter,
    @inject(Routers.UserRouter) private _userRouter: UserRouter
  ) {
    this._init();
  }

  private _init() {
    this.router.use("/activity", this._activityRouter.router);
    this.router.use("/auth", this._authRouter.router);
    this.router.use("/client", this._clientRouter.router);
    this.router.use("/phase", this._phaseRouter.router);
    this.router.use("/project", this._projectRouter.router);
    this.router.use("/timesheet", this._timesheetRouter.router);
    this.router.use("/user", this._userRouter.router);
  }
}

export const RouterModule = new ContainerModule(bind => {
  bind<ApiRouter>(Routers.ApiRouter).to(ApiRouter);
  bind<ActivityRouter>(Routers.ActivityRouter).to(ActivityRouter);
  bind<AuthRouter>(Routers.AuthRouter).to(AuthRouter);
  bind<ClientRouter>(Routers.ClientRouter).to(ClientRouter);
  bind<PhaseRouter>(Routers.PhaseRouter).to(PhaseRouter);
  bind<ProjectRouter>(Routers.ProjectRouter).to(ProjectRouter);
  bind<TimesheetRouter>(Routers.TimesheetRouter).to(TimesheetRouter);
  bind<UserRouter>(Routers.UserRouter).to(UserRouter);
});

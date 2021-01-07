import { Router } from "express";
import { ContainerModule, inject, injectable } from "inversify";

import { IHasRouter } from "../interfaces/routers";

import Routers from "../constants/symbols/routers";
import { ActivityRouter } from "./activity";
import { AuthRouter } from "./auth";
import { ClientRouter } from "./client";
import { PhaseRouter } from "./phase";
import { ProjectRouter } from "./project";
import { TimesheetRouter } from "./timesheet";
import { UserRouter } from "./user";

@injectable()
export class ApiRouter implements IHasRouter {
  public readonly router = Router();

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
    this.router.use("/auth", this._authRouter.router);

    this.router.use(this._authRouter.authenticationMiddlewares);

    this.router.use("/activity", this._activityRouter.router);

    this.router.use("/client", this._clientRouter.router);

    this.router.use("/phase", this._phaseRouter.router);

    this.router.use("/project", this._projectRouter.router);

    this.router.use("/timesheet", this._timesheetRouter.router);

    this.router.use("/user", this._userRouter.router);
  }
}

export const RouterModule = new ContainerModule((bind) => {
  bind<IHasRouter>(Routers.ApiRouter).to(ApiRouter);
  bind<IHasRouter>(Routers.ActivityRouter).to(ActivityRouter);
  bind<IHasRouter>(Routers.AuthRouter).to(AuthRouter);
  bind<IHasRouter>(Routers.ClientRouter).to(ClientRouter);
  bind<IHasRouter>(Routers.PhaseRouter).to(PhaseRouter);
  bind<IHasRouter>(Routers.ProjectRouter).to(ProjectRouter);
  bind<IHasRouter>(Routers.TimesheetRouter).to(TimesheetRouter);
  bind<IHasRouter>(Routers.UserRouter).to(UserRouter);
});

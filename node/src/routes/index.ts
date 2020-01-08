import { Router } from "express";
import { ContainerModule, inject, injectable } from "inversify";

import { HasRouter } from "../interfaces/routers";

import Routers from "../constants/symbols/routers";
import { ActivityRouter } from "./activity";
import { AuthRouter } from "./auth";
import { ClientRouter } from "./client";
import { PhaseRouter } from "./phase";
import { ProjectRouter } from "./project";
import { TimesheetRouter } from "./timesheet";
import { UserRouter } from "./user";

@injectable()
export class ApiRouter implements HasRouter {
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

    this.router.use(
      "/activity",
      this._activityRouter.router
    );

    this.router.use(
      "/client",
      this._clientRouter.router
    );

    this.router.use(
      "/phase",
      this._phaseRouter.router
    );

    this.router.use(
      "/project",
      this._projectRouter.router
    );

    this.router.use("/timesheet", this._timesheetRouter.router);

    this.router.use(
      "/user",
      this._userRouter.router
    );
  }
}

export const RouterModule = new ContainerModule((bind) => {
  bind<HasRouter>(Routers.ApiRouter).to(ApiRouter);
  bind<HasRouter>(Routers.ActivityRouter).to(ActivityRouter);
  bind<HasRouter>(Routers.AuthRouter).to(AuthRouter);
  bind<HasRouter>(Routers.ClientRouter).to(ClientRouter);
  bind<HasRouter>(Routers.PhaseRouter).to(PhaseRouter);
  bind<HasRouter>(Routers.ProjectRouter).to(ProjectRouter);
  bind<HasRouter>(Routers.TimesheetRouter).to(TimesheetRouter);
  bind<HasRouter>(Routers.UserRouter).to(UserRouter);
});

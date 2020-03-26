import { ContainerModule } from "inversify";

import Controllers from "../constants/symbols/controllers";
import {
  IActivityController,
  IAuthController,
  IClientController,
  IPhaseController,
  IProjectController,
  ITimesheetController
} from "../interfaces/controllers";
import { ActivityController } from "./activity";
import { AuthController } from "./auth";
import { ClientController } from "./client";
import { PhaseController } from "./phase";
import { ProjectController } from "./project";
import { TimesheetController } from "./timesheet";
import { UserController } from "./user";

export const ControllerModule = new ContainerModule((bind) => {
  bind<IActivityController>(Controllers.ActivityController).to(
    ActivityController
  );
  bind<IAuthController>(Controllers.AuthController).to(AuthController);
  bind<IClientController>(Controllers.ClientController).to(ClientController);
  bind<IPhaseController>(Controllers.PhaseController).to(PhaseController);
  bind<IProjectController>(Controllers.ProjectController).to(ProjectController);
  bind<ITimesheetController>(Controllers.TimesheetController).to(
    TimesheetController
  );
  bind<UserController>(Controllers.UserController).to(UserController);
});

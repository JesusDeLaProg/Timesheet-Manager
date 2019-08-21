import { ContainerModule } from "inversify";

import Controllers from "../constants/symbols/controllers";
import { ActivityController } from "./activity";
import { AuthController } from "./auth";
import { ClientController } from "./client";
import { PhaseController } from "./phase";
import { ProjectController } from "./project";
import { TimesheetController } from "./timesheet";
import { UserController } from "./user";

export const ControllerModule = new ContainerModule(bind => {
  bind<ActivityController>(Controllers.ActivityController).to(
    ActivityController
  );
  bind<AuthController>(Controllers.AuthController).to(AuthController);
  bind<ClientController>(Controllers.ClientController).to(ClientController);
  bind<PhaseController>(Controllers.PhaseController).to(PhaseController);
  bind<ProjectController>(Controllers.ProjectController).to(ProjectController);
  bind<TimesheetController>(Controllers.TimesheetController).to(
    TimesheetController
  );
  bind<UserController>(Controllers.UserController).to(UserController);
});

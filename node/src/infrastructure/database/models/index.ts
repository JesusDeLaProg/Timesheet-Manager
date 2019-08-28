import { ContainerModule } from "inversify";
import { model } from "mongoose";

import Models from "../../../constants/symbols/models";
import {
  ActivityDocument,
  ActivityModel,
  ClientDocument,
  ClientModel,
  PhaseDocument,
  PhaseModel,
  ProjectDocument,
  ProjectModel,
  TimesheetDocument,
  TimesheetModel,
  UserDocument,
  UserModel
} from "../../../interfaces/models";
import {
  ActivitySchema,
  ClientSchema,
  PhaseSchema,
  ProjectSchema,
  TimesheetSchema,
  UserSchema
} from "../schemas";

export const ModelModule = new ContainerModule((bind) => {
  bind<ActivityModel>(Models.Activity).toConstantValue(
    model<ActivityDocument>("Activity", ActivitySchema)
  );
  bind<ClientModel>(Models.Client).toConstantValue(
    model<ClientDocument>("Client", ClientSchema)
  );
  bind<PhaseModel>(Models.Phase).toConstantValue(
    model<PhaseDocument>("Phase", PhaseSchema)
  );
  bind<ProjectModel>(Models.Project).toConstantValue(
    model<ProjectDocument>("Project", ProjectSchema)
  );
  bind<TimesheetModel>(Models.Timesheet).toConstantValue(
    model<TimesheetDocument>("Timesheet", TimesheetSchema)
  );
  bind<UserModel>(Models.User).toConstantValue(
    model<UserDocument>("User", UserSchema)
  );
});

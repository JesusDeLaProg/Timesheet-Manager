export { ActivitySchema } from "./activity";
export { ClientSchema } from "./client";
export { PhaseSchema } from "./phase";
export { ProjectSchema } from "./project";
export { TimesheetSchema } from "./timesheet";
export { UserSchema } from "./user";
import setupLogging from "../../logging/setup";
import { ActivitySchema } from "./activity";
import { ClientSchema } from "./client";
import { PhaseSchema } from "./phase";
import { ProjectSchema } from "./project";
import { TimesheetSchema } from "./timesheet";
import { UserSchema } from "./user";

setupLogging("Activity", ActivitySchema);
setupLogging("Client", ClientSchema);
setupLogging("Phase", PhaseSchema);
setupLogging("Project", ProjectSchema);
setupLogging("Timesheet", TimesheetSchema);
setupLogging("User", UserSchema);

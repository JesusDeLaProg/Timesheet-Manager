import { ContainerModule } from "inversify";

import Controllers from "../constants/symbols/controllers";
import { UserController } from "./user";

export const ControllerModule = new ContainerModule(bind => {
  bind<UserController>(Controllers.UserController).to(UserController);
});

import { ProjectType } from "./enums/project-type";
import { UserRole } from "./enums/user-role";
import Controllers from "./symbols/controllers";
import Models from "./symbols/models";
import { SERVER_KEY_OR_SECRET } from "./symbols/parameters";
import Routers from "./symbols/routers";

export default {
  enums: {
    ProjectType,
    UserRole,
  },
  symbols: {
    Controllers,
    Models,
    Routers,
    Parameters: {
      SERVER_KEY_PATH: SERVER_KEY_OR_SECRET,
    },
  },
};

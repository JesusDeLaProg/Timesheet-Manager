import { injectable, inject } from "inversify";

import { UserModel } from "../../modeltypes";
import Models from "../../constants/symbols/models";

@injectable()
export class UserController {
  @inject(Models.User) private User!: UserModel;
}
